import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

const useLabourStore = create((set, get) => ({
  labours: [],
  loading: false,

  fetchLabours: async () => {
    try {
      set({ loading: true });
      const { data, error } = await supabase
        .from('labour')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      set({ labours: data || [], loading: false });
    } catch (error) {
      console.error('Error fetching labour:', error);
      set({ loading: false });
    }
  },

  addLabour: async (labourData) => {
    try {
      const newLabour = {
        name: labourData.name,
        phone: labourData.phone || null,
        address: labourData.address || null,
        skill_type: labourData.skill_type || null,
        opening_balance: labourData.opening_balance || 0,
        current_balance: labourData.opening_balance || 0,
        daily_rate: labourData.daily_rate || 0,
      };

      const { data, error } = await supabase
        .from('labour')
        .insert([newLabour])
        .select()
        .single();

      if (error) throw error;

      if (data && parseFloat(data.opening_balance) !== 0) {
        await supabase.from('labour_ledger_entries').insert([{
          labour_id: data.id,
          entry_date: new Date().toISOString().split('T')[0],
          particulars: 'Opening Balance',
          ref_type: 'opening',
          debit: parseFloat(data.opening_balance),
          credit: 0,
        }]);
      }

      set((state) => ({ labours: [...state.labours, data] }));
      return data;
    } catch (error) {
      console.error('Error adding labour:', error);
      throw error;
    }
  },

  updateLabour: async (updatedLabour) => {
    try {
      const { error } = await supabase
        .from('labour')
        .update({
          name: updatedLabour.name,
          phone: updatedLabour.phone,
          address: updatedLabour.address,
          skill_type: updatedLabour.skill_type,
          daily_rate: updatedLabour.daily_rate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', updatedLabour.id);

      if (error) throw error;

      set((state) => ({
        labours: state.labours.map((l) => (l.id === updatedLabour.id ? { ...l, ...updatedLabour } : l)),
      }));
    } catch (error) {
      console.error('Error updating labour:', error);
      throw error;
    }
  },

  deleteLabour: async (labourId) => {
    try {
      const { error } = await supabase.from('labour').delete().eq('id', labourId);

      if (error) throw error;

      set((state) => ({
        labours: state.labours.filter((l) => l.id !== labourId),
      }));
    } catch (error) {
      console.error('Error deleting labour:', error);
      throw error;
    }
  },
}));

export default useLabourStore;
