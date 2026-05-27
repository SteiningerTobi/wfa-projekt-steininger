export class TrainerData {
  constructor(
    public id: number,
    public user_id: number,
    public name: string,
    public bio?: string | null,
    public phone?: string | null,
    public profile_image?: string | null,
    public contact_mail?: string | null,
    public created_at?: string | null,
    public updated_at?: string | null
  ) {}

  // Prüft, ob ein Profilbild vorhanden ist.
  hasProfileImage(): boolean {
    return !!this.profile_image;
  }

  // Prüft, ob eine Trainer-Bio vorhanden ist.
  hasBio(): boolean {
    return !!this.bio;
  }

  // Gibt die Kontakt-E-Mail zurück, falls vorhanden.
  getContactMail(): string | null {
    return this.contact_mail ?? null;
  }
}
