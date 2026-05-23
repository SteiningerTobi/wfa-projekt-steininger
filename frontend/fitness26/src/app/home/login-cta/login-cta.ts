import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bs-login-cta',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './login-cta.html',
  styleUrl: './login-cta.css'
})
export class LoginCta {}
