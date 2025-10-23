import { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useJobsStore from '@/store/jobsStore';

const categories = ['Parts', 'Labour', 'Hardware', 'Steel', 'Paint', 'Body Work', 'Electrical', 'Other'];

const InspectionStep = ({ jobId }) => {
  const [items, setItems] = useState([]);
  const [job, setJob] = useState(null);

  const fetchJobById = useJobsStore(state => state.fetchJobById);
  const updateInspectionData = useJobsStore(state => state.updateInspectionData);
  const loading = useJobsStore(state => state.loading);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    const jobData = await fetchJobById(jobId);
    if (jobData) {
      setJob(jobData);
      setItems(jobData.inspection_data?.items || []);
    }
  };

  const handleAddItem = () => {
    setItems([...items, {
      id: Date.now(),
      item: '',
      category: 'Parts',
      condition: '',
      cost: 0,
      notes: ''
    }]);
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSave = async () => {
    await updateInspectionData(jobId, { items });
    alert('Inspection saved!');
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text">Vehicle Inspection</h3>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border dark:border-gray-700 rounded-lg">
              <input
                type="text"
                placeholder="Item name"
                value={item.item}
                onChange={(e) => handleItemChange(item.id, 'item', e.target.value)}
                className="col-span-2 px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-dark-text"
              />
              <select
                value={item.category}
                onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                className="px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-dark-text"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Condition"
                value={item.condition}
                onChange={(e) => handleItemChange(item.id, 'condition', e.target.value)}
                className="px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-dark-text"
              />
              <input
                type="number"
                placeholder="Cost"
                value={item.cost}
                onChange={(e) => handleItemChange(item.id, 'cost', parseFloat(e.target.value) || 0)}
                className="px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-dark-text"
              />
              <Button variant="secondary" onClick={() => handleDeleteItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Inspection
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InspectionStep;
