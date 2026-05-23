import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { Search } from './search/search';
import { AuthenticationService } from './shared/authentication.service';

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

  showSearch(): boolean {
    const url = this.router.url;

    return (
      url.startsWith('/home') ||
      url === '/courses' ||
      url.startsWith('/courses?')
    );
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isTrainer(): boolean {
    return this.authService.isTrainer();
  }
}
