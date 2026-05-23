import { CourseSession } from './course-session';

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

  isActive(): boolean {
    return this.status === 'active';
  }

  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  isPast(): boolean {
    return this.status === 'past';
  }
}
