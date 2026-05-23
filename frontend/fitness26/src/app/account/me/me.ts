import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../shared/authentication.service';
import {ToastrService} from 'ngx-toastr';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'bs-me',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './me.html',
  styleUrl: './me.css',
})
export class Me {
  private router = inject(Router);
  public authService = inject(AuthenticationService);
  private toastr = inject(ToastrService);

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUser() {
    const user = sessionStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  getUserName(): string {
    const user = this.getUser();

    return user?.user_name || user?.name || 'Benutzer';
  }

  getUserEmail(): string {
    const user = this.getUser();

    return user?.email || '';
  }

  getUserRole(): string {
    const user = this.getUser();

    return user?.role || this.authService.getRole() || '';
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/account']);
  }

  toBeImplemented(): void {
    this.toastr.warning(
      'Aktuell ist dieses Feature noch nicht implementiert.',
      'Achtung'
    );
  }

  getTrainerData() {
    const user = this.getUser();

    return user?.trainer_data ?? user?.trainerData ?? null;
  }

  getProfileImage(): string {
    const trainerData = this.getTrainerData();

    return trainerData?.profile_image
      || trainerData?.image_path
      || 'https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067?s=fit&w=720&h=720';
  }

  getTrainerPhone(): string {
    const trainerData = this.getTrainerData();

    return trainerData?.phone || '';
  }

  getTrainerContactEmail(): string {
    const trainerData = this.getTrainerData();

    return trainerData?.contact_mail //|| this.getUserEmail();
  }

  getTrainerBio(): string {
    const trainerData = this.getTrainerData();

    return trainerData?.bio || '';
  }
}
