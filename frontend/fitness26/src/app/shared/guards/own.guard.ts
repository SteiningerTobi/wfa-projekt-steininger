import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

import { AuthenticationService } from '../authentication.service';
import { CourseSystem } from '../course-system';

export const ownGuard: CanActivateFn = (route) => {
  const authService = inject(AuthenticationService);
  const courseSystem = inject(CourseSystem);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return router.createUrlTree(['/login']);
  }

  const courseId = Number(
    route.paramMap.get('courseId') ?? route.paramMap.get('id')
  );

  if (!courseId) {
    return router.createUrlTree(['/my-courses']);
  }

  return courseSystem.getSingle(courseId).pipe(
    map((course) => {
      if (Number(course.trainer_id) === Number(currentUser.id)) {
        return true;
      }

      return router.createUrlTree(['/my-courses']);
    }),
    catchError(() => of(router.createUrlTree(['/my-courses'])))
  );
};
