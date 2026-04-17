import { apiClient } from "../../infrastructure/clients/api.client";

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
}

export const authService = {
  /**
   * Mengirim kredensial untuk mendapatkan JWT Access Token
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      username,
      password,
    });

    return response.data;
  },
};
