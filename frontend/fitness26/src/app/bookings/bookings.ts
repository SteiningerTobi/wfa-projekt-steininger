import { Component } from '@angular/core';
import { BookingList } from './booking-list/booking-list';

// Wrapper-Komponente für die Buchungsübersicht.
@Component({
  selector: 'bs-bookings',
  standalone: true,
  imports: [
    BookingList
  ],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css'
})
export class Bookings {}
