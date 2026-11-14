export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly avatar: string;
  readonly joinedAt: string;
}

export interface AuthResult {
  readonly success: boolean;
  readonly error?: string;
  readonly user?: User;
}
