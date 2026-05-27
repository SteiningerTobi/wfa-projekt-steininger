import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { TokenInterceptorService } from './shared/token-interceptor.service';

// Zentrale Konfiguration der Angular-App.
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // Aktiviert den HttpClient und erlaubt klassische DI-basierte Interceptors.
    provideHttpClient(withInterceptorsFromDi()),

    // Registriert den Token-Interceptor für alle HTTP-Requests.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },

    provideAnimations(),

    // Konfiguration für Toast-Benachrichtigungen.
    provideToastr({
      positionClass: 'toast-top-center',
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true
    })
  ]
};
