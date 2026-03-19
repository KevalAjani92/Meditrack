export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImageUrl: string | null;
  hospitalgroupid?: number | null;
  hospitalid?: number | null;
}
