import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { CourseSystem } from '../shared/course-system';

interface SessionParticipant {
  booking_id: number;
  booking_status: string;
  participant_status: string | null;
  booked_at: string;
  user: {
    id: number;
    user_name: string;
    email: string;
  };
}

@Component({
  selector: 'bs-participants',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './participants.html',
  styleUrl: './participants.css'
})
export class Participants implements OnChanges {
  @Input() isOpen = false;
  @Input() courseId: number | null = null;
  @Input() sessionId: number | null = null;

  @Output() closed = new EventEmitter<void>();

  private courseStore = inject(CourseSystem);
  private toastr = inject(ToastrService);

  courseTitle = signal('');
  sessionStartDate = signal('');
  sessionDuration = signal<number | null>(null);
  participants = signal<SessionParticipant[]>([]);
  isLoading = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.isOpen &&
      this.courseId &&
      this.sessionId &&
      (changes['isOpen'] || changes['courseId'] || changes['sessionId'])
    ) {
      this.loadParticipants();
    }
  }

  close(): void {
    this.closed.emit();
  }

  loadParticipants(): void {
    if (!this.courseId || !this.sessionId) {
      return;
    }

    this.isLoading.set(true);

    this.courseStore.getSessionParticipants(this.courseId, this.sessionId).subscribe({
      next: (response) => {
        this.courseTitle.set(response.course.title);
        this.sessionStartDate.set(response.session.start_date);
        this.sessionDuration.set(response.session.duration);
        this.participants.set(response.participants);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);

        this.toastr.error(
          error.error?.message ?? 'Teilnehmer:innen konnten nicht geladen werden.',
          'Fehler'
        );
      }
    });
  }

  getStatusLabel(status: string | null): string {
    const labels: Record<string, string> = {
      booked: 'Gebucht',
      active: 'Aktiv',
      cancelled: 'Storniert',
      completed: 'Abgeschlossen',
      pending: 'Ausstehend'
    };

    return status ? labels[status] ?? status : 'Unbekannt';
  }
}
