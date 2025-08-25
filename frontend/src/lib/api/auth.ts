import apiClient from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
}

export class AuthAPI {
  // Login user
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/accounts/login/', credentials);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (response.data) {
      // Store tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return response.data;
    }
    
    throw new Error('Login failed');
  }

  // Register user
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/accounts/register/', userData);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (response.data) {
      // Store tokens
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      return response.data;
    }
    
    throw new Error('Registration failed');
  }

  // Get current user profile
  static async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/api/accounts/me/');
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error('Failed to fetch profile');
  }

  // Refresh access token
  static async refreshToken(): Promise<{ access: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ access: string }>('/api/accounts/token/refresh/', {
      refresh: refreshToken
    });
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (response.data) {
      localStorage.setItem('access_token', response.data.access);
      return response.data;
    }
    
    throw new Error('Token refresh failed');
  }

  // Logout user
  static async logout(): Promise<void> {
    // Clear tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    // Note: Django backend doesn't have a logout endpoint by default
    // but we can add one if needed for server-side token invalidation
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Get access token
  static getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
} 