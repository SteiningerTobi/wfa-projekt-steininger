import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Booking, BookingService } from '../../shared/booking-service';
import { ConfirmModal } from '../../confirm-modal/confirm-modal';

// Komponente für die Anzeige und Stornierung eigener Buchungen.
@Component({
  selector: 'bs-booking-list',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ConfirmModal
  ],
  templateUrl: './booking-list.html',
  styleUrl: './booking-list.css'
})
export class BookingList implements OnInit {
  bookings = signal<Booking[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  confirmModalOpen = signal(false);
  confirmModalTitle = signal('Bist du sicher?');
  confirmModalMessage = signal('');
  confirmModalConfirmText = signal('Bestätigen');

  private pendingCancelBookingId: number | null = null;
  private pendingCancelSession: {
    bookingId: number;
    sessionId: number;
  } | null = null;

  constructor(
    private bookingService: BookingService,
    private toastr: ToastrService
  ) {}

  // Lädt die Buchungen beim Initialisieren der Komponente.
  ngOnInit(): void {
    this.loadBookings();
  }

  // Lädt alle Buchungen des aktuell eingeloggten Users.
  loadBookings(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.bookingService.getMyBookings()
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (bookings) => {
          this.bookings.set(bookings);
        },
        error: (error) => {
          console.error(error);

          this.errorMessage.set('Buchungen konnten nicht geladen werden.');

          this.toastr.error(
            'Buchungen konnten nicht geladen werden.',
            'Fehler'
          );
        }
      });
  }

  // Öffnet das Bestätigungsmodal für das Stornieren einer kompletten Buchung.
  openCancelBookingModal(bookingId: number): void {
    if (this.isLoading()) {
      return;
    }

    this.pendingCancelBookingId = bookingId;
    this.pendingCancelSession = null;

    this.confirmModalTitle.set('Buchung stornieren?');
    this.confirmModalMessage.set(
      'Möchtest du diese Buchung wirklich stornieren? Dadurch werden alle zugehörigen Termine dieser Buchung storniert.'
    );
    this.confirmModalConfirmText.set('Buchung stornieren');
    this.confirmModalOpen.set(true);
  }

  // Öffnet das Bestätigungsmodal für das Stornieren eines einzelnen Termins.
  openCancelSessionModal(bookingId: number, sessionId: number): void {
    if (this.isLoading()) {
      return;
    }

    this.pendingCancelSession = {
      bookingId,
      sessionId
    };

    this.pendingCancelBookingId = null;

    this.confirmModalTitle.set('Termin stornieren?');
    this.confirmModalMessage.set(
      'Möchtest du diesen einzelnen Termin wirklich stornieren? Die restliche Buchung bleibt bestehen.'
    );
    this.confirmModalConfirmText.set('Termin stornieren');
    this.confirmModalOpen.set(true);
  }

  // Schließt das Modal und setzt offene Stornierungen zurück.
  cancelConfirmModal(): void {
    this.confirmModalOpen.set(false);
    this.pendingCancelBookingId = null;
    this.pendingCancelSession = null;
  }

  // Führt je nach ausgewählter Aktion die passende Stornierung aus.
  confirmCancelAction(): void {
    if (this.pendingCancelBookingId) {
      this.confirmCancelBooking();
      return;
    }

    if (this.pendingCancelSession) {
      this.confirmCancelSession();
    }
  }

  // Storniert eine komplette Buchung über das Backend.
  private confirmCancelBooking(): void {
    const bookingId = this.pendingCancelBookingId;

    if (!bookingId) {
      return;
    }

    this.confirmModalOpen.set(false);
    this.pendingCancelBookingId = null;

    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        this.toastr.success(
          'Die Buchung wurde erfolgreich storniert.',
          'Storniert'
        );

        this.loadBookings();
      },
      error: (error) => {
        console.error(error);

        this.toastr.error(
          error.error?.message ?? 'Buchung konnte nicht storniert werden.',
          'Fehler'
        );
      }
    });
  }

  // Übersetzt den technischen Buchungsstatus für die Anzeige.
  getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'past':
        return 'Vergangen';
      case 'cancelled':
        return 'Storniert';
      default:
        return status;
    }
  }

  // Übersetzt den technischen Schwierigkeitsgrad für die Anzeige.
  getDifficultyText(difficulty: string | undefined | null): string {
    switch (difficulty) {
      case 'beginner':
        return 'Anfänger';
      case 'intermediate':
        return 'Fortgeschritten';
      case 'advanced':
        return 'Profi';
      default:
        return 'Keine Schwierigkeit angegeben';
    }
  }

  // Storniert einen einzelnen Termin innerhalb einer Buchung.
  private confirmCancelSession(): void {
    const pending = this.pendingCancelSession;

    if (!pending) {
      return;
    }

    this.confirmModalOpen.set(false);
    this.pendingCancelSession = null;

    this.bookingService.cancelSession(pending.bookingId, pending.sessionId).subscribe({
      next: () => {
        this.toastr.success(
          'Der Termin wurde erfolgreich storniert.',
          'Storniert'
        );

        // Lädt die Buchungen neu, damit auch der Status der Gesamtbuchung aktualisiert wird.
        this.loadBookings();
      },
      error: (error) => {
        console.error(error);

        this.toastr.error(
          error.error?.message ?? 'Termin konnte nicht storniert werden.',
          'Fehler'
        );
      }
    });
  }
  //Gibt richtigen Zeitwert an UI
  formatLocalDate(start_date: string) {
    const date = start_date.slice(0, 10).split('-').reverse().join('.');
    const time = start_date.replace('T', ' ').slice(11, 16);

    return `${date} - ${time}`;  }
}
