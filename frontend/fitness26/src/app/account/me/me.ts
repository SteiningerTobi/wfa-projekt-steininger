import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../shared/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

// Komponente für die Anzeige des eigenen Accountprofils.
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

  // Prüft, ob aktuell ein User eingeloggt ist.
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Holt den gespeicherten User aus der Session.
  getUser() {
    const user = sessionStorage.getItem('user');

    if (!user) {
      return null;
    }

    return JSON.parse(user);
  }

  // Gibt den Namen des aktuellen Users zurück.
  getUserName(): string {
    const user = this.getUser();

    return user?.user_name || user?.name || 'Benutzer';
  }

  // Gibt die E-Mail-Adresse des aktuellen Users zurück.
  getUserEmail(): string {
    const user = this.getUser();

    return user?.email || '';
  }

  // Gibt die Rolle des aktuellen Users zurück.
  getUserRole(): string {
    const user = this.getUser();

    return user?.role || this.authService.getRole() || '';
  }

  // Loggt den User aus und leitet zum Accountbereich weiter.
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/account']);
  }

  // Zeigt einen Hinweis für noch nicht implementierte Features.
  toBeImplemented(): void {
    this.toastr.warning(
      'Aktuell ist dieses Feature noch nicht implementiert.',
      'Achtung'
    );
  }

  // Holt die Trainerdaten aus dem gespeicherten Userobjekt.
  getTrainerData() {
    const user = this.getUser();

    return user?.trainer_data ?? user?.trainerData ?? null;
  }

  // Gibt das Trainer-Profilbild oder ein Standardbild zurück.
  getProfileImage(): string {
    const trainerData = this.getTrainerData();

    return trainerData?.profile_image
      || trainerData?.image_path
      || 'https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067?s=fit&w=720&h=720';
  }

  // Gibt die Telefonnummer aus den Trainerdaten zurück.
  getTrainerPhone(): string {
    const trainerData = this.getTrainerData();

    return trainerData?.phone || '';
  }

  // Gibt die Kontakt-E-Mail aus den Trainerdaten zurück.
  getTrainerContactEmail(): string {
    const trainerData = this.getTrainerData();

    return trainerData?.contact_mail //|| this.getUserEmail();
  }

  // Gibt die Trainer-Bio zurück.
  getTrainerBio(): string {
    const trainerData = this.getTrainerData();

    return trainerData?.bio || '';
  }
}
