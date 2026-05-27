import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthenticationService } from '../authentication.service';

// Guard, der Routen nur für Trainer:innen freigibt.
export const isTrainerGuard: CanActivateFn = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (authService.isTrainer()) {
    return true;
  }

  // Eingeloggte User ohne Trainerrolle werden zur Startseite weitergeleitet.
  return router.createUrlTree(['/home']);
};
