import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService, LoginResponse } from '../../shared/authentication.service';
import { ToastrService } from 'ngx-toastr';

// Komponente für das Login-Formular.
@Component({
  selector: 'bs-login-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css'
})
export class LoginForm {
  loginForm: FormGroup;
  loginError = false;
  private toastr = inject(ToastrService);

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    // Erstellt das Reactive Form mit Validierungsregeln.
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  // Führt den Login aus und speichert Token/Userdaten bei Erfolg.
  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response: LoginResponse) => {
        this.loginError = false;

        this.authService.setSessionStorage(response.access_token);

        if (response.user) {
          sessionStorage.setItem('user', JSON.stringify(response.user));
          sessionStorage.setItem('role', response.user.role);
        }

        this.router.navigateByUrl('/courses');
      },
      error: (error) => {
        console.error(error);
        this.loginError = true;
      }
    });
  }

  // Prüft, ob aktuell ein User eingeloggt ist.
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Loggt den aktuellen User aus.
  logout(): void {
    this.authService.logout();
  }

  // Zeigt einen Hinweis für noch nicht implementierte Features.
  toBeImplemented(): void {
    this.toastr.warning(
      'Aktuell ist dieses Feature noch nicht implementiert.',
      'Achtung'
    );
  }
}
