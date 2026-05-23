import {Component, inject} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';
import { Me } from './me/me';
import {ToastrService} from 'ngx-toastr';

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

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUser() {
    const user = sessionStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  getUserName(): string {
    const user = this.getUser();

    return user?.user_name || user?.name || 'Benutzer';
  }

  getUserEmail(): string {
    const user = this.getUser();

    return user?.email || '';
  }

  getUserRole(): string {
    const user = this.getUser();

    return user?.role || this.authService.getRole() || '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  toBeImplemented(): void {
    this.toastr.warning(
      'Aktuell ist dieses Feature noch nicht implementiert.',
      'Achtung'
    );
  }
}
