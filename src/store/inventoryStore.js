import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const useInventoryStore = create(
  persist(
    (set) => ({
      stockItems: [],
      categories: [
        { id: 'hardware', name: 'Hardware' },
        { id: 'steel', name: 'Steel' },
        { id: 'paints', name: 'Paints' },
        { id: 'parts', name: 'Parts' },
      ],
      addStockItem: (item) => set((state) => ({ stockItems: [...state.stockItems, { id: uuidv4(), ...item }] })),
      updateStockItem: (updatedItem) => set((state) => ({ stockItems: state.stockItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)) })),
      deleteStockItem: (itemId) => set((state) => ({ stockItems: state.stockItems.filter((item) => item.id !== itemId) })),
      addCategory: (categoryName) => set((state) => ({ categories: [...state.categories, { id: uuidv4(), name: categoryName }] })),
    }),
    { name: 'inventory-storage' }
  )
);
export default useInventoryStore;

