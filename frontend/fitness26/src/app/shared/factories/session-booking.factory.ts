import { SessionBooking } from '../classes/session-booking';
import { CourseSessionFactory } from './course-session.factory';

export class SessionBookingFactory {
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

  static fromJsonArray(jsonArray: any[] = []): SessionBooking[] {
    return jsonArray.map(json => SessionBookingFactory.fromJson(json));
  }
}
