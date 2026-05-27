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

  // Prüft, ob der Termin noch geplant ist.
  isPlanned(): boolean {
    return this.status === 'planned';
  }

  // Prüft, ob der Termin storniert wurde.
  isCancelled(): boolean {
    return this.status === 'cancelled';
  }

  // Prüft, ob der Termin abgeschlossen ist.
  isCompleted(): boolean {
    return this.status === 'completed';
  }
}
