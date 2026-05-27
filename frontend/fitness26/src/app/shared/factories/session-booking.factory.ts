import { SessionBooking } from '../classes/session-booking';
import { CourseSessionFactory } from './course-session.factory';

// Factory zum Umwandeln von SessionBooking-JSON in SessionBooking-Objekte.
export class SessionBookingFactory {
  // Erstellt ein einzelnes SessionBooking-Objekt inklusive zugehörigem Kurstermin.
  static fromJson(json: any): SessionBooking {
    return new SessionBooking(
      json.booking_id,
      json.session_id,
      json.status,
      json.cancelled_at ?? null,
      json.session ? CourseSessionFactory.fromJson(json.session) : null,
      json.created_at ?? null,
      json.updated_at ?? null
    );
  }

  // Erstellt mehrere SessionBooking-Objekte aus einem JSON-Array.
  static fromJsonArray(jsonArray: any[] = []): SessionBooking[] {
    return jsonArray.map(json => SessionBookingFactory.fromJson(json));
  }
}
