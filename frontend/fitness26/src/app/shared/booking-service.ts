import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BookingSession {
  id: number;
  course_id: number;
  start_date: string;
  duration: number;
  status: string;
  pivot: {
    booking_id: number;
    session_id: number;
    status: string;
    cancelled_at: string | null;
    created_at: string;
    updated_at: string;
  };
  course: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    max_capacity: number;
    image_path: string;
    address: string;
    trainer_id: number;
  };
}

export interface Booking {
  id: number;
  user_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  sessions: BookingSession[];
}

// Service für Buchungen und Terminbuchungen.
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private api = 'http://fitness26.s2310456022.student.kwmhgb.at/api';

  constructor(private http: HttpClient) {}

  // Lädt alle Buchungen des aktuell eingeloggten Users.
  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.api}/my-bookings`);
  }

  // Storniert eine komplette Buchung.
  cancelBooking(id: number): Observable<unknown> {
    return this.http.put(`${this.api}/bookings/${id}/cancel`, {});
  }

  // Storniert einen einzelnen Termin innerhalb einer Buchung.
  cancelSession(bookingId: number, sessionId: number): Observable<unknown> {
    return this.http.put(`${this.api}/session-bookings/${bookingId}/${sessionId}/cancel`, {});
  }

  // Erstellt eine Buchung für einen oder mehrere Termine.
  bookSessions(sessionIds: number[]): Observable<unknown> {
    return this.http.post(`${this.api}/bookings`, {
      session_ids: sessionIds
    });
  }
}
