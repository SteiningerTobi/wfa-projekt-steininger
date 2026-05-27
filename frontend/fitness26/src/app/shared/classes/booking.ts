import { SessionBooking } from './session-booking';

// Model-Klasse für eine Buchung.
export class Booking {
  constructor(
    public id: number,
    public user_id: number,
    public booked_at: string,
    public status: string,
    public session_bookings: SessionBooking[] = [],
    public created_at?: string | null,
    public updated_at?: string | null
  ) {}

  // Prüft, ob die Buchung aktiv ist.
  isActive(): boolean {
    return this.status === 'active';
  }

  // Prüft, ob die Buchung storniert wurde.
  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  // Prüft, ob die Buchung Terminbuchungen enthält.
  hasSessions(): boolean {
    return this.session_bookings.length > 0;
  }
}
