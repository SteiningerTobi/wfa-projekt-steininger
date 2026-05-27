import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { CourseSystem } from '../../shared/course-system';
import { AuthenticationService } from '../../shared/authentication.service';
import { Course } from '../../shared/classes/course';

// Komponente für die Liste der eigenen Trainer-Kurse.
@Component({
  selector: 'bs-my-course-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './my-course-list.html',
  styleUrl: './my-course-list.css'
})
export class MyCourseList implements OnInit {
  private courseStore = inject(CourseSystem);
  private authService = inject(AuthenticationService);
  private toastr = inject(ToastrService);

  courses = signal<Course[]>([]);
  isLoading = signal(true);

  // Lädt beim Start der Komponente die eigenen Kurse.
  ngOnInit(): void {
    this.loadMyCourses();
  }

  // Lädt alle Kurse und filtert sie auf den aktuell eingeloggten Trainer.
  loadMyCourses(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.courses.set([]);
      this.isLoading.set(false);
      return;
    }

    this.courseStore.getAll().subscribe({
      next: (courses) => {
        const ownCourses = courses.filter(course =>
          Number(course.trainer_id) === Number(currentUser.id)
        );

        this.courses.set(ownCourses);
        this.isLoading.set(false);
      },
      error: () => {
        this.toastr.error(
          'Deine Kurse konnten nicht geladen werden.',
          'Fehler'
        );

        this.courses.set([]);
        this.isLoading.set(false);
      }
    });
  }
}
