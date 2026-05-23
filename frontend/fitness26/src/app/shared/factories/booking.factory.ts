import { Booking } from '../classes/booking';
import { SessionBookingFactory } from './session-booking.factory';

export class BookingFactory {
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

  static fromJsonArray(jsonArray: any[] = []): Booking[] {
    return jsonArray.map(json => BookingFactory.fromJson(json));
  }
}
