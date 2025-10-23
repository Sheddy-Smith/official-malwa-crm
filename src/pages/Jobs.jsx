import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ClipboardList, FileSpreadsheet, Wrench, PackageCheck, ReceiptText, ArrowRight, ArrowLeft, Plus, Eye, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import InspectionStep from './jobs/InspectionStep';
import EstimateStep from './jobs/EstimateStep';
import JobSheetStep from './jobs/JobSheetStep';
import ChalanStep from './jobs/ChalanStep';
import InvoiceStep from './jobs/InvoiceStep';
import useJobsStore from '@/store/jobsStore';
import useCustomerStore from '@/store/customerStore';
import { motion } from 'framer-motion';

const steps = [
  { id: 'inspection', name: 'Vehicle Inspection', icon: ClipboardList, component: InspectionStep },
  { id: 'estimate', name: 'Estimate', icon: FileSpreadsheet, component: EstimateStep },
  { id: 'jobsheet', name: 'Job Sheet', icon: Wrench, component: JobSheetStep },
  { id: 'chalan', name: 'Challan', icon: PackageCheck, component: ChalanStep },
  { id: 'invoice', name: 'Invoice', icon: ReceiptText, component: InvoiceStep },
];

const statusColors = {
  inspection: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  estimate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  jobsheet: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  chalan: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newJobData, setNewJobData] = useState({
    customerId: '',
    vehicleNo: '',
    ownerName: '',
    branch: 'Head Office',
    inspectionDate: new Date().toISOString().split('T')[0]
  });

  const jobs = useJobsStore(state => state.jobs);
  const loading = useJobsStore(state => state.loading);
  const fetchJobs = useJobsStore(state => state.fetchJobs);
  const createNewJob = useJobsStore(state => state.createNewJob);
  const customers = useCustomerStore(state => state.customers);
  const fetchCustomers = useCustomerStore(state => state.fetchCustomers);

  const jobId = searchParams.get('jobId');
  const stepParam = searchParams.get('step');

  useEffect(() => {
    fetchJobs();
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (stepParam) {
      const stepIndex = steps.findIndex(s => s.id === stepParam);
      setCurrentStep(stepIndex >= 0 ? stepIndex : 0);
    }
  }, [stepParam]);

  const handleCreateJob = async () => {
    if (!newJobData.vehicleNo || !newJobData.ownerName) {
      alert('Please fill Vehicle Number and Owner Name');
      return;
    }

    const result = await createNewJob(newJobData);
    if (result) {
      setShowNewJobModal(false);
      setNewJobData({
        customerId: '',
        vehicleNo: '',
        ownerName: '',
        branch: 'Head Office',
        inspectionDate: new Date().toISOString().split('T')[0]
      });
      setSearchParams({ jobId: result.id, step: 'inspection' });
    }
  };

  const navigateToStep = (index) => {
    setSearchParams({ jobId, step: steps[index].id });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) navigateToStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) navigateToStep(currentStep - 1);
  };

  const handleBackToList = () => {
    setSearchParams({});
    fetchJobs();
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.vehicle_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job_no?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (jobId) {
    const ActiveComponent = steps[currentStep].component;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <Button onClick={handleBackToList} variant="secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs List
          </Button>
          <div className="text-sm text-gray-500 dark:text-dark-text-secondary">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        <Card className="p-6">
          <div className="border-b dark:border-gray-700 pb-6 mb-6">
            <nav aria-label="Progress">
              <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
                {steps.map((step, stepIdx) => (
                  <li key={step.name} className="md:flex-1">
                    <div onClick={() => navigateToStep(stepIdx)} className="group flex items-center cursor-pointer relative">
                      <div className="flex items-center">
                        <motion.div
                          animate={{ scale: stepIdx === currentStep ? 1.1 : 1 }}
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                            stepIdx <= currentStep
                              ? 'bg-brand-red text-white'
                              : 'border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card text-gray-500 dark:text-dark-text-secondary'
                          }`}
                        >
                          <step.icon className="h-6 w-6" />
                        </motion.div>
                        <div className="ml-4 text-left">
                          <div
                            className={`text-sm font-medium ${
                              stepIdx <= currentStep
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
                              stepIdx < currentStep ? 'bg-brand-red' : 'bg-transparent'
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
            <ActiveComponent jobId={jobId} />
          </div>

          <div className="flex justify-between border-t dark:border-gray-700 pt-4 mt-6">
            <Button onClick={handlePrev} disabled={currentStep === 0} variant="secondary">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Jobs</h2>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
              Manage vehicle inspection, estimates, and invoices
            </p>
          </div>
          <Button onClick={() => setShowNewJobModal(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create New Job
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Vehicle No, Owner Name, or Job No..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text"
            >
              <option value="all">All Status</option>
              <option value="inspection">Inspection</option>
              <option value="estimate">Estimate</option>
              <option value="jobsheet">Job Sheet</option>
              <option value="chalan">Challan</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-dark-text-secondary">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-2">
              {jobs.length === 0 ? 'No Jobs Yet' : 'No matching jobs found'}
            </h3>
            <p className="text-gray-500 dark:text-dark-text-secondary mb-6">
              {jobs.length === 0
                ? 'Create your first job to get started'
                : 'Try adjusting your search or filters'}
            </p>
            {jobs.length === 0 && (
              <Button onClick={() => setShowNewJobModal(true)}>
                <Plus className="h-5 w-5 mr-2" />
                Create First Job
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Job No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Vehicle No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Job Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text">{job.job_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">{job.customers?.name || job.owner_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">{job.vehicle_no}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-secondary">{new Date(job.job_date).toLocaleDateString('en-IN')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[job.status] || statusColors.inspection}`}>
                        {job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">
                      �{parseFloat(job.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button size="sm" onClick={() => setSearchParams({ jobId: job.id, step: job.status || 'inspection' })}>
                        <Eye className="h-4 w-4 mr-1" />
                        View/Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showNewJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-dark-card rounded-xl p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-4">Create New Job</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Customer (Optional)</label>
                <select value={newJobData.customerId} onChange={(e) => setNewJobData({ ...newJobData, customerId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text">
                  <option value="">Select Customer (Optional)</option>
                  {customers.map(customer => (<option key={customer.id} value={customer.id}>{customer.name} {customer.company && `- ${customer.company}`}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Vehicle Number *</label>
                <input type="text" value={newJobData.vehicleNo} onChange={(e) => setNewJobData({ ...newJobData, vehicleNo: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text" placeholder="e.g., PB08-AB-1234" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Owner Name *</label>
                <input type="text" value={newJobData.ownerName} onChange={(e) => setNewJobData({ ...newJobData, ownerName: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text" placeholder="Enter owner name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Branch</label>
                <input type="text" value={newJobData.branch} onChange={(e) => setNewJobData({ ...newJobData, branch: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Inspection Date</label>
                <input type="date" value={newJobData.inspectionDate} onChange={(e) => setNewJobData({ ...newJobData, inspectionDate: e.target.value })} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text" />
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleCreateJob} className="flex-1" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Job'}
                </Button>
                <Button onClick={() => setShowNewJobModal(false)} variant="secondary" className="flex-1">Cancel</Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Jobs;
