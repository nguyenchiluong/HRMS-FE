import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
}

// 2. Define the Store State interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
}

// 3. Create the store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        // Optional: Set the token in localStorage specifically if needed elsewhere
        // localStorage.setItem('token', token);

        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        // Optional: Clear specific items
        // localStorage.removeItem('token');

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // (optional) by default it's localStorage
    },
  ),
);
