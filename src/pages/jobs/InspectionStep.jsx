import { useState, useEffect } from 'react';
import { Plus, Edit2, Save, X, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useJobsStore from '@/store/jobsStore';
import { v4 as uuidv4 } from 'uuid';

const categories = ['Parts', 'Labour', 'Hardware', 'Steel', 'Paint', 'Other'];
const conditions = ['Good', 'Fair', 'Poor', 'Damaged', 'Missing'];
const multipliers = {
  Parts: 1.5,
  Labour: 2,
  Hardware: 2,
  Steel: 1.5,
  Paint: 1.8,
  Other: 1.5
};

const InspectionStep = ({ jobId }) => {
  const [job, setJob] = useState(null);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newItem, setNewItem] = useState(null);
  const [vehicleDetails, setVehicleDetails] = useState({
    vehicleNo: '',
    ownerName: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    branch: 'Head Office'
  });

  const fetchJobById = useJobsStore(state => state.fetchJobById);
  const updateInspectionData = useJobsStore(state => state.updateInspectionData);
  const updateJobDetails = useJobsStore(state => state.updateJobDetails);
  const loading = useJobsStore(state => state.loading);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    const jobData = await fetchJobById(jobId);
    if (jobData) {
      setJob(jobData);
      setVehicleDetails({
        vehicleNo: jobData.vehicle_no || '',
        ownerName: jobData.owner_name || '',
        inspectionDate: jobData.job_date || new Date().toISOString().split('T')[0],
        branch: jobData.branch || 'Head Office'
      });
      setItems(jobData.inspection_data?.items || []);
    }
  };

  const handleSaveDetails = async () => {
    const result = await updateJobDetails(jobId, {
      vehicle_no: vehicleDetails.vehicleNo,
      owner_name: vehicleDetails.ownerName,
      job_date: vehicleDetails.inspectionDate,
      branch: vehicleDetails.branch
    });

    if (result) {
      alert('Vehicle details saved successfully!');
    }
  };

  const handleAddItem = () => {
    const emptyItem = {
      id: uuidv4(),
      item: '',
      category: 'Parts',
      condition: 'Good',
      cost: 0,
      multiplier: multipliers['Parts'],
      total: 0,
      isNew: true
    };
    setNewItem(emptyItem);
    setItems([emptyItem, ...items]);
    setEditingId(emptyItem.id);
  };

  const handleEditItem = (item) => {
    setEditingId(item.id);
  };

  const handleSaveItem = async (item) => {
    if (!item.item || !item.category || !item.condition || item.cost <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedItem = {
      ...item,
      total: parseFloat(item.cost) * parseFloat(item.multiplier),
      isNew: false
    };

    const updatedItems = items.map(i => i.id === item.id ? updatedItem : i);
    setItems(updatedItems);

    await updateInspectionData(jobId, {
      items: updatedItems,
      details: vehicleDetails
    });

    setEditingId(null);
    setNewItem(null);
  };

  const handleCancelEdit = (item) => {
    if (item.isNew) {
      setItems(items.filter(i => i.id !== item.id));
      setNewItem(null);
    }
    setEditingId(null);
  };

  const handleDeleteItem = async (itemId) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(i => i.id !== itemId);
      setItems(updatedItems);

      await updateInspectionData(jobId, {
        items: updatedItems,
        details: vehicleDetails
      });
    }
  };

  const handleFieldChange = (itemId, field, value) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value };

        if (field === 'category') {
          updatedItem.multiplier = multipliers[value] || 1.5;
        }

        if (field === 'cost' || field === 'multiplier') {
          updatedItem.total = parseFloat(updatedItem.cost || 0) * parseFloat(updatedItem.multiplier || 1);
        }

        return updatedItem;
      }
      return item;
    }));
  };

  if (!job) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-dark-text-secondary">
        Loading job details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
          Vehicle Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
              Vehicle Number *
            </label>
            <input
              type="text"
              value={vehicleDetails.vehicleNo}
              onChange={(e) => setVehicleDetails({ ...vehicleDetails, vehicleNo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text"
              placeholder="e.g., PB08-AB-1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
              Owner Name *
            </label>
            <input
              type="text"
              value={vehicleDetails.ownerName}
              onChange={(e) => setVehicleDetails({ ...vehicleDetails, ownerName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text"
              placeholder="Enter owner name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
              Inspection Date *
            </label>
            <input
              type="date"
              value={vehicleDetails.inspectionDate}
              onChange={(e) => setVehicleDetails({ ...vehicleDetails, inspectionDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">
              Branch *
            </label>
            <input
              type="text"
              value={vehicleDetails.branch}
              onChange={(e) => setVehicleDetails({ ...vehicleDetails, branch: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text"
            />
          </div>
        </div>

        <div className="mt-4">
          <Button onClick={handleSaveDetails} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            Save Vehicle Details
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Inspection Items
          </h3>
          <Button onClick={handleAddItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-dark-text-secondary">
            No inspection items added yet. Click "Add Item" to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Item *
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Category *
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Condition *
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Cost (₹) *
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Multiplier *
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Total (₹)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3">
                      {editingId === item.id ? (
                        <input
                          type="text"
                          value={item.item}
                          onChange={(e) => handleFieldChange(item.id, 'item', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text"
                          placeholder="e.g., Front Bumper"
                          list="item-suggestions"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-dark-text">{item.item}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === item.id ? (
                        <select
                          value={item.category}
                          onChange={(e) => handleFieldChange(item.id, 'category', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-dark-text">{item.category}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === item.id ? (
                        <select
                          value={item.condition}
                          onChange={(e) => handleFieldChange(item.id, 'condition', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text"
                        >
                          {conditions.map(cond => (
                            <option key={cond} value={cond}>{cond}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-dark-text">{item.condition}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          value={item.cost}
                          onChange={(e) => handleFieldChange(item.id, 'cost', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text"
                          min="0"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-dark-text">
                          ₹{parseFloat(item.cost).toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          value={item.multiplier}
                          onChange={(e) => handleFieldChange(item.id, 'multiplier', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text"
                          min="1"
                          step="0.1"
                        />
                      ) : (
                        <span className="text-sm text-gray-900 dark:text-dark-text">{item.multiplier}x</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-dark-text">
                        ₹{parseFloat(item.total || 0).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {editingId === item.id ? (
                          <>
                            <button
                              onClick={() => handleSaveItem(item)}
                              className="text-green-600 hover:text-green-800 dark:text-green-400"
                              title="Save"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCancelEdit(item)}
                              className="text-gray-600 hover:text-gray-800 dark:text-gray-400"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-dark-text">
                    Total:
                  </td>
                  <td className="px-4 py-3 font-bold text-brand-red">
                    ₹{items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toLocaleString('en-IN')}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <datalist id="item-suggestions">
          <option value="Front Bumper" />
          <option value="Rear Bumper" />
          <option value="Hood" />
          <option value="Door Panel" />
          <option value="Fender" />
          <option value="Headlight" />
          <option value="Taillight" />
          <option value="Mirror" />
          <option value="Windshield" />
          <option value="Tire" />
        </datalist>
      </Card>
    </div>
  );
};

export default InspectionStep;
