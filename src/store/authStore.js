import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null, // { name, email, role, branch }
      login: (userData, credentials) => {
        if (credentials.email === 'malwatrolley@gmail.com' && credentials.password === 'Malwa822') {
          set({ isAuthenticated: true, user: userData });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
export default useAuthStore;
