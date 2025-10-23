import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const useSupplierStore = create((set, get) => ({
  suppliers: [],
  loading: false,
  error: null,

  fetchSuppliers: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      set({ suppliers: data || [], loading: false });
      return data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to load suppliers');
      throw error;
    }
  },

  addSupplier: async (supplierData) => {
    try {
      set({ loading: true, error: null });
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

      set((state) => ({ suppliers: [...state.suppliers, data], loading: false }));
      toast.success('Supplier added successfully');
      return data;
    } catch (error) {
      console.error('Error adding supplier:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to add supplier');
      throw error;
    }
  },

  updateSupplier: async (updatedSupplier) => {
    try {
      set({ loading: true, error: null });
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
        loading: false,
      }));
      toast.success('Supplier updated successfully');
    } catch (error) {
      console.error('Error updating supplier:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to update supplier');
      throw error;
    }
  },

  deleteSupplier: async (supplierId) => {
    try {
      set({ loading: true, error: null });
      const { error} = await supabase.from('suppliers').delete().eq('id', supplierId);

      if (error) throw error;

      set((state) => ({
        suppliers: state.suppliers.filter((s) => s.id !== supplierId),
        loading: false,
      }));
      toast.success('Supplier deleted successfully');
    } catch (error) {
      console.error('Error deleting supplier:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to delete supplier');
      throw error;
    }
  },
}));

export default useSupplierStore;
