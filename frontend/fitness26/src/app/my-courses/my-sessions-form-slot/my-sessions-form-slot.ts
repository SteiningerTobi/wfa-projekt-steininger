import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface CourseSession {
  id: number;
  course_id: number;
  start_date: string;
  duration: number;
  status?: string;
  participants_count?: number;
}

export interface SessionFormData {
  start_date: string;
  duration: number;
}

@Component({
  selector: 'bs-my-sessions-form-slot',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule
  ],
  templateUrl: './my-sessions-form-slot.html',
  styleUrl: './my-sessions-form-slot.css'
})
export class MySessionsFormSlot {
  @Input() session: CourseSession | null = null;
  @Input() editMode = false;
  @Input() isSaving = false;

  @Input({ required: true }) form!: SessionFormData;

  @Output() edit = new EventEmitter<CourseSession>();
  @Output() delete = new EventEmitter<number>();
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() participants = new EventEmitter<CourseSession>();

  onSubmit(): void {
    this.save.emit();
  }

  onEdit(): void {
    if (this.session) {
      this.edit.emit(this.session);
    }
  }

  onDelete(): void {
    if (this.session) {
      this.delete.emit(this.session.id);
    }
  }

  openParticipants(): void {
    if (this.session) {
      this.participants.emit(this.session);
    }
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      planned: 'Geplant',
      cancelled: 'Storniert',
      completed: 'Abgeschlossen'
    };

    return labels[status] ?? status;
  }
}
