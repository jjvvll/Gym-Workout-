import api from "../api/axios";
import type {
  LoginCredentials,
  LoginResponse,
  User,
  RegisterCredentials,
  RegisterResponse,
} from "../types/auth";

export const authService = {
  async getCsrfCookie(): Promise<void> {
    await api.get("/sanctum/csrf-cookie");
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    await this.getCsrfCookie();
    const response = await api.post<LoginResponse>("/api/login", credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    await this.getCsrfCookie();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const response = await api.post<RegisterResponse>(
      "/api/register",
      credentials,
    );
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/api/logout");
  },

  async getUser(): Promise<User> {
    const response = await api.get<User>("/api/user");
    return response.data;
  },
};
