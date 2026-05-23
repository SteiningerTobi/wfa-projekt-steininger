import { Component, Input } from '@angular/core';
import { User } from '../../shared/classes/user';

@Component({
  selector: 'bs-trainer-info',
  standalone: true,
  imports: [],
  templateUrl: './trainer-info.html',
  styleUrl: './trainer-info.css'
})
export class TrainerInfo {
  @Input() trainer: User | null | undefined;
}
