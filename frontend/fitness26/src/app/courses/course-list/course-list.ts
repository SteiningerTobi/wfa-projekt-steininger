import { Component, computed, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { CourseSystem } from '../../shared/course-system';
import { Course } from '../../shared/classes/course';
import { CourseListCardSlot } from '../course-list-card-slot/course-list-card-slot';

// Komponente für die Kursübersicht mit Such- und Kategorie-Filter.
@Component({
  selector: 'bs-course-list',
  standalone: true,
  imports: [
    CourseListCardSlot,
    RouterLink
  ],
  templateUrl: './course-list.html',
  styleUrl: './course-list.css',
})
export class CourseList {
  private courseSystem = inject(CourseSystem);
  private route = inject(ActivatedRoute);

  courses = toSignal(this.courseSystem.getAll(), {
    initialValue: []
  });

  queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap
  });

  // Filtert Kurse anhand von Suchbegriff und ausgewählten Kategorien aus der URL.
  filteredCourses = computed(() => {
    const courses = this.courses();

    const search = (this.queryParams().get('search') ?? '')
      .trim()
      .toLowerCase();

    const selectedCategoryIds = (this.queryParams().get('categories') ?? '')
      .split(',')
      .filter(value => value.length > 0)
      .map(value => Number(value));

    return courses.filter(course => {
      const matchesSearch =
        !search ||
        course.title.toLowerCase().includes(search) ||
        course.description.toLowerCase().includes(search) ||
        course.address.toLowerCase().includes(search) ||
        this.getTrainerSearchText(course).includes(search) ||
        course.categories.some(category =>
          category.name.toLowerCase().includes(search)
        );

      const matchesCategories =
        selectedCategoryIds.length === 0 ||
        course.categories.some(category =>
          selectedCategoryIds.includes(category.id)
        );

      return matchesSearch && matchesCategories;
    });
  });

  // Erstellt einen durchsuchbaren Text aus den Trainerdaten eines Kurses.
  private getTrainerSearchText(course: Course): string {
    if (!course.trainer) {
      return '';
    }

    const parts = [
      course.trainer.user_name,
      course.trainer.email,
      course.trainer.trainer_data?.name,
      course.trainer.trainer_data?.bio,
      course.trainer.trainer_data?.contact_mail
    ];

    return parts
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
  }
}
