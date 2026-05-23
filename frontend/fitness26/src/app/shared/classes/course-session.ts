export class CourseSession {
  constructor(
    public id: number,
    public course_id: number,
    public start_date: string,
    public duration: number,
    public status: string,
    public booked_count: number = 0,
    public created_at?: string | null,
    public updated_at?: string | null
  ) {}

  isPlanned(): boolean {
    return this.status === 'planned';
  }

  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  isCompleted(): boolean {
    return this.status === 'completed';
  }
}
