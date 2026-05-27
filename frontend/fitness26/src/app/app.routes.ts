import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Courses } from './courses/courses';
import { Bookings } from './bookings/bookings';
import { Account } from './account/account';
import { CourseDetail } from './courses/course-detail/course-detail';
import { NotFound } from './not-found/not-found';
import { LoginArea } from './account/login-area/login-area';
import { Me } from './account/me/me';
import { MyCourses } from './my-courses/my-courses';
import { authGuard } from './shared/guards/auth.guard';
import { isTrainerGuard } from './shared/guards/is-trainer.guard';
import { ownGuard } from './shared/guards/own.guard';
import { MyCourseForm } from './my-courses/my-course-form/my-course-form';
import { MyCourseList } from './my-courses/my-course-list/my-course-list';
import { Participants } from './participants/participants';

// Zentrale Routing-Konfiguration der Angular-App.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: Home },
  { path: 'courses', component: Courses },
  { path: 'courses/:id', component: CourseDetail },

  {
    path: 'my-courses',
    component: MyCourses,

    // Nur eingeloggte Trainer:innen dürfen eigene Kurse verwalten.
    canActivate: [authGuard, isTrainerGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'all' },
      { path: 'all', component: MyCourseList },
      { path: 'new', component: MyCourseForm },

      // Bearbeiten ist nur erlaubt, wenn der Kurs dem aktuellen Trainer gehört.
      { path: ':id', component: MyCourseForm, canActivate: [ownGuard] }
    ]
  },

  {
    path: 'bookings',
    component: Bookings,

    // Buchungen sind nur für eingeloggte User sichtbar.
    canActivate: [authGuard]
  },

  { path: 'login', component: LoginArea },

  {
    path: 'account',
    component: Account,
    children: [
      { path: 'me', component: Me },
    ]
  },

  { path: '404', component: NotFound },

  // Fängt alle unbekannten URLs ab und leitet zur 404-Seite.
  { path: '**', redirectTo: '404' }
];
