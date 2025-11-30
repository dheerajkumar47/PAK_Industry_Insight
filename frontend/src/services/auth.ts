import api from './api';

export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  async register(email: string, password: string, fullName: string) {
    const response = await api.post<User>('/auth/register', {
      email,
      password,
      full_name: fullName,
    });
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  async getCurrentUser() {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
