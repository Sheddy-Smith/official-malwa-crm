import { create } from 'zustand';
import { toast } from 'sonner';
import { dbOperations } from '@/lib/db';

const generateJobNo = () => `JOB-${Date.now()}`;
const generateInvoiceNo = () => `INV-${Date.now()}`;

const useJobsStore = create((set, get) => ({
  jobs: [],
  loading: false,
  error: null,
  currentJobId: null,

  fetchJobs: async () => {
    set({ loading: true, error: null });
    try {
      const jobs = await dbOperations.getAll('customer_jobs');
      const customers = await dbOperations.getAll('customers');

      const jobsWithCustomers = jobs.map(job => {
        const customer = customers.find(c => c.id === job.customer_id);
        return {
          ...job,
          customers: customer ? {
            id: customer.id,
            name: customer.name,
            company: customer.company,
            phone: customer.phone,
            gstin: customer.gstin
          } : null
        };
      });

      set({ jobs: jobsWithCustomers || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      console.error('Error fetching jobs:', error);
    }
  },

  fetchJobById: async (jobId) => {
    set({ loading: true, error: null });
    try {
      const job = await dbOperations.getById('customer_jobs', jobId);
      if (!job) {
        set({ loading: false });
        return null;
      }

      const customer = await dbOperations.getById('customers', job.customer_id);
      const jobWithCustomer = {
        ...job,
        customers: customer ? {
          id: customer.id,
          name: customer.name,
          company: customer.company,
          phone: customer.phone,
          gstin: customer.gstin
        } : null
      };

      set({ loading: false });
      return jobWithCustomer;
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
        job_no: generateJobNo(),
        customer_id: jobData.customerId,
        vehicle_no: jobData.vehicleNo,
        owner_name: jobData.ownerName,
        branch: jobData.branch || 'Head Office',
        status: 'inspection',
        job_date: jobData.inspectionDate || new Date().toISOString().split('T')[0],
        inspection_data: JSON.stringify({ items: [], details: {} }),
        estimate_data: JSON.stringify({ items: [], discount: 0, gst_rate: 18 }),
        jobsheet_data: JSON.stringify({ items: [], extraWork: [], finalized: false }),
        chalan_data: null,
        invoice_data: null,
        total_amount: 0
      };

      const data = await dbOperations.insert('customer_jobs', newJob);

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
      const data = await dbOperations.update('customer_jobs', jobId, updates);

      set(state => ({
        jobs: state.jobs.map(job => job.id === jobId ? { ...job, ...data } : job),
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
      inspection_data: JSON.stringify(inspectionData),
      status: 'inspection'
    });
  },

  updateEstimateData: async (jobId, estimateData) => {
    return get().updateJobDetails(jobId, {
      estimate_data: JSON.stringify(estimateData),
      status: 'estimate'
    });
  },

  updateJobSheetData: async (jobId, jobsheetData) => {
    return get().updateJobDetails(jobId, {
      jobsheet_data: JSON.stringify(jobsheetData),
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
          await dbOperations.insert('labour_ledger_entries', {
            labour_id: item.labourId,
            entry_date: new Date().toISOString().split('T')[0],
            particulars: `Job ${job.job_no} - ${item.item}`,
            ref_type: 'job',
            ref_id: jobId,
            debit: amount,
            credit: 0
          });
        }

        if (item.workBy === 'Vendor' && item.vendorId) {
          const amount = parseFloat(item.cost) * parseFloat(item.multiplier || 1);
          await dbOperations.insert('vendor_ledger_entries', {
            vendor_id: item.vendorId,
            entry_date: new Date().toISOString().split('T')[0],
            particulars: `Job ${job.job_no} - ${item.item}`,
            ref_type: 'job',
            ref_id: jobId,
            debit: amount,
            credit: 0
          });
        }

        if (item.inventoryItemId) {
          await dbOperations.insert('stock_movements', {
            item_id: item.inventoryItemId,
            movement_type: 'out',
            quantity: parseFloat(item.quantity || 1),
            reference_type: 'job',
            reference_id: jobId,
            notes: `Used in Job ${job.job_no}`,
            movement_date: new Date().toISOString().split('T')[0]
          });
        }
      }

      const updatedJobsheet = { ...jobsheetData, finalized: true };
      await get().updateJobDetails(jobId, {
        jobsheet_data: JSON.stringify(updatedJobsheet),
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
      chalan_data: JSON.stringify(chalanData),
      status: 'chalan'
    });
  },

  createInvoice: async (jobId, invoiceData) => {
    set({ loading: true, error: null });
    try {
      const job = await get().fetchJobById(jobId);
      if (!job) throw new Error('Job not found');

      const invoiceNo = generateInvoiceNo();

      const invoice = {
        invoice_no: invoiceNo,
        customer_id: job.customer_id,
        job_id: jobId,
        invoice_date: invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
        due_date: invoiceData.dueDate,
        subtotal: invoiceData.subtotal,
        gst_rate: invoiceData.gstRate,
        gst_amount: invoiceData.gstAmount,
        discount_amount: invoiceData.discountAmount || 0,
        total_amount: invoiceData.totalAmount,
        payment_status: 'pending',
        items: JSON.stringify(invoiceData.items),
        notes: invoiceData.notes
      };

      const invoiceRecord = await dbOperations.insert('invoices', invoice);

      await dbOperations.insert('customer_ledger_entries', {
        customer_id: job.customer_id,
        entry_date: invoice.invoice_date,
        particulars: `Invoice ${invoiceNo} - Job ${job.job_no}`,
        ref_type: 'invoice',
        ref_no: invoiceNo,
        ref_id: invoiceRecord.id,
        debit: invoice.total_amount,
        credit: 0
      });

      if (invoiceData.gstAmount > 0) {
        await dbOperations.insert('gst_ledger', {
          transaction_date: invoice.invoice_date,
          transaction_type: 'output',
          document_no: invoiceNo,
          party_name: job.customers?.name || job.owner_name,
          taxable_amount: invoice.subtotal,
          cgst: invoice.gst_amount / 2,
          sgst: invoice.gst_amount / 2,
          igst: 0,
          total_gst: invoice.gst_amount,
          input_credit: 0,
          output_tax: invoice.gst_amount
        });
      }

      await get().updateJobDetails(jobId, {
        invoice_data: JSON.stringify({ invoiceId: invoiceRecord.id, invoiceNo, ...invoiceData }),
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
      await dbOperations.delete('customer_jobs', jobId);

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
