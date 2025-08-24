import { writable } from 'svelte/store';

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
    login: (user: User) => {
      set({
        isAuthenticated: true,
        user,
        isLoading: false
      });
      // Store in localStorage for persistence
      localStorage.setItem('auth', JSON.stringify({ user, isAuthenticated: true }));
    },
    logout: () => {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
      // Clear localStorage
      localStorage.removeItem('auth');
    },
    initialize: () => {
      // Check localStorage on app start
      const stored = localStorage.getItem('auth');
      if (stored) {
        try {
          const { user, isAuthenticated } = JSON.parse(stored);
          if (isAuthenticated && user) {
            set({ isAuthenticated: true, user, isLoading: false });
          }
        } catch (error) {
          console.error('Failed to parse stored auth:', error);
          localStorage.removeItem('auth');
        }
      }
    },
    setLoading: (loading: boolean) => {
      update(state => ({ ...state, isLoading: loading }));
    }
  };
}

export const auth = createAuthStore(); 