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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['courseId'] && this.courseId) {
      this.loadSessions();
    }
  }

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

  editSession(session: CourseSession): void {
    this.editingSessionId.set(session.id);

    this.editForm = {
      start_date: this.toDatetimeLocalValue(session.start_date),
      duration: session.duration
    };
  }

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

  cancelConfirmModal(): void {
    this.confirmModalOpen.set(false);
    this.pendingDeleteSessionId = null;
  }

  openParticipantsModal(session: CourseSession): void {
    this.selectedParticipantsSessionId.set(session.id);
    this.participantsModalOpen.set(true);
  }

  closeParticipantsModal(): void {
    this.participantsModalOpen.set(false);
    this.selectedParticipantsSessionId.set(null);
  }

  cancelEdit(): void {
    this.resetEditForm();
  }

  resetEditForm(): void {
    this.editingSessionId.set(null);

    this.editForm = {
      start_date: '',
      duration: 60
    };
  }

  resetCreateForm(): void {
    this.createForm = {
      start_date: '',
      duration: 60
    };
  }

  isFormValid(form: SessionFormData): boolean {
    return Boolean(
      form.start_date &&
      Number(form.duration) > 0
    );
  }

  private toBackendDate(value: string): string {
    return value.replace('T', ' ') + ':00';
  }

  private toDatetimeLocalValue(value: string): string {
    const date = new Date(value);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  }
}
