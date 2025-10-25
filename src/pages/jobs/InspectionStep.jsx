import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Download, Printer, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useJobsStore from '@/store/jobsStore';
import jsPDF from 'jspdf';

const categories = ['Parts', 'Labour', 'Hardware', 'Steel', 'Paint', 'Body Work', 'Electrical', 'Other'];

const InspectionStep = ({ jobId, onRefresh }) => {
  const [items, setItems] = useState([]);
  const [job, setJob] = useState(null);
  const [status, setStatus] = useState('in_progress');

  const fetchJobById = useJobsStore(state => state.fetchJobById);
  const updateInspectionData = useJobsStore(state => state.updateInspectionData);
  const updateJobStatus = useJobsStore(state => state.updateJobStatus);
  const loading = useJobsStore(state => state.loading);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    const jobData = await fetchJobById(jobId);
    if (jobData) {
      setJob(jobData);
      setItems(jobData.inspection_data?.items || []);
      setStatus(jobData.inspection_data?.status || 'in_progress');
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
    if (confirm('Delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleSave = async () => {
    if (items.length === 0) {
      alert('Please add at least one inspection item');
      return;
    }

    const hasInvalidItems = items.some(item => !item.item || !item.cost || item.cost <= 0);
    if (hasInvalidItems) {
      alert('Please fill all item details with valid cost');
      return;
    }

    await updateInspectionData(jobId, {
      items,
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : null
    });

    if (status === 'completed') {
      await updateJobStatus(jobId, 'estimate');
    }

    alert('Inspection saved successfully!');
    if (onRefresh) onRefresh();
  };

  const handleNext = async () => {
    if (items.length === 0) {
      alert('Please add at least one inspection item before proceeding');
      return;
    }

    const hasInvalidItems = items.some(item => !item.item || !item.cost || item.cost <= 0);
    if (hasInvalidItems) {
      alert('Please fill all item details before proceeding');
      return;
    }

    await updateInspectionData(jobId, {
      items,
      status: 'completed',
      completedAt: new Date().toISOString()
    });
    await updateJobStatus(jobId, 'estimate');
    alert('Inspection completed! Moving to Estimate...');
    if (onRefresh) onRefresh();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('VEHICLE INSPECTION REPORT', 105, 15, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Job No: ${job.job_no}`, 20, 30);
    doc.text(`Vehicle: ${job.vehicle_no}`, 20, 37);
    doc.text(`Owner: ${job.owner_name}`, 20, 44);
    doc.text(`Date: ${new Date(job.job_date).toLocaleDateString('en-IN')}`, 20, 51);

    doc.setFontSize(10);
    let yPos = 65;

    doc.text('Item', 20, yPos);
    doc.text('Category', 80, yPos);
    doc.text('Condition', 120, yPos);
    doc.text('Cost', 170, yPos);

    yPos += 7;
    items.forEach(item => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(item.item || '', 20, yPos);
      doc.text(item.category || '', 80, yPos);
      doc.text(item.condition || '', 120, yPos);
      doc.text(`₹${parseFloat(item.cost || 0).toFixed(2)}`, 170, yPos);
      yPos += 7;
    });

    doc.save(`Inspection-${job.job_no}.pdf`);
  };

  if (!job) return <div className="text-center py-12">Loading...</div>;

  const totalCost = items.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
  const isCompleted = status === 'completed';

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-2">Vehicle Inspection</h3>
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  In Progress
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
            <Button onClick={handleAddItem} disabled={isCompleted}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-12 gap-3 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="col-span-1 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">#{index + 1}</span>
              </div>
              <input
                type="text"
                placeholder="Item name *"
                value={item.item}
                onChange={(e) => handleItemChange(item.id, 'item', e.target.value)}
                disabled={isCompleted}
                className="col-span-3 px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-dark-text disabled:opacity-50"
              />
              <select
                value={item.category}
                onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                disabled={isCompleted}
                className="col-span-2 px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-dark-text disabled:opacity-50"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Condition *"
                value={item.condition}
                onChange={(e) => handleItemChange(item.id, 'condition', e.target.value)}
                disabled={isCompleted}
                className="col-span-2 px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-dark-text disabled:opacity-50"
              />
              <input
                type="number"
                placeholder="Cost *"
                value={item.cost}
                onChange={(e) => handleItemChange(item.id, 'cost', parseFloat(e.target.value) || 0)}
                disabled={isCompleted}
                className="col-span-2 px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-dark-text disabled:opacity-50"
              />
              <input
                type="text"
                placeholder="Notes"
                value={item.notes}
                onChange={(e) => handleItemChange(item.id, 'notes', e.target.value)}
                disabled={isCompleted}
                className="col-span-1 px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-dark-text disabled:opacity-50"
              />
              <div className="col-span-1 flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={isCompleted}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-dark-text-secondary">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p>No inspection items added yet. Click "Add Item" to start.</p>
          </div>
        )}

        {items.length > 0 && (
          <div className="border-t dark:border-gray-700 pt-4 mb-6">
            <div className="flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-dark-text-secondary mb-1">Total Inspection Cost</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-text">₹{totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center border-t dark:border-gray-700 pt-4">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={status === 'completed'}
                onChange={(e) => setStatus(e.target.checked ? 'completed' : 'in_progress')}
                disabled={isCompleted}
                className="w-4 h-4 text-brand-red rounded focus:ring-brand-red"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                Mark as Completed
              </span>
            </label>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={loading || isCompleted}>
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
            <Button onClick={handleNext} disabled={loading || isCompleted}>
              Next: Create Estimate
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InspectionStep;
