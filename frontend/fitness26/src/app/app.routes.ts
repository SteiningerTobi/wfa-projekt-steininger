import { Routes } from '@angular/router';
import {Home} from './home/home';
import {Courses} from './courses/courses';
import {Bookings} from './bookings/bookings';
import {Account} from './account/account';
import {CourseDetail} from './courses/course-detail/course-detail';
import {NotFound} from './not-found/not-found';
import {LoginArea} from './account/login-area/login-area';
import {Me} from './account/me/me';
import {MyCourses} from './my-courses/my-courses';
import { authGuard } from './shared/guards/auth.guard';
import { isTrainerGuard } from './shared/guards/is-trainer.guard';
import { ownGuard } from './shared/guards/own.guard';
import {MyCourseForm} from './my-courses/my-course-form/my-course-form';
import {MyCourseList} from './my-courses/my-course-list/my-course-list';
import {Participants} from './participants/participants';

export const routes: Routes = [
  {path:'', pathMatch:'full', redirectTo:'home'},
  {path:'home', component:Home},
  {path:'courses', component:Courses},
  {path:'courses/:id', component:CourseDetail},
  {
    path: 'my-courses',
    component: MyCourses,
    canActivate: [authGuard,isTrainerGuard],
    children:[
      { path: '', pathMatch: 'full', redirectTo: 'all' },
      { path: 'all', component: MyCourseList },
      { path: 'new', component: MyCourseForm },
      { path: ':id', component: MyCourseForm, canActivate: [ownGuard]}
    ]
  },
  {
    path: 'bookings',
    component: Bookings,
    canActivate: [authGuard]
  },
  {path: 'login', component:LoginArea},
  {
    path: 'account',
    component: Account,
    children: [
      { path: 'me', component: Me },
    ]
  },


  { path: '404', component: NotFound },
  { path: '**', redirectTo: '404' }
];
