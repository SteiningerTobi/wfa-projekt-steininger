import { Component, inject, Input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import { CourseSession } from '../../shared/classes/course-session';
import { LoginArea } from '../../account/login-area/login-area';
import { AuthenticationService } from '../../shared/authentication.service';
import { BookingService } from '../../shared/booking-service';

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

  ngOnInit(): void {
    this.loadBookedSessions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshToken'] && !changes['refreshToken'].firstChange) {
      this.loadBookedSessions();
    }
  }

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

  isAlreadyBooked(session: CourseSession): boolean {
    return this.bookedSessionIds().includes(Number(session.id));
  }

  isFullyBooked(session: CourseSession): boolean {
    return this.maxCapacity > 0 && session.booked_count >= this.maxCapacity;
  }

  getFreeSpots(session: CourseSession): number {
    return Math.max(this.maxCapacity - session.booked_count, 0);
  }

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

  openLoginModal(): void {
    this.showLoginModal.set(true);
  }

  closeLoginModal(): void {
    this.showLoginModal.set(false);
  }
}
