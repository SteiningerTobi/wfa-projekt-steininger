import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

interface Token {
  exp: number;
  user?: {
    id: number;
    role?: string;
  };
  sub?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private api = 'http://fitness26.s2310456022.student.kwmhgb.at/api/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.api}/login`, {
      email,
      password
    });
  }

  setSessionStorage(token: string): void {
    const decodedToken = jwtDecode(token) as Token;

    sessionStorage.setItem('token', token);

    if (decodedToken.user?.id) {
      sessionStorage.setItem('userId', decodedToken.user.id.toString());
    }

    if (decodedToken.user?.role) {
      sessionStorage.setItem('role', decodedToken.user.role);
    }
  }

  logout() {
    const request = this.http.post(`${this.api}/logout`, {});

    this.clearSession();

    return request;
  }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('token');

    if (!token) {
      return false;
    }

    const decodedToken = jwtDecode(token) as Token;

    const expirationDate = new Date(0);
    expirationDate.setUTCSeconds(decodedToken.exp);

    if (expirationDate < new Date()) {
      this.clearSession();
      return false;
    }

    return true;
  }

  getRole(): string | null {
    return sessionStorage.getItem('role');
  }

  isTrainer(): boolean {
    return this.getRole() === 'trainer';
  }

  private clearSession(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user');
  }

  getCurrentUser(): { id: number; role: string | null } | null {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      return null;
    }

    return {
      id: Number(userId),
      role: sessionStorage.getItem('role')
    };
  }

}
