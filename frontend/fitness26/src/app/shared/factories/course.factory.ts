import { Course } from '../classes/course';
import { CategoryFactory } from './category.factory';
import { CourseSessionFactory } from './course-session.factory';
import { UserFactory } from './user.factory';

// Factory zum Umwandeln von Course-JSON in Course-Objekte.
export class CourseFactory {
  // Erstellt ein einzelnes Course-Objekt inklusive Kategorien, Terminen und Trainerdaten.
  static fromJson(json: any): Course {
    return new Course(
      json.id,
      json.title,
      json.description,
      json.difficulty,
      json.max_capacity,
      json.address,
      json.trainer_id,
      json.image_path ?? null,
      CategoryFactory.fromJsonArray(json.categories ?? []),
      CourseSessionFactory.fromJsonArray(json.sessions ?? []),
      json.trainer ? UserFactory.fromJson(json.trainer) : null,
      json.created_at ?? null,
      json.updated_at ?? null
    );
  }

  // Erstellt mehrere Course-Objekte aus einem JSON-Array.
  static fromJsonArray(jsonArray: any[] = []): Course[] {
    return jsonArray.map(json => CourseFactory.fromJson(json));
  }
}
