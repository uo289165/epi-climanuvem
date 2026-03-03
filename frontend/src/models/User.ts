export interface User {
  id: string;
  name?: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}
