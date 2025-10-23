import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

const useInventoryStore = create((set, get) => ({
  stockItems: [],
  categories: [],
  stockMovements: [],
  loading: false,

  fetchCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('inventory_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      set({ categories: data || [] });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },

  addCategory: async (categoryName) => {
    try {
      const { data, error } = await supabase
        .from('inventory_categories')
        .insert([{ name: categoryName }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ categories: [...state.categories, data] }));
      return data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  updateCategory: async (categoryId, newName) => {
    try {
      const { error } = await supabase
        .from('inventory_categories')
        .update({ name: newName })
        .eq('id', categoryId);

      if (error) throw error;

      set((state) => ({
        categories: state.categories.map((c) => (c.id === categoryId ? { ...c, name: newName } : c)),
      }));
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const { error } = await supabase.from('inventory_categories').delete().eq('id', categoryId);

      if (error) throw error;

      set((state) => ({
        categories: state.categories.filter((c) => c.id !== categoryId),
      }));
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  fetchStockItems: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*, category:inventory_categories(name)')
        .order('name', { ascending: true });

      if (error) throw error;
      set({ stockItems: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching stock items:', error);
      set({ loading: false });
    }
  },

  addStockItem: async (itemData) => {
    try {
      const newItem = {
        name: itemData.name,
        code: itemData.code || null,
        category_id: itemData.category_id,
        unit: itemData.unit || 'pcs',
        current_stock: itemData.current_stock || 0,
        reorder_level: itemData.reorder_level || 0,
        cost_price: itemData.cost_price || 0,
        selling_price: itemData.selling_price || 0,
        location: itemData.location || null,
      };

      const { data, error } = await supabase
        .from('inventory_items')
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ stockItems: [...state.stockItems, data] }));
      return data;
    } catch (error) {
      console.error('Error adding stock item:', error);
      throw error;
    }
  },

  updateStockItem: async (updatedItem) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          name: updatedItem.name,
          code: updatedItem.code,
          category_id: updatedItem.category_id,
          unit: updatedItem.unit,
          reorder_level: updatedItem.reorder_level,
          cost_price: updatedItem.cost_price,
          selling_price: updatedItem.selling_price,
          location: updatedItem.location,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedItem.id);

      if (error) throw error;

      set((state) => ({
        stockItems: state.stockItems.map((item) => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item)),
      }));
    } catch (error) {
      console.error('Error updating stock item:', error);
      throw error;
    }
  },

  deleteStockItem: async (itemId) => {
    try {
      const { error } = await supabase.from('inventory_items').delete().eq('id', itemId);

      if (error) throw error;

      set((state) => ({
        stockItems: state.stockItems.filter((item) => item.id !== itemId),
      }));
    } catch (error) {
      console.error('Error deleting stock item:', error);
      throw error;
    }
  },

  fetchStockMovements: async (filters = {}) => {
    try {
      let query = supabase
        .from('stock_movements')
        .select('*, item:inventory_items(name, code, unit)')
        .order('movement_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters.item_id) query = query.eq('item_id', filters.item_id);
      if (filters.start_date) query = query.gte('movement_date', filters.start_date);
      if (filters.end_date) query = query.lte('movement_date', filters.end_date);

      const { data, error } = await query;

      if (error) throw error;
      set({ stockMovements: data || [] });
    } catch (error) {
      console.error('Error fetching stock movements:', error);
    }
  },

  addStockMovement: async (movementData) => {
    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .insert([movementData])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ stockMovements: [data, ...state.stockMovements] }));
      return data;
    } catch (error) {
      console.error('Error adding stock movement:', error);
      throw error;
    }
  },
}));

export default useInventoryStore;

