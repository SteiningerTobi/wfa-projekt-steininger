import { TrainerData } from './trainer-data';

export type UserRole = 'trainer' | 'participant';

// Model-Klasse für einen User.
export class User {
  constructor(
    public id: number,
    public user_name: string,
    public email: string,
    public role: UserRole,
    public trainer_data?: TrainerData | null,
    public created_at?: string | null,
    public updated_at?: string | null
  ) {}

  // Gibt den Anzeigenamen des Users zurück.
  getDisplayName(): string {
    return this.user_name || this.email;
  }

  // Prüft, ob der User Trainer:in ist.
  isTrainer(): boolean {
    return this.role === 'trainer';
  }

  // Prüft, ob der User Teilnehmer:in ist.
  isParticipant(): boolean {
    return this.role === 'participant';
  }
}
