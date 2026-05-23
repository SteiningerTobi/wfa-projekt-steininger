import { TrainerData } from './trainer-data';

export type UserRole = 'trainer' | 'participant';

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

  getDisplayName(): string {
    return this.user_name || this.email;
  }

  isTrainer(): boolean {
    return this.role === 'trainer';
  }

  isParticipant(): boolean {
    return this.role === 'participant';
  }
}
