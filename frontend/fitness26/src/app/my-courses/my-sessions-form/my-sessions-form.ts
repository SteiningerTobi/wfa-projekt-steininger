import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { CourseSystem } from '../../shared/course-system';
import {
  CourseSession,
  MySessionsFormSlot,
  SessionFormData
} from '../my-sessions-form-slot/my-sessions-form-slot';
import { ConfirmModal } from '../../confirm-modal/confirm-modal';
import { Participants } from '../../participants/participants';

// Komponente zum Verwalten der Termine eines Kurses.
@Component({
  selector: 'bs-my-sessions-form',
  standalone: true,
  imports: [
    MySessionsFormSlot,
    ConfirmModal,
    Participants
  ],
  templateUrl: './my-sessions-form.html',
  styleUrl: './my-sessions-form.css'
})
export class MySessionsForm implements OnChanges {
  @Input({ required: true }) courseId!: number;

  private courseStore = inject(CourseSystem);
  private toastr = inject(ToastrService);

  sessions = signal<CourseSession[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  editingSessionId = signal<number | null>(null);

  confirmModalOpen = signal(false);
  confirmModalTitle = signal('Bist du sicher?');
  confirmModalMessage = signal('');
  confirmModalConfirmText = signal('Löschen');

  participantsModalOpen = signal(false);
  selectedParticipantsSessionId = signal<number | null>(null);

  private pendingDeleteSessionId: number | null = null;

  editForm: SessionFormData = {
    start_date: '',
    duration: 60
  };

  createForm: SessionFormData = {
    start_date: '',
    duration: 60
  };

  // Lädt Termine neu, sobald sich die Kurs-ID ändert.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseId'] && this.courseId) {
      this.loadSessions();
    }
  }

  // Lädt alle Termine des aktuellen Kurses.
  loadSessions(): void {
    this.isLoading.set(true);

    this.courseStore.getCourseSessions(this.courseId).subscribe({
      next: (sessions) => {
        this.sessions.set(sessions);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);

        this.toastr.error(
          'Die Kurstermine konnten nicht geladen werden.',
          'Fehler'
        );
      }
    });
  }

  // Erstellt einen neuen Kurstermin.
  createSession(): void {
    if (this.isSaving()) {
      return;
    }

    if (!this.isFormValid(this.createForm)) {
      this.toastr.warning(
        'Bitte gib ein Datum und eine gültige Dauer ein.',
        'Formular unvollständig'
      );
      return;
    }

    const payload = {
      start_date: this.toBackendDate(this.createForm.start_date),
      duration: Number(this.createForm.duration)
    };

    this.isSaving.set(true);

    this.courseStore.createCourseSession(this.courseId, payload).subscribe({
      next: () => {
        this.toastr.success(
          'Der Termin wurde erstellt.',
          'Termin erstellt'
        );

        this.isSaving.set(false);
        this.resetCreateForm();
        this.loadSessions();
      },
      error: (error) => {
        this.isSaving.set(false);

        this.toastr.error(
          error.error?.message ?? 'Der Termin konnte nicht erstellt werden.',
          'Fehler'
        );
      }
    });
  }

  // Aktualisiert den aktuell bearbeiteten Kurstermin.
  updateSession(): void {
    const editingId = this.editingSessionId();

    if (!editingId || this.isSaving()) {
      return;
    }

    if (!this.isFormValid(this.editForm)) {
      this.toastr.warning(
        'Bitte gib ein Datum und eine gültige Dauer ein.',
        'Formular unvollständig'
      );
      return;
    }

    const payload = {
      start_date: this.toBackendDate(this.editForm.start_date),
      duration: Number(this.editForm.duration)
    };

    this.isSaving.set(true);

    this.courseStore.updateCourseSession(editingId, payload).subscribe({
      next: () => {
        this.toastr.success(
          'Der Termin wurde aktualisiert.',
          'Gespeichert'
        );

        this.isSaving.set(false);
        this.resetEditForm();
        this.loadSessions();
      },
      error: (error) => {
        this.isSaving.set(false);

        this.toastr.error(
          error.error?.message ?? 'Der Termin konnte nicht gespeichert werden.',
          'Fehler'
        );
      }
    });
  }

  // Füllt das Bearbeitungsformular mit den Daten des ausgewählten Termins.
  editSession(session: CourseSession): void {
    this.editingSessionId.set(session.id);

    this.editForm = {
      start_date: this.toDatetimeLocalValue(session.start_date),
      duration: session.duration
    };
  }

  // Öffnet das Bestätigungsmodal vor dem Löschen eines Termins.
  deleteSession(sessionId: number): void {
    if (this.isSaving()) {
      return;
    }

    this.pendingDeleteSessionId = sessionId;

    this.confirmModalTitle.set('Termin löschen?');
    this.confirmModalMessage.set(
      'Möchtest du diesen Termin wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
    );
    this.confirmModalConfirmText.set('Termin löschen');
    this.confirmModalOpen.set(true);
  }

  // Löscht den ausgewählten Termin nach Bestätigung.
  confirmDeleteSession(): void {
    const sessionId = this.pendingDeleteSessionId;

    if (!sessionId || this.isSaving()) {
      return;
    }

    this.confirmModalOpen.set(false);
    this.pendingDeleteSessionId = null;
    this.isSaving.set(true);

    this.courseStore.deleteCourseSession(sessionId).subscribe({
      next: () => {
        this.toastr.success(
          'Der Termin wurde gelöscht.',
          'Termin gelöscht'
        );

        this.isSaving.set(false);

        if (this.editingSessionId() === sessionId) {
          this.resetEditForm();
        }

        this.loadSessions();
      },
      error: (error) => {
        this.isSaving.set(false);

        this.toastr.error(
          error.error?.message ?? 'Der Termin konnte nicht gelöscht werden.',
          'Fehler'
        );
      }
    });
  }

  // Schließt das Lösch-Modal ohne Aktion.
  cancelConfirmModal(): void {
    this.confirmModalOpen.set(false);
    this.pendingDeleteSessionId = null;
  }

  // Öffnet das Teilnehmer:innen-Modal für einen Termin.
  openParticipantsModal(session: CourseSession): void {
    this.selectedParticipantsSessionId.set(session.id);
    this.participantsModalOpen.set(true);
  }

  // Schließt das Teilnehmer:innen-Modal.
  closeParticipantsModal(): void {
    this.participantsModalOpen.set(false);
    this.selectedParticipantsSessionId.set(null);
  }

  // Bricht das Bearbeiten eines Termins ab.
  cancelEdit(): void {
    this.resetEditForm();
  }

  // Setzt das Bearbeitungsformular zurück.
  resetEditForm(): void {
    this.editingSessionId.set(null);

    this.editForm = {
      start_date: '',
      duration: 60
    };
  }

  // Setzt das Formular zum Erstellen eines Termins zurück.
  resetCreateForm(): void {
    this.createForm = {
      start_date: '',
      duration: 60
    };
  }

  // Prüft, ob Datum und Dauer im Formular gültig sind.
  isFormValid(form: SessionFormData): boolean {
    return Boolean(
      form.start_date &&
      Number(form.duration) > 0
    );
  }

  // Wandelt den datetime-local-Wert in das Backend-Datumsformat um.
  private toBackendDate(value: string): string {
    return value.replace('T', ' ') + ':00';
  }

  // Wandelt ein Backend-Datum in das Format für datetime-local um.
  private toDatetimeLocalValue(value: string): string {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  }
}
