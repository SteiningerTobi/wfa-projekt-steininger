import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

// Guard, der Routen nur für eingeloggte User freigibt.
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Nicht eingeloggte User werden zur Login-Seite weitergeleitet.
  return router.createUrlTree(['/login']);
};
