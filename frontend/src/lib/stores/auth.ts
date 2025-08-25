import { writable } from 'svelte/store';
import { AuthAPI, type UserProfile } from '$lib/api/auth';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false
  });

  return {
    subscribe,
    login: async (email: string, password: string) => {
      update(state => ({ ...state, isLoading: true }));
      
      try {
        const response = await AuthAPI.login({ email, password });
        
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: `${response.user.first_name} ${response.user.last_name}`.trim() || response.user.email.split('@')[0]
        };

        set({
          isAuthenticated: true,
          user,
          isLoading: false
        });

        return { success: true, user };
      } catch (error) {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
        throw error;
      }
    },
    register: async (userData: any) => {
      update(state => ({ ...state, isLoading: true }));
      
      try {
        const response = await AuthAPI.register(userData);
        
        const user: User = {
          id: response.user.id,
          email: response.user.email,
          name: `${response.user.first_name} ${response.user.last_name}`.trim() || response.user.email.split('@')[0]
        };

        set({
          isAuthenticated: true,
          user,
          isLoading: false
        });

        return { success: true, user };
      } catch (error) {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
        throw error;
      }
    },
    logout: async () => {
      try {
        await AuthAPI.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
      }
    },
    initialize: async () => {
      // Check if user is authenticated via token
      if (AuthAPI.isAuthenticated()) {
        try {
          const profile = await AuthAPI.getProfile();
          const user: User = {
            id: profile.id,
            email: profile.email,
            name: `${profile.first_name} ${profile.last_name}`.trim() || profile.email.split('@')[0]
          };
          
          set({
            isAuthenticated: true,
            user,
            isLoading: false
          });
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          // Token might be invalid, clear it
          AuthAPI.logout();
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false
          });
        }
      }
    },
    setLoading: (loading: boolean) => {
      update(state => ({ ...state, isLoading: loading }));
    }
  };
}

export const auth = createAuthStore(); 