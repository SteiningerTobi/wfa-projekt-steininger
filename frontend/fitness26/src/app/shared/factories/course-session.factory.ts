import { CourseSession } from '../classes/course-session';

export class CourseSessionFactory {
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

  static fromJsonArray(jsonArray: any[] = []): CourseSession[] {
    return jsonArray.map(json => CourseSessionFactory.fromJson(json));
  }
}
