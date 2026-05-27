import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { Search } from './search/search';
import { AuthenticationService } from './shared/authentication.service';

// Root-Komponente der Angular-App.
@Component({
  selector: 'bs-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Search
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('fitness26');
  protected readonly routes = routes;

  constructor(
    public router: Router,
    public authService: AuthenticationService
  ) {}

  // Steuert, auf welchen Seiten die Suchkomponente angezeigt wird.
  showSearch(): boolean {
    const url = this.router.url;

    return (
      url.startsWith('/home') ||
      url === '/courses' ||
      url.startsWith('/courses?')
    );
  }

  // Prüft, ob aktuell ein User eingeloggt ist.
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Prüft, ob der eingeloggte User Trainer:in ist.
  isTrainer(): boolean {
    return this.authService.isTrainer();
  }
}
