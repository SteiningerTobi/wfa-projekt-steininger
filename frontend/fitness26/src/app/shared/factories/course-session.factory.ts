import { CourseSession } from '../classes/course-session';

// Factory zum Umwandeln von CourseSession-JSON in CourseSession-Objekte.
export class CourseSessionFactory {
  // Erstellt ein einzelnes CourseSession-Objekt aus Backend-JSON.
  static fromJson(json: any): CourseSession {
    return new CourseSession(
      json.id,
      json.course_id,
      json.start_date,
      json.duration,
      json.status,
      json.booked_count ?? 0,
      json.created_at ?? null,
      json.updated_at ?? null
    );
  }

  // Erstellt mehrere CourseSession-Objekte aus einem JSON-Array.
  static fromJsonArray(jsonArray: any[] = []): CourseSession[] {
    return jsonArray.map(json => CourseSessionFactory.fromJson(json));
  }
}
