import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { ClipboardList, FileSpreadsheet, Wrench, PackageCheck, ReceiptText, ArrowRight, ArrowLeft, PlusCircle, Search, CreditCard as Edit, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import InspectionStep from './jobs/InspectionStep';
import EstimateStep from './jobs/EstimateStep';
import JobSheetStep from './jobs/JobSheetStep';
import ChalanStep from './jobs/ChalanStep';
import InvoiceStep from './jobs/InvoiceStep';
import { motion } from 'framer-motion';

const steps = [
  { id: 'inspection', name: 'Vehicle Inspection', icon: ClipboardList, component: InspectionStep },
  { id: 'estimate', name: 'Estimate', icon: FileSpreadsheet, component: EstimateStep },
  { id: 'jobsheet', name: 'Job Sheet', icon: Wrench, component: JobSheetStep },
  { id: 'chalan', name: 'Chalan', icon: PackageCheck, component: ChalanStep },
  { id: 'invoice', name: 'Invoice', icon: ReceiptText, component: InvoiceStep },
];

const NewJobModal = ({ isOpen, onClose, onSave, customers }) => {
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_no: '',
    job_date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customer_id || !formData.vehicle_no) {
      toast.error('Please fill all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Job">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
            Customer *
          </label>
          <select
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-dark-card dark:border-gray-600 dark:text-dark-text focus:ring-2 focus:ring-brand-red"
            required
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name} {customer.company ? `(${customer.company})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
            Vehicle Number *
          </label>
          <input
            type="text"
            value={formData.vehicle_no}
            onChange={(e) => setFormData({ ...formData, vehicle_no: e.target.value })}
            placeholder="e.g., PB08AB1234"
            className="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-dark-card dark:border-gray-600 dark:text-dark-text focus:ring-2 focus:ring-brand-red"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
            Job Date *
          </label>
          <input
            type="date"
            value={formData.job_date}
            onChange={(e) => setFormData({ ...formData, job_date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white dark:bg-dark-card dark:border-gray-600 dark:text-dark-text focus:ring-2 focus:ring-brand-red"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Job</Button>
        </div>
      </form>
    </Modal>
  );
};

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const jobId = searchParams.get('jobId');
  const stepParam = searchParams.get('step');

  const currentStepIndex = stepParam ? steps.findIndex((s) => s.id === stepParam) : -1;
  const isStepperView = jobId && currentStepIndex >= 0;

  useEffect(() => {
    fetchCustomers();
    fetchJobs();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name, company')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_jobs')
        .select(`
          *,
          customer:customers(id, name, company)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (formData) => {
    try {
      const jobNo = `JOB-${Date.now().toString().slice(-6)}`;

      const { data, error } = await supabase
        .from('customer_jobs')
        .insert([
          {
            job_no: jobNo,
            customer_id: formData.customer_id,
            vehicle_no: formData.vehicle_no,
            job_date: formData.job_date,
            status: 'inspection',
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Job created successfully!');
      setIsNewJobModalOpen(false);
      fetchJobs();

      navigate(`/jobs?jobId=${data.id}&step=inspection`);
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    }
  };

  const handleDeleteJob = async () => {
    try {
      const { error } = await supabase
        .from('customer_jobs')
        .delete()
        .eq('id', jobToDelete.id);

      if (error) throw error;

      toast.success('Job deleted successfully');
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const navigateToStep = (index) => {
    setSearchParams({ jobId, step: steps[index].id });
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) navigateToStep(currentStepIndex + 1);
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) navigateToStep(currentStepIndex - 1);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      inspection: { label: 'Inspection', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      estimate: { label: 'Estimate', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
      jobsheet: { label: 'Job Sheet', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      chalan: { label: 'Challan', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
      invoice: { label: 'Invoice', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
    };

    const config = statusConfig[status] || statusConfig.inspection;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.job_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.vehicle_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isStepperView) {
    const ActiveComponent = steps[currentStepIndex].component;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl shadow-card dark:shadow-dark-card border border-gray-100 dark:border-gray-700 space-y-6"
      >
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={() => navigate('/jobs')}>
            ← Back to All Jobs
          </Button>
          <div className="text-sm text-gray-600 dark:text-dark-text-secondary">
            Job: <span className="font-semibold">{jobs.find((j) => j.id === jobId)?.job_no}</span>
          </div>
        </div>

        <div className="border-b dark:border-gray-700 pb-6">
          <nav aria-label="Progress">
            <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
              {steps.map((step, stepIdx) => (
                <li key={step.name} className="md:flex-1">
                  <div
                    onClick={() => navigateToStep(stepIdx)}
                    className="group flex items-center cursor-pointer relative"
                  >
                    <div className="flex items-center">
                      <motion.div
                        animate={{ scale: stepIdx === currentStepIndex ? 1.1 : 1 }}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                          stepIdx <= currentStepIndex
                            ? 'bg-brand-red text-white'
                            : 'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-500 dark:text-dark-text-secondary'
                        }`}
                      >
                        <step.icon className="h-6 w-6" />
                      </motion.div>
                      <div className="ml-4 text-left">
                        <div
                          className={`text-sm font-medium ${
                            stepIdx <= currentStepIndex
                              ? 'text-brand-dark dark:text-dark-text'
                              : 'text-gray-500 dark:text-dark-text-secondary'
                          }`}
                        >
                          {step.name}
                        </div>
                      </div>
                    </div>
                    {stepIdx < steps.length - 1 && (
                      <div className="hidden md:block absolute top-5 left-14 w-[calc(100%-3.5rem)] h-0.5 bg-gray-200 dark:bg-gray-700">
                        <div
                          className={`h-full transition-colors duration-200 ${
                            stepIdx < currentStepIndex ? 'bg-brand-red' : 'bg-transparent'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="min-h-[400px]">
          <ActiveComponent jobId={jobId} onUpdate={fetchJobs} />
        </div>

        <div className="flex justify-between border-t dark:border-gray-700 pt-4">
          <Button onClick={handlePrev} disabled={currentStepIndex === 0} variant="secondary">
            <ArrowLeft className="h-5 w-5 mr-2" /> Previous
          </Button>
          <Button onClick={handleNext} disabled={currentStepIndex === steps.length - 1}>
            Next <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red"></div>
          <span className="ml-3 text-gray-600 dark:text-dark-text-secondary">Loading jobs...</span>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <NewJobModal
        isOpen={isNewJobModalOpen}
        onClose={() => setIsNewJobModalOpen(false)}
        onSave={handleCreateJob}
        customers={customers}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteJob}
        title="Delete Job"
        message={`Are you sure you want to delete job "${jobToDelete?.job_no}"? This action cannot be undone.`}
      />

      <Card>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">All Jobs</h3>
            <p className="text-sm text-gray-600 dark:text-dark-text-secondary mt-1">
              Manage vehicle repair and fabrication jobs
            </p>
          </div>
          <Button onClick={() => setIsNewJobModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Job
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job no, vehicle no, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white dark:bg-dark-card dark:border-gray-600 dark:text-dark-text focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg bg-white dark:bg-dark-card dark:border-gray-600 dark:text-dark-text focus:ring-2 focus:ring-brand-red"
          >
            <option value="">All Status</option>
            <option value="inspection">Inspection</option>
            <option value="estimate">Estimate</option>
            <option value="jobsheet">Job Sheet</option>
            <option value="chalan">Challan</option>
            <option value="invoice">Invoice</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-left">
              <tr>
                <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Job No</th>
                <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Customer</th>
                <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Vehicle No</th>
                <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Job Date</th>
                <th className="p-3 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="p-3 font-semibold text-gray-700 dark:text-gray-300 text-right">Amount</th>
                <th className="p-3 font-semibold text-gray-700 dark:text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-3 font-medium text-gray-900 dark:text-dark-text">{job.job_no}</td>
                    <td className="p-3 text-gray-700 dark:text-dark-text-secondary">
                      <div>
                        <div className="font-medium">{job.customer?.name}</div>
                        {job.customer?.company && (
                          <div className="text-xs text-gray-500">{job.customer.company}</div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-gray-700 dark:text-dark-text-secondary">{job.vehicle_no}</td>
                    <td className="p-3 text-gray-700 dark:text-dark-text-secondary">
                      {new Date(job.job_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-3">{getStatusBadge(job.status)}</td>
                    <td className="p-3 text-right font-medium text-gray-900 dark:text-dark-text">
                      {job.total_amount
                        ? `₹${parseFloat(job.total_amount).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                          })}`
                        : '-'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end items-center space-x-2">
                        <Button
                          variant="ghost"
                          className="p-2 h-auto"
                          onClick={() => navigate(`/jobs?jobId=${job.id}&step=${job.status || 'inspection'}`)}
                        >
                          <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          className="p-2 h-auto"
                          onClick={() => {
                            setJobToDelete(job);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-12">
                    <div className="flex flex-col items-center text-gray-500 dark:text-dark-text-secondary">
                      <Wrench className="h-12 w-12 mb-3 text-gray-400" />
                      <p className="text-lg font-medium">No jobs found</p>
                      <p className="text-sm mt-1">
                        {searchTerm || statusFilter
                          ? 'Try adjusting your filters'
                          : 'Create your first job to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredJobs.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 dark:text-dark-text-secondary">
            Showing {filteredJobs.length} of {jobs.length} job(s)
          </div>
        )}
      </Card>
    </div>
  );
};

export default Jobs;
