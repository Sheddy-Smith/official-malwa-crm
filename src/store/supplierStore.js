import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

const useSupplierStore = create((set, get) => ({
  suppliers: [],
  loading: false,

  fetchSuppliers: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      set({ suppliers: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      set({ loading: false });
    }
  },

  addSupplier: async (supplierData) => {
    try {
      const newSupplier = {
        name: supplierData.name,
        company: supplierData.company || null,
        phone: supplierData.phone,
        address: supplierData.address || null,
        gstin: supplierData.gstin || null,
        opening_balance: supplierData.opening_balance || 0,
        current_balance: supplierData.opening_balance || 0,
        credit_limit: supplierData.credit_limit || 0,
      };

      const { data, error } = await supabase
        .from('suppliers')
        .insert([newSupplier])
        .select()
        .single();

      if (error) throw error;

      if (data && parseFloat(data.opening_balance) !== 0) {
        await supabase.from('supplier_ledger_entries').insert([{
          supplier_id: data.id,
          entry_date: new Date().toISOString().split('T')[0],
          particulars: 'Opening Balance',
          ref_type: 'opening',
          debit: parseFloat(data.opening_balance),
          credit: 0,
        }]);
      }

      set((state) => ({ suppliers: [...state.suppliers, data] }));
      return data;
    } catch (error) {
      console.error('Error adding supplier:', error);
      throw error;
    }
  },

  updateSupplier: async (updatedSupplier) => {
    try {
      const { error } = await supabase
        .from('suppliers')
        .update({
          name: updatedSupplier.name,
          company: updatedSupplier.company,
          phone: updatedSupplier.phone,
          address: updatedSupplier.address,
          gstin: updatedSupplier.gstin,
          credit_limit: updatedSupplier.credit_limit,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedSupplier.id);

      if (error) throw error;

      set((state) => ({
        suppliers: state.suppliers.map((s) => (s.id === updatedSupplier.id ? { ...s, ...updatedSupplier } : s)),
      }));
    } catch (error) {
      console.error('Error updating supplier:', error);
      throw error;
    }
  },

  deleteSupplier: async (supplierId) => {
    try {
      const { error} = await supabase.from('suppliers').delete().eq('id', supplierId);

      if (error) throw error;

      set((state) => ({
        suppliers: state.suppliers.filter((s) => s.id !== supplierId),
      }));
    } catch (error) {
      console.error('Error deleting supplier:', error);
      throw error;
    }
  },
}));

export default useSupplierStore;
