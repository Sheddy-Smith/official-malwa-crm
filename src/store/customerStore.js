import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const useCustomerStore = create(
  persist(
    (set, get) => ({
      customers: [],
      loading: false,
      error: null,

      fetchCustomers: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ customers: data || [] });
          return data;
        } catch (error) {
          console.error('Error fetching customers:', error);
          set({ error: error.message });
          toast.error('Failed to load customers');
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      addCustomer: async (customer) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('customers')
            .insert([{
              name: customer.name,
              company: customer.company || null,
              phone: customer.phone,
              address: customer.address || null,
              gstin: customer.gstin || null,
              opening_balance: customer.opening_balance || 0,
              current_balance: customer.opening_balance || 0,
            }])
            .select()
            .single();

          if (error) throw error;

          if (data.opening_balance > 0) {
            await supabase.from('customer_ledger_entries').insert([{
              customer_id: data.id,
              entry_date: new Date().toISOString().split('T')[0],
              particulars: 'Opening Balance',
              ref_type: 'opening',
              debit: data.opening_balance,
              credit: 0,
              balance: data.opening_balance,
            }]);
          }

          set((state) => ({
            customers: [data, ...state.customers],
            loading: false,
          }));

          toast.success('Customer added successfully');
          return data;
        } catch (error) {
          console.error('Error adding customer:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to add customer: ' + error.message);
          throw error;
        }
      },

      updateCustomer: async (updatedCustomer) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('customers')
            .update({
              name: updatedCustomer.name,
              company: updatedCustomer.company || null,
              phone: updatedCustomer.phone,
              address: updatedCustomer.address || null,
              gstin: updatedCustomer.gstin || null,
            })
            .eq('id', updatedCustomer.id)
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            customers: state.customers.map((c) =>
              c.id === updatedCustomer.id ? data : c
            ),
            loading: false,
          }));

          toast.success('Customer updated successfully');
          return data;
        } catch (error) {
          console.error('Error updating customer:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to update customer');
          throw error;
        }
      },

      deleteCustomer: async (customerId) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', customerId);

          if (error) throw error;

          set((state) => ({
            customers: state.customers.filter((c) => c.id !== customerId),
            loading: false,
          }));

          toast.success('Customer deleted successfully');
        } catch (error) {
          console.error('Error deleting customer:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to delete customer');
          throw error;
        }
      },

      addLedgerEntry: async (customerId, entry) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('customer_ledger_entries')
            .insert([{
              customer_id: customerId,
              entry_date: entry.entry_date || new Date().toISOString().split('T')[0],
              particulars: entry.particulars,
              ref_type: entry.ref_type || null,
              ref_no: entry.ref_no || null,
              ref_id: entry.ref_id || null,
              debit: entry.debit || 0,
              credit: entry.credit || 0,
              notes: entry.notes || null,
            }])
            .select()
            .single();

          if (error) throw error;

          await get().fetchCustomers();

          set({ loading: false });
          toast.success('Ledger entry added successfully');
          return data;
        } catch (error) {
          console.error('Error adding ledger entry:', error);
          set({ error: error.message, loading: false });
          toast.error('Failed to add ledger entry');
          throw error;
        }
      },
    }),
    { name: 'customer-storage' }
  )
);

export default useCustomerStore;
