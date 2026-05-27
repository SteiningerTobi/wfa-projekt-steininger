import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CourseSystem } from '../../shared/course-system';
import { Course } from '../../shared/classes/course';
import { TrainerInfo } from '../trainer-info/trainer-info';
import { SessionList } from '../session-list/session-list';
import { BookingService } from '../../shared/booking-service';
import { AuthenticationService } from '../../shared/authentication.service';

// Komponente für die Detailansicht eines Kurses inklusive Buchungslogik.
@Component({
  selector: 'bs-course-detail',
  standalone: true,
  imports: [
    RouterLink,
    TrainerInfo,
    SessionList
  ],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.css'
})
export class CourseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseStore = inject(CourseSystem);
  private bookingService = inject(BookingService);
  private authService = inject(AuthenticationService);
  private toastr = inject(ToastrService);

  course = signal<Course | null>(null);
  isBookingAllSessions = signal(false);
  bookedSessionIds = signal<number[]>([]);
  bookingRefreshToken = signal(0);

  // Lädt beim Öffnen der Seite Kursdaten und bereits gebuchte Termine.
  ngOnInit(): void {
    this.loadCourse();
    this.loadBookedSessions();
  }

  // Lädt alle aktiven Terminbuchungen des eingeloggten Users.
  loadBookedSessions(): void {
    if (!this.authService.isLoggedIn()) {
      this.bookedSessionIds.set([]);
      return;
    }

    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        const ids = bookings
          .filter(booking => booking.status === 'active')
          .flatMap(booking => booking.sessions)
          .filter(session => session.pivot?.status === 'active')
          .map(session => Number(session.id));

        this.bookedSessionIds.set(ids);
      },
      error: () => {
        this.bookedSessionIds.set([]);
      }
    });
  }

  // Ermittelt alle zukünftig buchbaren und nicht ausgebuchten Termine.
  getBookableSessionIds(): number[] {
    const currentCourse = this.course();

    if (!currentCourse?.sessions?.length) {
      return [];
    }

    const now = new Date();

    return currentCourse.sessions
      .filter(session => new Date(session.start_date) > now)
      .filter(session => session.status !== 'cancelled')
      .filter(session => currentCourse.max_capacity <= 0 || session.booked_count < currentCourse.max_capacity)
      .map(session => Number(session.id));
  }

  // Prüft, ob bereits alle buchbaren Termine dieses Kurses gebucht wurden.
  areAllSessionsBooked(): boolean {
    const bookableSessionIds = this.getBookableSessionIds();

    if (!bookableSessionIds.length) {
      return false;
    }

    return bookableSessionIds.every(sessionId =>
      this.bookedSessionIds().includes(sessionId)
    );
  }

  // Lädt den Kurs anhand der ID aus der URL.
  loadCourse(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.toastr.error(
        'Kurs konnte nicht geladen werden.',
        'Fehler'
      );
      return;
    }

    this.courseStore.getSingle(id).subscribe({
      next: (course) => {
        this.course.set(course);
      },
      error: () => {
        this.toastr.error(
          'Kurs konnte nicht geladen werden.',
          'Fehler'
        );
      }
    });
  }

  // Übersetzt technische Schwierigkeitswerte in sichtbare Labels.
  getDifficultyLabel(difficulty: string): string {
    switch (difficulty) {
      case 'beginner':
        return 'Anfänger';
      case 'intermediate':
        return 'Fortgeschrittene';
      case 'advanced':
        return 'Profis';
      default:
        return difficulty;
    }
  }

  // Scrollt zum Terminbereich der Detailseite.
  scrollToSessions(): void {
    document.getElementById('sessions')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  // Bucht alle noch offenen Termine eines Kurses.
  bookAllSessions(): void {
    const currentCourse = this.course();

    if (!currentCourse) {
      this.toastr.error(
        'Kurs konnte nicht geladen werden.',
        'Fehler'
      );
      return;
    }

    if (this.isBookingAllSessions()) {
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.toastr.info(
        'Bitte melde dich zuerst an, um Termine zu buchen.',
        'Login erforderlich'
      );

      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: `/courses/${currentCourse.id}`
        }
      });

      return;
    }

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.toastr.info(
        'Bitte melde dich zuerst an, um Termine zu buchen.',
        'Login erforderlich'
      );

      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: `/courses/${currentCourse.id}`
        }
      });

      return;
    }

    if (currentUser.id === currentCourse.trainer_id) {
      this.toastr.warning(
        'Du kannst deine eigenen Kurse nicht buchen.',
        'Buchung nicht erlaubt'
      );
      return;
    }

    if (!currentCourse.sessions?.length) {
      this.toastr.info(
        'Für diesen Kurs sind aktuell keine Termine vorhanden.',
        'Keine Termine'
      );
      return;
    }

    const possibleSessionIds = this.getBookableSessionIds();

    if (!possibleSessionIds.length) {
      this.toastr.info(
        'Es gibt aktuell keine buchbaren zukünftigen Termine.',
        'Keine Termine'
      );
      return;
    }

    this.isBookingAllSessions.set(true);

    // Prüft zuerst bestehende Buchungen, damit nur noch offene Termine gebucht werden.
    this.bookingService.getMyBookings().subscribe({
      next: (bookings) => {
        const alreadyBookedSessionIds = bookings
          .filter(booking => booking.status === 'active')
          .flatMap(booking => booking.sessions)
          .filter(session => session.pivot?.status === 'active')
          .map(session => Number(session.id));

        this.bookedSessionIds.set(alreadyBookedSessionIds);

        const remainingSessionIds = possibleSessionIds.filter(
          sessionId => !alreadyBookedSessionIds.includes(sessionId)
        );

        if (!remainingSessionIds.length) {
          this.toastr.info(
            'Du hast bereits alle verfügbaren Termine dieses Kurses gebucht.',
            'Bereits gebucht'
          );

          this.isBookingAllSessions.set(false);
          return;
        }

        this.bookingService.bookSessions(remainingSessionIds).subscribe({
          next: () => {
            this.toastr.success(
              'Alle noch offenen Termine wurden erfolgreich gebucht.',
              'Buchung erfolgreich'
            );

            this.loadCourse();
            this.loadBookedSessions();
            this.isBookingAllSessions.set(false);
            this.bookingRefreshToken.update(value => value + 1);
          },
          error: (error) => {
            this.isBookingAllSessions.set(false);

            if (error.status === 409) {
              this.toastr.warning(
                'Einige Termine waren bereits gebucht. Die restlichen konnten nicht vollständig verarbeitet werden.',
                'Teilweise bereits gebucht'
              );

              this.loadCourse();
              return;
            }

            if (error.status === 403) {
              this.toastr.warning(
                error.error?.message ?? 'Diese Buchung ist nicht erlaubt.',
                'Buchung nicht erlaubt'
              );
              return;
            }

            if (error.status === 401) {
              this.toastr.info(
                'Bitte melde dich erneut an.',
                'Login erforderlich'
              );

              this.router.navigate(['/login'], {
                queryParams: {
                  returnUrl: `/courses/${currentCourse.id}`
                }
              });

              return;
            }

            this.toastr.error(
              error.error?.message ?? 'Die Termine konnten nicht gebucht werden.',
              'Buchung fehlgeschlagen'
            );
          }
        });
      },
      error: () => {
        this.isBookingAllSessions.set(false);

        this.toastr.error(
          'Deine bestehenden Buchungen konnten nicht geprüft werden.',
          'Fehler'
        );
      }
    });
  }
}
