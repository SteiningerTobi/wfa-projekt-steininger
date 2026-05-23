// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { DatePipe } from '@angular/common';
// import { Booking } from '../../shared/booking-service';
//
// @Component({
//   selector: 'bs-booking-list-item',
//   standalone: true,
//   imports: [
//     DatePipe
//   ],
//   templateUrl: './booking-list-item.html',
//   styleUrl: './booking-list-item.css'
// })
// export class BookingListItem {
//   @Input({ required: true }) booking!: Booking;
//
//   @Output() cancelBookingClicked = new EventEmitter<number>();
//   @Output() cancelSessionClicked = new EventEmitter<{ bookingId: number; sessionId: number }>();
//
//   cancelBooking(): void {
//     this.cancelBookingClicked.emit(this.booking.id);
//   }
//
//   cancelSession(sessionId: number): void {
//     this.cancelSessionClicked.emit({
//       bookingId: this.booking.id,
//       sessionId
//     });
//   }
// }
