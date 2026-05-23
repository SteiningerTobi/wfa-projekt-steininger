import { TrainerData } from '../classes/trainer-data';

export class TrainerDataFactory {
  static fromJson(json: any): TrainerData {
    return new TrainerData(
      json.id,
      json.user_id,
      json.name,
      json.bio ?? null,
      json.phone ?? null,
      json.profile_image ?? null,
      json.contact_mail ?? null,
      json.created_at ?? null,
      json.updated_at ?? null
    );
  }
}
