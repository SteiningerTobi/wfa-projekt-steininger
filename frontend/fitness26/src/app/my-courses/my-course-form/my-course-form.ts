import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MySessionsForm } from '../my-sessions-form/my-sessions-form';

import { CourseSystem } from '../../shared/course-system';
import { AuthenticationService } from '../../shared/authentication.service';
import { Course } from '../../shared/classes/course';
import { ConfirmModal } from '../../confirm-modal/confirm-modal';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface CategoryOption {
  id: number;
  name: string;
}

interface CourseFormData {
  title: string;
  description: string;
  difficulty: Difficulty;
  max_capacity: number;
  image_path: string;
  address: string;
  category_ids: number[];
}

// Komponente zum Erstellen und Bearbeiten eigener Kurse.
@Component({
  selector: 'bs-my-course-form',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MySessionsForm,
    ConfirmModal
  ],
  templateUrl: './my-course-form.html',
  styleUrl: './my-course-form.css'
})
export class MyCourseForm implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseStore = inject(CourseSystem);
  private authService = inject(AuthenticationService);
  private toastr = inject(ToastrService);

  confirmModalOpen = signal(false);
  confirmModalTitle = signal('Bist du sicher?');
  confirmModalMessage = signal('');
  confirmModalConfirmText = signal('Löschen');

  private pendingDeleteCourseId: number | null = null;

  courseId = signal<number | null>(null);
  isEditMode = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  categories = signal<CategoryOption[]>([]);

  form: CourseFormData = {
    title: '',
    description: '',
    difficulty: 'beginner',
    max_capacity: 10,
    image_path: '',
    address: '',
    category_ids: []
  };

  // Lädt Kategorien und entscheidet anhand der URL, ob erstellt oder bearbeitet wird.
  ngOnInit(): void {
    this.loadCategories();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.isEditMode.set(false);
      return;
    }

    const id = Number(idParam);

    if (!id) {
      this.router.navigate(['/my-courses/all']);
      return;
    }

    this.courseId.set(id);
    this.isEditMode.set(true);
    this.loadCourse(id);
  }

  // Lädt alle verfügbaren Kategorien für die Auswahl.
  loadCategories(): void {
    this.courseStore.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: () => {
        this.toastr.error(
          'Kategorien konnten nicht geladen werden.',
          'Fehler'
        );
      }
    });
  }

  // Lädt einen bestehenden Kurs und befüllt damit das Formular.
  loadCourse(id: number): void {
    this.isLoading.set(true);

    this.courseStore.getSingle(id).subscribe({
      next: (course: Course) => {
        this.form = {
          title: course.title,
          description: course.description,
          difficulty: course.difficulty as Difficulty,
          max_capacity: course.max_capacity,
          image_path: course.image_path ?? '',
          address: course.address,
          category_ids: course.categories?.map(category => Number(category.id)) ?? []
        };

        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error(
          'Der Kurs konnte nicht geladen werden.',
          'Fehler'
        );

        this.isLoading.set(false);
        this.router.navigate(['/my-courses/all']);
      }
    });
  }

  // Wählt eine Kategorie aus oder entfernt sie wieder.
  toggleCategory(categoryId: number): void {
    if (this.form.category_ids.includes(categoryId)) {
      this.form.category_ids = this.form.category_ids.filter(id => id !== categoryId);
      return;
    }

    this.form.category_ids = [...this.form.category_ids, categoryId];
  }

  // Prüft, ob eine Kategorie aktuell ausgewählt ist.
  isCategorySelected(categoryId: number): boolean {
    return this.form.category_ids.includes(categoryId);
  }

  // Speichert den Kurs je nach Modus als neuen oder aktualisierten Kurs.
  saveCourse(): void {
    if (this.isSaving()) {
      return;
    }

    if (!this.isFormValid()) {
      this.toastr.warning(
        'Bitte fülle alle Pflichtfelder korrekt aus.',
        'Formular unvollständig'
      );
      return;
    }

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.toastr.info(
        'Bitte melde dich erneut an.',
        'Login erforderlich'
      );

      this.router.navigate(['/login']);
      return;
    }

    const payload = {
      title: this.form.title.trim(),
      description: this.form.description.trim(),
      difficulty: this.form.difficulty,
      max_capacity: Number(this.form.max_capacity),
      image_path: this.form.image_path.trim() || null,
      address: this.form.address.trim(),
      category_ids: this.form.category_ids
    };

    this.isSaving.set(true);

    if (this.isEditMode() && this.courseId()) {
      this.courseStore.update(this.courseId()!, payload).subscribe({
        next: () => {
          this.toastr.success(
            'Der Kurs wurde erfolgreich aktualisiert.',
            'Gespeichert'
          );

          this.isSaving.set(false);
          this.router.navigate(['/my-courses/all']);
        },
        error: (error) => {
          this.isSaving.set(false);

          this.toastr.error(
            error.error?.message ?? 'Der Kurs konnte nicht gespeichert werden.',
            'Fehler'
          );
        }
      });

      return;
    }

    this.courseStore.create(payload).subscribe({
      next: () => {
        this.toastr.success(
          'Der Kurs wurde erfolgreich erstellt.',
          'Kurs erstellt'
        );

        this.isSaving.set(false);
        this.router.navigate(['/my-courses/all']);
      },
      error: (error) => {
        this.isSaving.set(false);

        this.toastr.error(
          error.error?.message ?? 'Der Kurs konnte nicht erstellt werden.',
          'Fehler'
        );
      }
    });
  }

  // Prüft, ob alle Pflichtfelder korrekt befüllt sind.
  isFormValid(): boolean {
    return Boolean(
      this.form.title.trim()
      && this.form.description.trim()
      && this.form.address.trim()
      && this.form.difficulty
      && Number(this.form.max_capacity) > 0
      && this.form.category_ids.length > 0
    );
  }

  // Setzt die ausgewählten Kategorien im Formular.
  setSelectedCategories(categoryIds: number[]): void {
    this.form.category_ids = categoryIds.map(id => Number(id));
  }

  // Öffnet das Bestätigungsmodal vor dem Löschen eines Kurses.
  deleteCourse(): void {
    const id = this.courseId();

    if (!this.isEditMode() || !id || this.isSaving()) {
      return;
    }

    this.pendingDeleteCourseId = id;

    this.confirmModalTitle.set('Kurs löschen?');
    this.confirmModalMessage.set(
      'Möchtest du diesen Kurs wirklich löschen? Zugehörige Termine und Buchungen können dadurch betroffen sein.'
    );
    this.confirmModalConfirmText.set('Kurs löschen');
    this.confirmModalOpen.set(true);
  }

  // Schließt das Lösch-Modal ohne Aktion.
  cancelConfirmModal(): void {
    this.confirmModalOpen.set(false);
    this.pendingDeleteCourseId = null;
  }

  // Löscht den ausgewählten Kurs nach Bestätigung.
  confirmDeleteCourse(): void {
    const id = this.pendingDeleteCourseId;

    if (!id || this.isSaving()) {
      return;
    }

    this.confirmModalOpen.set(false);
    this.pendingDeleteCourseId = null;
    this.isSaving.set(true);

    this.courseStore.destroy(id).subscribe({
      next: () => {
        this.toastr.success(
          'Der Kurs wurde erfolgreich gelöscht.',
          'Kurs gelöscht'
        );

        this.isSaving.set(false);
        this.router.navigate(['/my-courses/all']);
      },
      error: (error) => {
        this.isSaving.set(false);

        this.toastr.error(
          error.error?.message ?? 'Der Kurs konnte nicht gelöscht werden.',
          'Fehler'
        );
      }
    });
  }
}
