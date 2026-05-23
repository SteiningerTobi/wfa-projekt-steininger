import { User, UserRole } from '../classes/user';
import { TrainerDataFactory } from './trainer-data.factory';

export class UserFactory {
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

  static fromJsonArray(jsonArray: any[] = []): User[] {
    return jsonArray.map(json => UserFactory.fromJson(json));
  }
}
