import { Booking } from '../classes/booking';
import { SessionBookingFactory } from './session-booking.factory';

// Factory zum Umwandeln von Booking-JSON in Booking-Objekte.
export class BookingFactory {
  // Erstellt ein einzelnes Booking-Objekt aus Backend-JSON.
  static fromJson(json: any): Booking {
    return new Booking(
      json.id,
      json.user_id,
      json.booked_at,
      json.status,
      SessionBookingFactory.fromJsonArray(json.session_bookings ?? []),
      json.created_at ?? null,
      json.updated_at ?? null
    );
  }

  // Erstellt mehrere Booking-Objekte aus einem JSON-Array.
  static fromJsonArray(jsonArray: any[] = []): Booking[] {
    return jsonArray.map(json => BookingFactory.fromJson(json));
  }
}
