export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user?: User;
  errors?: Record<string, string[]>;
}

export interface ValidationErrors {
  email?: string[];
  password?: string[];
  general?: string;
}

export interface RegisterValidationErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  password_confirmation?: string[];
  general?: string;
}
