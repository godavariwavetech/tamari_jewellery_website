// Authentication service
import { apiService } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  token: string;
}

class AuthService {
  private user: User | null = null;
  private token: string | null = null;

  constructor() {
    // Load user from localStorage on initialization
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userData && token) {
        this.user = JSON.parse(userData);
        this.token = token;
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
      this.clearStorage();
    }
  }

  private saveUserToStorage(user: User, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    this.user = user;
    this.token = token;
  }

  private clearStorage() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.user = null;
    this.token = null;
  }

  async sendOTP(phone: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.getUserLoginOTP(phone);
      return response;
    } catch (error) {
      return { success: false, message: 'Failed to send OTP' };
    }
  }

  async login(phone: string, otp: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await apiService.customerLogin(phone, otp);
      
      if (response.success && response.user_id && response.token) {
        const user: User = {
          id: response.user_id,
          name: '', // Will be filled from profile
          email: '',
          phone,
          token: response.token
        };
        
        this.saveUserToStorage(user, response.token);
        
        // Fetch user profile to complete user data
        try {
          const profile = await apiService.getUserProfile(response.user_id);
          if (profile) {
            const updatedUser = { ...user, name: profile.name, email: profile.email };
            this.saveUserToStorage(updatedUser, response.token);
            return { success: true, message: response.message, user: updatedUser };
          }
        } catch (profileError) {
          console.warn('Could not fetch user profile:', profileError);
        }
        
        return { success: true, message: response.message, user };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: 'Login failed' };
    }
  }

  logout() {
    this.clearStorage();
    window.location.href = '/';
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.user !== null && this.token !== null;
  }

  async updateProfile(profileData: Partial<User>): Promise<boolean> {
    if (!this.user) return false;

    try {
      const response = await apiService.updateUserProfile({
        userId: this.user.id,
        name: profileData.name,
        email: profileData.email,
      });

      if (response.success) {
        const updatedUser = { ...this.user, ...profileData };
        this.saveUserToStorage(updatedUser, this.token!);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  }
}

export const authService = new AuthService();