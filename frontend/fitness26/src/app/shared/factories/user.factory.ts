import { User, UserRole } from '../classes/user';
import { TrainerDataFactory } from './trainer-data.factory';

// Factory zum Umwandeln von User-JSON in User-Objekte.
export class UserFactory {
  // Erstellt ein einzelnes User-Objekt inklusive optionaler Trainerdaten.
  static fromJson(json: any): User {
    return new User(
      json.id,
      json.user_name,
      json.email,
      json.role as UserRole,
      json.trainer_data ? TrainerDataFactory.fromJson(json.trainer_data) : null,
      json.created_at ?? null,
      json.updated_at ?? null
    );
  }

  // Erstellt mehrere User-Objekte aus einem JSON-Array.
  static fromJsonArray(jsonArray: any[] = []): User[] {
    return jsonArray.map(json => UserFactory.fromJson(json));
  }
}
