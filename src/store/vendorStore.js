import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const useVendorStore = create((set, get) => ({
  vendors: [],
  loading: false,
  error: null,

  fetchVendors: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      set({ vendors: data || [], loading: false });
      return data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to load vendors');
      throw error;
    }
  },

  addVendor: async (vendorData) => {
    try {
      set({ loading: true, error: null });
      const newVendor = {
        name: vendorData.name,
        company: vendorData.company || null,
        phone: vendorData.phone,
        address: vendorData.address || null,
        gstin: vendorData.gstin || null,
        vendor_type: vendorData.vendor_type || null,
        opening_balance: vendorData.opening_balance || 0,
        current_balance: vendorData.opening_balance || 0,
        credit_limit: vendorData.credit_limit || 0,
      };

      const { data, error } = await supabase
        .from('vendors')
        .insert([newVendor])
        .select()
        .single();

      if (error) throw error;

      if (data && parseFloat(data.opening_balance) !== 0) {
        await supabase.from('vendor_ledger_entries').insert([{
          vendor_id: data.id,
          entry_date: new Date().toISOString().split('T')[0],
          particulars: 'Opening Balance',
          ref_type: 'opening',
          debit: parseFloat(data.opening_balance),
          credit: 0,
        }]);
      }

      set((state) => ({ vendors: [...state.vendors, data], loading: false }));
      toast.success('Vendor added successfully');
      return data;
    } catch (error) {
      console.error('Error adding vendor:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to add vendor');
      throw error;
    }
  },

  updateVendor: async (updatedVendor) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('vendors')
        .update({
          name: updatedVendor.name,
          company: updatedVendor.company,
          phone: updatedVendor.phone,
          address: updatedVendor.address,
          gstin: updatedVendor.gstin,
          vendor_type: updatedVendor.vendor_type,
          credit_limit: updatedVendor.credit_limit,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedVendor.id);

      if (error) throw error;

      set((state) => ({
        vendors: state.vendors.map((v) => (v.id === updatedVendor.id ? { ...v, ...updatedVendor } : v)),
        loading: false,
      }));
      toast.success('Vendor updated successfully');
    } catch (error) {
      console.error('Error updating vendor:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to update vendor');
      throw error;
    }
  },

  deleteVendor: async (vendorId) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase.from('vendors').delete().eq('id', vendorId);

      if (error) throw error;

      set((state) => ({
        vendors: state.vendors.filter((v) => v.id !== vendorId),
        loading: false,
      }));
      toast.success('Vendor deleted successfully');
    } catch (error) {
      console.error('Error deleting vendor:', error);
      set({ error: error.message, loading: false });
      toast.error('Failed to delete vendor');
      throw error;
    }
  },
}));

export default useVendorStore;
