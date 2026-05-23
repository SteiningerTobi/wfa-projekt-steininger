import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import {Participants} from '../participants/participants';

@Component({
  selector: 'bs-my-courses',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    Participants
  ],
  templateUrl: './my-courses.html',
  styleUrl: './my-courses.css'
})
export class MyCourses {
  private router = inject(Router);

  isListRoute(): boolean {
    return this.router.url === '/my-courses' || this.router.url === '/my-courses/all';
  }
}
