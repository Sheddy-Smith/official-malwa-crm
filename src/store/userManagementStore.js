import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const useUserManagementStore = create(
  persist(
    (set) => ({
      users: [
        { id: 'default-user', name: 'Demo User', email: 'malwatrolley@gmail.com', role: 'Project Manager', branch: 'Head Office', status: 'Active' },
      ],
      addUser: (user) => set((state) => ({
        users: [...state.users, { id: uuidv4(), status: 'Active', ...user }],
      })),
      updateUser: (updatedUser) => set((state) => ({
        users: state.users.map((u) => u.id === updatedUser.id ? updatedUser : u),
      })),
      deleteUser: (userId) => set((state) => ({
        users: state.users.filter((u) => u.id !== userId),
      })),
    }),
    { name: 'user-management-storage' }
  )
);
export default useUserManagementStore;
