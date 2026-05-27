import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { CourseSession } from '../../shared/classes/course-session';
import { LoginArea } from '../../account/login-area/login-area';
import { AuthenticationService } from '../../shared/authentication.service';
import { BookingService } from '../../shared/booking-service';

// Komponente für die Anzeige und Buchung von Kursterminen.
@Component({
  selector: 'bs-session-list',
  standalone: true,
  imports: [
    DatePipe,
    LoginArea
  ],
  templateUrl: './session-list.html',
  styleUrl: './session-list.css'
})
export class SessionList implements OnInit, OnChanges {
  @Input() sessions: CourseSession[] = [];
  @Input() maxCapacity = 0;
  @Input() trainerId!: number;
  @Input() courseId!: number;
  @Input() refreshToken = 0;

  private authService = inject(AuthenticationService);
  private bookingService = inject(BookingService);
  private toastr = inject(ToastrService);

  showLoginModal = signal(false);
  bookedSessionIds = signal<number[]>([]);

  // Lädt beim Initialisieren bereits gebuchte Termine.
  ngOnInit(): void {
    this.loadBookedSessions();
  }

  // Aktualisiert gebuchte Termine, wenn der Parent ein Refresh auslöst.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshToken'] && !changes['refreshToken'].firstChange) {
      this.loadBookedSessions();
    }
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

  // Übersetzt technische Termin-Statuswerte für die Anzeige.
  getStatusLabel(status: string): string {
    switch (status) {
      case 'planned':
        return 'Geplant';
      case 'cancelled':
        return 'Abgesagt';
      case 'past':
        return 'Abgeschlossen';
      default:
        return status;
    }
  }

  // Prüft, ob der Termin vom aktuellen User bereits gebucht wurde.
  isAlreadyBooked(session: CourseSession): boolean {
    return this.bookedSessionIds().includes(Number(session.id));
  }

  // Prüft, ob die maximale Teilnehmerzahl erreicht ist.
  isFullyBooked(session: CourseSession): boolean {
    return this.maxCapacity > 0 && session.booked_count >= this.maxCapacity;
  }

  // Berechnet die noch freien Plätze eines Termins.
  getFreeSpots(session: CourseSession): number {
    return Math.max(this.maxCapacity - session.booked_count, 0);
  }

  // Prüft alle Bedingungen und startet danach die Buchung.
  handleBookingClick(session: CourseSession): void {
    if (this.isAlreadyBooked(session)) {
      this.toastr.info(
        'Du hast diesen Termin bereits gebucht.',
        'Bereits gebucht'
      );
      return;
    }

    if (this.isFullyBooked(session)) {
      this.toastr.warning(
        'Dieser Termin ist bereits ausgebucht.',
        'Ausgebucht'
      );
      return;
    }

    if (!this.authService.isLoggedIn()) {
      this.toastr.info(
        'Bitte melde dich zuerst an, um diesen Termin zu buchen.',
        'Login erforderlich'
      );

      this.openLoginModal();
      return;
    }

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.toastr.info(
        'Bitte melde dich zuerst an, um diesen Termin zu buchen.',
        'Login erforderlich'
      );

      this.openLoginModal();
      return;
    }

    if (currentUser.id === this.trainerId) {
      this.toastr.warning(
        'Du kannst deine eigenen Kurse nicht buchen.',
        'Buchung nicht erlaubt'
      );
      return;
    }

    this.initBooking(session);
  }

  // Sendet die Buchung an das Backend und aktualisiert danach die Anzeige.
  initBooking(session: CourseSession): void {
    this.bookingService.bookSessions([session.id]).subscribe({
      next: () => {
        this.toastr.success(
          'Der Termin wurde erfolgreich gebucht.',
          'Buchung erfolgreich'
        );

        this.bookedSessionIds.update(ids => [...ids, Number(session.id)]);
        session.booked_count += 1;
        this.showLoginModal.set(false);

        this.loadBookedSessions();
      },
      error: (error) => {
        if (error.status === 409) {
          this.toastr.warning(
            'Du hast diesen Termin bereits gebucht.',
            'Bereits gebucht'
          );

          this.bookedSessionIds.update(ids =>
            ids.includes(Number(session.id)) ? ids : [...ids, Number(session.id)]
          );

          return;
        }

        if (error.status === 403) {
          this.toastr.warning(
            error.error?.message ?? 'Du kannst deine eigenen Kurse nicht buchen.',
            'Buchung nicht erlaubt'
          );
          return;
        }

        if (error.status === 401) {
          this.toastr.info(
            'Bitte melde dich erneut an.',
            'Login erforderlich'
          );

          this.openLoginModal();
          return;
        }

        this.toastr.error(
          error.error?.message ?? 'Der Termin konnte nicht gebucht werden.',
          'Buchung fehlgeschlagen'
        );
      }
    });
  }

  // Öffnet das Login-Modal.
  openLoginModal(): void {
    this.showLoginModal.set(true);
  }

  // Schließt das Login-Modal.
  closeLoginModal(): void {
    this.showLoginModal.set(false);
  }

  formatDateTime(start_date: string) {
    const date = start_date.slice(0, 10).split('-').reverse().join('.');
    const time = start_date.replace('T', ' ').slice(11, 16);

    return `${date} - ${time}`;  }

  // Gibt alle Termine nach Datum/Uhrzeit aufsteigend sortiert zurück.
  get sortedSessions(): CourseSession[] {
    return [...this.sessions].sort((a, b) =>
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
  }
}
