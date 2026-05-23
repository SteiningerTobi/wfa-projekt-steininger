import { SessionBooking } from './session-booking';

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

  isActive(): boolean {
    return this.status === 'active';
  }

  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  hasSessions(): boolean {
    return this.session_bookings.length > 0;
  }
}
