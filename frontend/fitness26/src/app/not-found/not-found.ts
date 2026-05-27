import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

//404-Page-Component
@Component({
  selector: 'bs-not-found',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css'
})
export class NotFound {}
