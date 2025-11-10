import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { PlusCircle, Trash2, Edit, Save, X, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import useJobsStore from '@/store/jobsStore';
import useCustomerStore from '@/store/customerStore';

const InspectionStep = () => {
  const navigate = useNavigate();
  const { jobs, fetchJobs, createNewJob, updateInspectionData, setCurrentJobId } = useJobsStore();
  const { customers, fetchCustomers } = useCustomerStore();

  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [inspectionItems, setInspectionItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [newJobForm, setNewJobForm] = useState({
    customerId: '',
    vehicleNo: '',
    ownerName: '',
    branch: 'Head Office',
    inspectionDate: new Date().toISOString().split('T')[0]
  });

  const [newItem, setNewItem] = useState({
    category: '',
    item: '',
    description: '',
    remarks: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedJobId) {
      loadInspectionData(selectedJobId);
    }
  }, [selectedJobId]);

  const loadInspectionData = async (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.inspection_data) {
      try {
        const data = typeof job.inspection_data === 'string'
          ? JSON.parse(job.inspection_data)
          : job.inspection_data;
        setInspectionItems(data.items || []);
      } catch (e) {
        setInspectionItems([]);
      }
    }
  };

  const handleCreateJob = async () => {
    if (!newJobForm.customerId || !newJobForm.vehicleNo) {
      toast.error('Please fill all required fields');
      return;
    }

    const customer = customers.find(c => c.id === newJobForm.customerId);
    const jobData = {
      ...newJobForm,
      ownerName: customer?.name || newJobForm.ownerName
    };

    const newJob = await createNewJob(jobData);
    if (newJob) {
      setSelectedJobId(newJob.id);
      setCurrentJobId(newJob.id);
      setShowNewJobModal(false);
      setNewJobForm({
        customerId: '',
        vehicleNo: '',
        ownerName: '',
        branch: 'Head Office',
        inspectionDate: new Date().toISOString().split('T')[0]
      });
      toast.success('Job created! Add inspection items below.');
    }
  };

  const handleAddItem = () => {
    if (!newItem.item) {
      toast.error('Please enter item name');
      return;
    }

    if (editingIndex !== null) {
      const updated = [...inspectionItems];
      updated[editingIndex] = newItem;
      setInspectionItems(updated);
      setEditingIndex(null);
      toast.success('Item updated');
    } else {
      setInspectionItems([...inspectionItems, newItem]);
      toast.success('Item added');
    }

    setNewItem({
      category: '',
      item: '',
      description: '',
      remarks: ''
    });
  };

  const handleEditItem = (index) => {
    setNewItem(inspectionItems[index]);
    setEditingIndex(index);
  };

  const handleDeleteItem = (index) => {
    setInspectionItems(inspectionItems.filter((_, i) => i !== index));
    toast.success('Item removed');
  };

  const handleSaveInspection = async () => {
    if (!selectedJobId) {
      toast.error('No job selected');
      return;
    }

    if (inspectionItems.length === 0) {
      toast.error('Please add at least one inspection item');
      return;
    }

    const inspectionData = {
      items: inspectionItems,
      completedAt: new Date().toISOString()
    };

    const result = await updateInspectionData(selectedJobId, inspectionData);
    if (result) {
      toast.success('Inspection saved successfully!');
    }
  };

  const handleProceedToEstimate = () => {
    if (!selectedJobId) {
      toast.error('No job selected');
      return;
    }

    if (inspectionItems.length === 0) {
      toast.error('Please add and save inspection items first');
      return;
    }

    setCurrentJobId(selectedJobId);
    navigate('/jobs?step=estimate');
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Inspection Step</h2>
          <p className="text-gray-600 dark:text-dark-text-secondary">Create job and inspect vehicle</p>
        </div>
        <Button onClick={() => setShowNewJobModal(true)} icon={PlusCircle}>
          New Job
        </Button>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-dark-text">Select Job</h3>
        <div className="grid grid-cols-1 gap-3">
          {jobs.filter(j => ['inspection', 'estimate'].includes(j.status)).map(job => (
            <div
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedJobId === job.id
                  ? 'border-brand-red bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-brand-red'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-dark-text">{job.job_no}</p>
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                    {job.owner_name} - {job.vehicle_no}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">
                    {new Date(job.job_date).toLocaleDateString()}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded">
                  {job.status}
                </span>
              </div>
            </div>
          ))}

          {jobs.filter(j => ['inspection', 'estimate'].includes(j.status)).length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-dark-text-secondary">
              No jobs in inspection. Click "New Job" to start.
            </div>
          )}
        </div>
      </Card>

      {selectedJob && (
        <>
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Inspection Items</h3>
              <div className="flex gap-2">
                <Button onClick={handleSaveInspection} icon={Save} variant="secondary">
                  Save
                </Button>
                <Button onClick={handleProceedToEstimate} icon={ArrowRight}>
                  Proceed to Estimate
                </Button>
              </div>
            </div>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-dark-text-secondary">Job No:</span>
                  <p className="font-semibold text-gray-900 dark:text-dark-text">{selectedJob.job_no}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-dark-text-secondary">Owner:</span>
                  <p className="font-semibold text-gray-900 dark:text-dark-text">{selectedJob.owner_name}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-dark-text-secondary">Vehicle:</span>
                  <p className="font-semibold text-gray-900 dark:text-dark-text">{selectedJob.vehicle_no}</p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-dark-text-secondary">Date:</span>
                  <p className="font-semibold text-gray-900 dark:text-dark-text">
                    {new Date(selectedJob.job_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-text">Category</label>
                <input
                  type="text"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                  placeholder="e.g., Body Work, Paint, Engine"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-text">Item *</label>
                <input
                  type="text"
                  value={newItem.item}
                  onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                  placeholder="Item name"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-text">Description</label>
                <input
                  type="text"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                  placeholder="Item description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-text">Remarks</label>
                <textarea
                  value={newItem.remarks}
                  onChange={(e) => setNewItem({ ...newItem, remarks: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
                  placeholder="Additional remarks"
                  rows={2}
                />
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <Button onClick={handleAddItem} icon={editingIndex !== null ? Save : PlusCircle}>
                {editingIndex !== null ? 'Update Item' : 'Add Item'}
              </Button>
              {editingIndex !== null && (
                <Button
                  onClick={() => {
                    setEditingIndex(null);
                    setNewItem({ category: '', item: '', description: '', remarks: '' });
                  }}
                  variant="outline"
                  icon={X}
                >
                  Cancel
                </Button>
              )}
            </div>

            {inspectionItems.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left p-2 text-gray-900 dark:text-dark-text">Category</th>
                      <th className="text-left p-2 text-gray-900 dark:text-dark-text">Item</th>
                      <th className="text-left p-2 text-gray-900 dark:text-dark-text">Description</th>
                      <th className="text-left p-2 text-gray-900 dark:text-dark-text">Remarks</th>
                      <th className="text-right p-2 text-gray-900 dark:text-dark-text">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionItems.map((item, index) => (
                      <tr key={index} className="border-b dark:border-gray-700">
                        <td className="p-2 text-gray-900 dark:text-dark-text">{item.category}</td>
                        <td className="p-2 text-gray-900 dark:text-dark-text">{item.item}</td>
                        <td className="p-2 text-gray-600 dark:text-dark-text-secondary">{item.description}</td>
                        <td className="p-2 text-gray-600 dark:text-dark-text-secondary">{item.remarks}</td>
                        <td className="p-2">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditItem(index)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(index)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      <Modal
        isOpen={showNewJobModal}
        onClose={() => setShowNewJobModal(false)}
        title="Create New Job"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-text">Customer *</label>
            <select
              value={newJobForm.customerId}
              onChange={(e) => setNewJobForm({ ...newJobForm, customerId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
              required
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.company ? `- ${customer.company}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-text">Vehicle No *</label>
            <input
              type="text"
              value={newJobForm.vehicleNo}
              onChange={(e) => setNewJobForm({ ...newJobForm, vehicleNo: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
              placeholder="e.g., MH-12-AB-1234"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-text">Branch</label>
            <input
              type="text"
              value={newJobForm.branch}
              onChange={(e) => setNewJobForm({ ...newJobForm, branch: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-dark-text">Inspection Date</label>
            <input
              type="date"
              value={newJobForm.inspectionDate}
              onChange={(e) => setNewJobForm({ ...newJobForm, inspectionDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg dark:bg-dark-card dark:border-gray-600 dark:text-dark-text"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={() => setShowNewJobModal(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleCreateJob}>
              Create Job
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InspectionStep;
