import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const useJobsStore = create((set, get) => ({
  jobs: [],
  loading: false,
  error: null,
  currentJobId: null,

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customer_jobs')
        .select(`
          *,
          customers (
            id,
            name,
            company,
            phone,
            gstin
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ jobs: data || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error fetching jobs:', error);
    }
  },

  fetchJobById: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customer_jobs')
        .select(`
          *,
          customers (
            id,
            name,
            company,
            phone,
            gstin
          )
        `)
        .eq('id', jobId)
        .maybeSingle();

      if (error) throw error;
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error fetching job:', error);
      return null;
    }
  },

  createNewJob: async (jobData) => {
    set({ loading: true, error: null });
    try {
      const newJob = {
        id: uuidv4(),
        job_no: `JOB-${Date.now()}`,
        customer_id: jobData.customerId,
        vehicle_no: jobData.vehicleNo,
        owner_name: jobData.ownerName,
        branch: jobData.branch || 'Head Office',
        status: 'inspection',
        job_date: jobData.inspectionDate || new Date().toISOString().split('T')[0],
        inspection_data: { items: [], details: {} },
        estimate_data: { items: [], discount: 0, gst_rate: 18 },
        jobsheet_data: { items: [], extraWork: [], finalized: false },
        chalan_data: null,
        invoice_data: null,
        total_amount: 0,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('customer_jobs')
        .insert([newJob])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        jobs: [data, ...state.jobs],
        currentJobId: data.id,
        loading: false
      }));

      toast.success('Job created successfully');
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
      return null;
    }
  },

  updateJobDetails: async (jobId, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('customer_jobs')
        .update(updates)
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        jobs: state.jobs.map(job => job.id === jobId ? data : job),
        loading: false
      }));

      toast.success('Job updated successfully');
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
      return null;
    }
  },

  updateInspectionData: async (jobId, inspectionData) => {
    return get().updateJobDetails(jobId, {
      inspection_data: inspectionData,
      status: 'inspection'
    });
  },

  updateEstimateData: async (jobId, estimateData) => {
    return get().updateJobDetails(jobId, {
      estimate_data: estimateData,
      status: 'estimate'
    });
  },

  updateJobSheetData: async (jobId, jobsheetData) => {
    return get().updateJobDetails(jobId, {
      jobsheet_data: jobsheetData,
      status: 'jobsheet'
    });
  },

  finalizeJobSheet: async (jobId, jobsheetData) => {
    set({ loading: true, error: null });
    try {
      const job = await get().fetchJobById(jobId);
      if (!job) throw new Error('Job not found');

      const allItems = [
        ...(jobsheetData.items || []),
        ...(jobsheetData.extraWork || [])
      ];

      for (const item of allItems) {
        if (item.workBy === 'Labour' && item.labourId) {
          const amount = parseFloat(item.cost) * parseFloat(item.multiplier || 1);
          await supabase.from('labour_ledger_entries').insert({
            labour_id: item.labourId,
            date: new Date().toISOString().split('T')[0],
            type: 'debit',
            description: `Job ${job.job_no} - ${item.item}`,
            amount: amount,
            reference_type: 'job',
            reference_id: jobId
          });
        }

        if (item.workBy === 'Vendor' && item.vendorId) {
          const amount = parseFloat(item.cost) * parseFloat(item.multiplier || 1);
          await supabase.from('vendor_ledger_entries').insert({
            vendor_id: item.vendorId,
            date: new Date().toISOString().split('T')[0],
            type: 'debit',
            description: `Job ${job.job_no} - ${item.item}`,
            amount: amount,
            reference_type: 'job',
            reference_id: jobId
          });
        }

        if (item.inventoryItemId) {
          await supabase.from('stock_movements').insert({
            item_id: item.inventoryItemId,
            movement_type: 'out',
            quantity: parseFloat(item.quantity || 1),
            reference_type: 'job',
            reference_id: jobId,
            notes: `Used in Job ${job.job_no}`
          });
        }
      }

      const updatedJobsheet = { ...jobsheetData, finalized: true };
      await get().updateJobDetails(jobId, {
        jobsheet_data: updatedJobsheet,
        status: 'jobsheet'
      });

      set({ loading: false });
      toast.success('Job sheet finalized successfully');
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error finalizing job sheet:', error);
      toast.error('Failed to finalize job sheet');
      return false;
    }
  },

  updateChalanData: async (jobId, chalanData) => {
    return get().updateJobDetails(jobId, {
      chalan_data: chalanData,
      status: 'chalan'
    });
  },

  createInvoice: async (jobId, invoiceData) => {
    set({ loading: true, error: null });
    try {
      const job = await get().fetchJobById(jobId);
      if (!job) throw new Error('Job not found');

      const invoiceId = uuidv4();
      const invoiceNo = `INV-${Date.now()}`;

      const invoice = {
        id: invoiceId,
        invoice_no: invoiceNo,
        customer_id: job.customer_id,
        invoice_date: invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
        due_date: invoiceData.dueDate,
        subtotal: invoiceData.subtotal,
        gst_rate: invoiceData.gstRate,
        gst_amount: invoiceData.gstAmount,
        discount_amount: invoiceData.discountAmount || 0,
        total_amount: invoiceData.totalAmount,
        payment_status: 'pending',
        items: invoiceData.items,
        notes: invoiceData.notes
      };

      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert([invoice]);

      if (invoiceError) throw invoiceError;

      await supabase.from('customer_ledger_entries').insert({
        customer_id: job.customer_id,
        date: invoice.invoice_date,
        type: 'debit',
        description: `Invoice ${invoiceNo} - Job ${job.job_no}`,
        amount: invoice.total_amount,
        reference_type: 'invoice',
        reference_id: invoiceId
      });

      if (invoiceData.gstAmount > 0) {
        await supabase.from('gst_ledger').insert({
          date: invoice.invoice_date,
          type: 'output',
          invoice_no: invoiceNo,
          customer_supplier: job.customers?.name || job.owner_name,
          gstin: job.customers?.gstin,
          taxable_amount: invoice.subtotal,
          gst_rate: invoice.gst_rate,
          gst_amount: invoice.gst_amount,
          total_amount: invoice.total_amount
        });
      }

      await get().updateJobDetails(jobId, {
        invoice_data: { invoiceId, invoiceNo, ...invoiceData },
        status: 'completed',
        total_amount: invoice.total_amount
      });

      set({ loading: false });
      toast.success('Invoice created successfully');
      return invoice;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
      return null;
    }
  },

  deleteJob: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('customer_jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      set(state => ({
        jobs: state.jobs.filter(job => job.id !== jobId),
        loading: false
      }));

      toast.success('Job deleted successfully');
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
      return false;
    }
  },

  setCurrentJobId: (jobId) => set({ currentJobId: jobId }),
}));

export default useJobsStore;
