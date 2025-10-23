import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null, // { name, email, role, branch }
      login: (userData, credentials) => {
        const validCredentials = [
          { email: 'malwatrolley@gmail.com', password: 'Malwa822' },
          { email: 'SheddySmith822@gmail.com', password: 'S#d_8224' }
        ];

        const isValid = validCredentials.some(
          cred => cred.email === credentials.email && cred.password === credentials.password
        );

        if (isValid) {
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
