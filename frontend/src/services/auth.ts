import api from './api';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  picture?: string;
  email_notifs?: boolean;
  push_notifs?: boolean;
  watchlist?: string[];
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

  async login(email: string, password: string, rememberMe: boolean = false) {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    if (response.data.access_token) {
      if (rememberMe) {
        localStorage.setItem('token', response.data.access_token);
        sessionStorage.removeItem('token'); // Clear session if switching
      } else {
        sessionStorage.setItem('token', response.data.access_token);
        localStorage.removeItem('token'); // Clear local if switching
      }
    }
    return response.data;
  },

  async googleLogin(credential: string) {
    const response = await api.post<AuthResponse>('/auth/google', {
      credential,
    });
    if (response.data.access_token) {
      sessionStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  async resetPassword(email: string, newPassword: string) {
    const response = await api.post('/auth/reset-password', {
      email,
      new_password: newPassword,
    });
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.post('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
    });
    return response.data;
  },

  async updateUser(data: Partial<User>) {
    const response = await api.put<User>('/auth/me', data);
    return response.data;
  },

  logout() {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
  },

  async getCurrentUser() {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  isAuthenticated() {
    return !!(sessionStorage.getItem('token') || localStorage.getItem('token'));
  }
};
