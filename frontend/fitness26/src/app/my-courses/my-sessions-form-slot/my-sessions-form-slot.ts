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

// Komponente für einen einzelnen Termin-Slot im Kursformular.
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

  // Sendet das Speichern-Event an die Parent-Komponente.
  onSubmit(): void {
    this.save.emit();
  }

  // Startet den Bearbeitungsmodus für den aktuellen Termin.
  onEdit(): void {
    if (this.session) {
      this.edit.emit(this.session);
    }
  }

  // Sendet die ID des zu löschenden Termins an die Parent-Komponente.
  onDelete(): void {
    if (this.session) {
      this.delete.emit(this.session.id);
    }
  }

  // Öffnet die Teilnehmerliste für den aktuellen Termin.
  openParticipants(): void {
    if (this.session) {
      this.participants.emit(this.session);
    }
  }

  // Übersetzt technische Statuswerte in lesbare Labels.
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      planned: 'Geplant',
      cancelled: 'Storniert',
      completed: 'Abgeschlossen'
    };

    return labels[status] ?? status;
  }

  //Gibt richtigen Zeitwert an UI
  formatLocalDate(start_date: string) {
    const date = start_date.slice(0, 10).split('-').reverse().join('.');
    const time = start_date.replace('T', ' ').slice(11, 16);

    return `${date} - ${time}`;  }
}
