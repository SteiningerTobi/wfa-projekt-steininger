import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Participants } from '../participants/participants';

// Wrapper-Komponente für den Bereich "Meine Kurse".
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

  // Prüft, ob aktuell die Kurslisten-Ansicht aktiv ist.
  isListRoute(): boolean {
    return this.router.url === '/my-courses' || this.router.url === '/my-courses/all';
  }
}
