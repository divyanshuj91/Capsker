export type AuthProvider = "email" | "google" | "github" | "discord";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: AuthProvider;
}
