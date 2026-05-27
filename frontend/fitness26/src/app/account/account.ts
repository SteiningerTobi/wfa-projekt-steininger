import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { Me } from './me/me';
import { ToastrService } from 'ngx-toastr';

// Komponente für den Account-Bereich.
@Component({
  selector: 'bs-account',
  standalone: true,
  imports: [
    RouterLink,
    Me
  ],
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account {
  private toastr = inject(ToastrService);

  constructor(
    public authService: AuthenticationService,
    private router: Router
  ) {}

  // Prüft, ob aktuell ein User eingeloggt ist.
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Holt den gespeicherten User aus der Session.
  getUser() {
    const user = sessionStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  // Gibt den Namen des aktuellen Users zurück.
  getUserName(): string {
    const user = this.getUser();

    return user?.user_name || user?.name || 'Benutzer';
  }

  // Gibt die E-Mail-Adresse des aktuellen Users zurück.
  getUserEmail(): string {
    const user = this.getUser();

    return user?.email || '';
  }

  // Gibt die Rolle des aktuellen Users zurück.
  getUserRole(): string {
    const user = this.getUser();

    return user?.role || this.authService.getRole() || '';
  }

  // Loggt den User aus und leitet zur Login-Seite weiter.
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  // Zeigt einen Hinweis für noch nicht implementierte Features.
  toBeImplemented(): void {
    this.toastr.warning(
      'Aktuell ist dieses Feature noch nicht implementiert.',
      'Achtung'
    );
  }
}
