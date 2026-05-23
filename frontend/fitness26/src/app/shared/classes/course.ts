import { Category } from './category';
import { CourseSession } from './course-session';
import { TrainerData} from './trainer-data';
import { User } from './user'

export class Course {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public difficulty: 'beginner' | 'intermediate' | 'advanced',
    public max_capacity: number,
    public address: string,
    public trainer_id: number,
    public image_path?: string | null,
    public categories: Category[] = [],
    public sessions: CourseSession[] = [],
    public trainer?: User | null,
    public created_at?: string | null,
    public updated_at?: string | null
  ) {
  }

  getDifficultyLabel(): string {
    switch (this.difficulty) {
      case 'beginner':
        return 'Anfänger';
      case 'intermediate':
        return 'Fortgeschrittene';
      case 'advanced':
        return 'Profis';
      default:
        return this.difficulty;
    }
  }
}
