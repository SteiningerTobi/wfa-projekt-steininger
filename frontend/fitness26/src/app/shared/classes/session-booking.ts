import { CourseSession } from './course-session';

// Model-Klasse für die Verbindung zwischen Buchung und Kurstermin.
export class SessionBooking {
  constructor(
    public booking_id: number,
    public session_id: number,
    public status: string,
    public cancelled_at?: string | null,
    public session?: CourseSession | null,
    public created_at?: string | null,
    public updated_at?: string | null
  ) {}

  // Prüft, ob die Terminbuchung aktiv ist.
  isActive(): boolean {
    return this.status === 'active';
  }

  // Prüft, ob die Terminbuchung storniert wurde.
  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  // Prüft, ob die Terminbuchung vergangen ist.
  isPast(): boolean {
    return this.status === 'past';
  }
}
