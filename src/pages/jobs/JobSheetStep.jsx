import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useJobsStore from '@/store/jobsStore';
import useLabourStore from '@/store/labourStore';

const JobSheetStep = ({ jobId }) => {
  const [job, setJob] = useState(null);
  const [items, setItems] = useState([]);

  const fetchJobById = useJobsStore(state => state.fetchJobById);
  const updateJobSheetData = useJobsStore(state => state.updateJobSheetData);
  const labourList = useLabourStore(state => state.labour);
  const fetchLabour = useLabourStore(state => state.fetchLabour);
  const loading = useJobsStore(state => state.loading);

  useEffect(() => {
    loadJob();
    fetchLabour();
  }, [jobId]);

  const loadJob = async () => {
    const jobData = await fetchJobById(jobId);
    if (jobData) {
      setJob(jobData);
      const inspectionItems = jobData.inspection_data?.items || [];
      setItems(inspectionItems.map(item => ({
        ...item,
        assignedTo: item.assignedTo || '',
        status: item.status || 'pending'
      })));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async () => {
    await updateJobSheetData(jobId, { items });
    alert('Job sheet saved!');
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-6">Job Sheet</h3>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border dark:border-gray-700 rounded-lg">
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Item</p>
                <p className="text-sm text-gray-900 dark:text-dark-text">{item.item}</p>
                <p className="text-xs text-gray-500 dark:text-dark-text-secondary">{item.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Cost</p>
                <p className="text-sm text-gray-900 dark:text-dark-text">₹{parseFloat(item.cost || 0).toFixed(2)}</p>
              </div>
              <select
                value={item.assignedTo}
                onChange={(e) => handleItemChange(item.id, 'assignedTo', e.target.value)}
                className="px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-dark-text"
              >
                <option value="">Assign to...</option>
                {labourList.map(labour => (
                  <option key={labour.id} value={labour.id}>{labour.name}</option>
                ))}
              </select>
              <select
                value={item.status}
                onChange={(e) => handleItemChange(item.id, 'status', e.target.value)}
                className="px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-dark-text"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Job Sheet
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default JobSheetStep;
