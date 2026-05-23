import { Component } from '@angular/core';
import { LoginForm } from '../login-form/login-form';

@Component({
  selector: 'bs-login-area',
  standalone: true,
  imports: [
    LoginForm
  ],
  templateUrl: './login-area.html',
  styleUrl: './login-area.css'
})
export class LoginArea {}
