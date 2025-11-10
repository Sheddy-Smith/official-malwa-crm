import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useMultiplierStore = create(
  persist(
    (set) => ({
      multipliers: {},

      setMultiplier: (itemId, multiplier) =>
        set((state) => ({
          multipliers: {
            ...state.multipliers,
            [itemId]: multiplier,
          },
        })),

      getMultiplier: (itemId) => (state) => state.multipliers[itemId] || 1,

      clearMultipliers: () => set({ multipliers: {} }),
    }),
    {
      name: 'multiplier-storage',
    }
  )
);

export default useMultiplierStore;
