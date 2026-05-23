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

  hasProfileImage(): boolean {
    return !!this.profile_image;
  }

  hasBio(): boolean {
    return !!this.bio;
  }

  getContactMail(): string | null {
    return this.contact_mail ?? null;
  }
}
