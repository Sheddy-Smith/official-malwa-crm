import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useJobsStore from '@/store/jobsStore';
import useLabourStore from '@/store/labourStore';
import useVendorStore from '@/store/vendorStore';
import { v4 as uuidv4 } from 'uuid';

const categories = ['Parts', 'Labour', 'Hardware', 'Steel', 'Paint', 'Other'];
const conditions = ['Good', 'Fair', 'Poor', 'Damaged', 'Missing'];

const JobSheetStep = ({ jobId }) => {
  const [job, setJob] = useState(null);
  const [inspectionItems, setInspectionItems] = useState([]);
  const [extraWork, setExtraWork] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobById = useJobsStore(state => state.fetchJobById);
  const updateJobSheetData = useJobsStore(state => state.updateJobSheetData);
  const finalizeJobSheet = useJobsStore(state => state.finalizeJobSheet);

  const labourList = useLabourStore(state => state.labour);
  const fetchLabour = useLabourStore(state => state.fetchLabour);
  const vendors = useVendorStore(state => state.vendors);
  const fetchVendors = useVendorStore(state => state.fetchVendors);

  useEffect(() => {
    loadJob();
    fetchLabour();
    fetchVendors();
  }, [jobId]);

  const loadJob = async () => {
    const jobData = await fetchJobById(jobId);
    if (jobData) {
      setJob(jobData);

      const items = (jobData.inspection_data?.items || []).map(item => ({
        ...item,
        workBy: '',
        labourId: '',
        vendorId: '',
        notes: '',
        assignedId: item.assignedId || null
      }));

      setInspectionItems(jobData.jobsheet_data?.items || items);
      setExtraWork(jobData.jobsheet_data?.extraWork || []);
    }
  };

  const handleInspectionItemChange = (itemId, field, value) => {
    setInspectionItems(items => items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        if (field === 'workBy') {
          updated.labourId = '';
          updated.vendorId = '';
          updated.assignedId = null;
        }
        if (field === 'labourId' && value) {
          updated.assignedId = value;
        }
        if (field === 'vendorId' && value) {
          updated.assignedId = value;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleAddExtraWork = () => {
    const newWork = {
      id: uuidv4(),
      item: '',
      category: 'Labour',
      condition: 'Good',
      cost: 0,
      multiplier: 1,
      workBy: '',
      labourId: '',
      vendorId: '',
      notes: '',
      isNew: true
    };
    setExtraWork([...extraWork, newWork]);
  };

  const handleExtraWorkChange = (workId, field, value) => {
    setExtraWork(works => works.map(work => {
      if (work.id === workId) {
        const updated = { ...work, [field]: value };
        if (field === 'workBy') {
          updated.labourId = '';
          updated.vendorId = '';
          updated.assignedId = null;
        }
        if (field === 'labourId' && value) {
          updated.assignedId = value;
        }
        if (field === 'vendorId' && value) {
          updated.assignedId = value;
        }
        return updated;
      }
      return work;
    }));
  };

  const handleDeleteExtraWork = (workId) => {
    if (confirm('Are you sure you want to delete this extra work item?')) {
      setExtraWork(extraWork.filter(w => w.id !== workId));
    }
  };

  const handleSaveJobSheet = async () => {
    setLoading(true);
    const jobsheetData = {
      items: inspectionItems,
      extraWork: extraWork.filter(w => w.item && w.cost > 0),
      finalized: false
    };

    await updateJobSheetData(jobId, jobsheetData);
    setLoading(false);
    alert('Job sheet saved successfully!');
  };

  const handleFinalizeJobSheet = async () => {
    if (!confirm('Are you sure you want to finalize this job sheet? This will post to ledgers and cannot be undone.')) {
      return;
    }

    setLoading(true);
    const jobsheetData = {
      items: inspectionItems,
      extraWork: extraWork.filter(w => w.item && w.cost > 0),
      finalized: true
    };

    const success = await finalizeJobSheet(jobId, jobsheetData);
    setLoading(false);

    if (success) {
      alert('Job sheet finalized! Ledger entries have been created.');
      loadJob();
    } else {
      alert('Error finalizing job sheet. Please try again.');
    }
  };

  const calculateSubtotal = (items) => {
    return items.reduce((sum, item) => {
      return sum + (parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1));
    }, 0);
  };

  const inspectionSubtotal = calculateSubtotal(inspectionItems);
  const extraWorkSubtotal = calculateSubtotal(extraWork);
  const estimateDiscount = parseFloat(job?.estimate_data?.discount || 0);
  const grandTotal = inspectionSubtotal + extraWorkSubtotal;
  const finalTotal = grandTotal - estimateDiscount;

  const isFinalized = job?.jobsheet_data?.finalized || false;

  if (!job) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-dark-text-secondary">
        Loading job sheet...
      </div>
    );
  }

  if (inspectionItems.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-2">
          No Items Available
        </h3>
        <p className="text-gray-500 dark:text-dark-text-secondary">
          Please complete the Inspection and Estimate steps first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isFinalized && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-300 font-medium">
            ✓ This job sheet has been finalized. Ledger entries have been posted.
          </p>
        </div>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
          Tasks from Inspection
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                  Item
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                  Condition
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                  Cost (₹)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                  Multiplier
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                  Total (₹)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                  Work By
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                  Assign To
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
              {inspectionItems.map((item) => {
                const itemTotal = parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                      {item.item}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                      {item.condition}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                      ₹{parseFloat(item.cost).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                      {item.multiplier}x
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-dark-text">
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={item.workBy || ''}
                        onChange={(e) => handleInspectionItemChange(item.id, 'workBy', e.target.value)}
                        disabled={isFinalized}
                        className="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                      >
                        <option value="">Select</option>
                        <option value="Labour">Labour</option>
                        <option value="Vendor">Vendor</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      {item.workBy === 'Labour' ? (
                        <select
                          value={item.labourId || ''}
                          onChange={(e) => handleInspectionItemChange(item.id, 'labourId', e.target.value)}
                          disabled={isFinalized}
                          className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                        >
                          <option value="">Select Labour</option>
                          {labourList.map(labour => (
                            <option key={labour.id} value={labour.id}>{labour.name}</option>
                          ))}
                        </select>
                      ) : item.workBy === 'Vendor' ? (
                        <select
                          value={item.vendorId || ''}
                          onChange={(e) => handleInspectionItemChange(item.id, 'vendorId', e.target.value)}
                          disabled={isFinalized}
                          className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                        >
                          <option value="">Select Vendor</option>
                          {vendors.map(vendor => (
                            <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={(e) => handleInspectionItemChange(item.id, 'notes', e.target.value)}
                        disabled={isFinalized}
                        className="w-40 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                        placeholder="Add notes..."
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <td colSpan="5" className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-dark-text">
                  Subtotal (Inspection):
                </td>
                <td className="px-4 py-3 font-bold text-brand-red" colSpan="4">
                  ₹{inspectionSubtotal.toLocaleString('en-IN')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Extra Work
          </h3>
          {!isFinalized && (
            <Button onClick={handleAddExtraWork} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Extra Work
            </Button>
          )}
        </div>

        {extraWork.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-dark-text-secondary">
            No extra work added yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Item
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Condition
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Cost (₹)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Multiplier
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Total (₹)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Work By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Assign To
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                    Notes
                  </th>
                  {!isFinalized && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                {extraWork.map((work) => {
                  const workTotal = parseFloat(work.cost || 0) * parseFloat(work.multiplier || 1);
                  return (
                    <tr key={work.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3">
                        <select
                          value={work.category || ''}
                          onChange={(e) => handleExtraWorkChange(work.id, 'category', e.target.value)}
                          disabled={isFinalized}
                          className="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                        >
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={work.item || ''}
                          onChange={(e) => handleExtraWorkChange(work.id, 'item', e.target.value)}
                          disabled={isFinalized}
                          className="w-40 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                          placeholder="Item name"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={work.condition || ''}
                          onChange={(e) => handleExtraWorkChange(work.id, 'condition', e.target.value)}
                          disabled={isFinalized}
                          className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                        >
                          {conditions.map(cond => (
                            <option key={cond} value={cond}>{cond}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={work.cost || ''}
                          onChange={(e) => handleExtraWorkChange(work.id, 'cost', e.target.value)}
                          disabled={isFinalized}
                          className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={work.multiplier || ''}
                          onChange={(e) => handleExtraWorkChange(work.id, 'multiplier', e.target.value)}
                          disabled={isFinalized}
                          className="w-16 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                          min="1"
                          step="0.1"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-dark-text">
                        ₹{workTotal.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={work.workBy || ''}
                          onChange={(e) => handleExtraWorkChange(work.id, 'workBy', e.target.value)}
                          disabled={isFinalized}
                          className="w-28 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                        >
                          <option value="">Select</option>
                          <option value="Labour">Labour</option>
                          <option value="Vendor">Vendor</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        {work.workBy === 'Labour' ? (
                          <select
                            value={work.labourId || ''}
                            onChange={(e) => handleExtraWorkChange(work.id, 'labourId', e.target.value)}
                            disabled={isFinalized}
                            className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                          >
                            <option value="">Select Labour</option>
                            {labourList.map(labour => (
                              <option key={labour.id} value={labour.id}>{labour.name}</option>
                            ))}
                          </select>
                        ) : work.workBy === 'Vendor' ? (
                          <select
                            value={work.vendorId || ''}
                            onChange={(e) => handleExtraWorkChange(work.id, 'vendorId', e.target.value)}
                            disabled={isFinalized}
                            className="w-32 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                          >
                            <option value="">Select Vendor</option>
                            {vendors.map(vendor => (
                              <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={work.notes || ''}
                          onChange={(e) => handleExtraWorkChange(work.id, 'notes', e.target.value)}
                          disabled={isFinalized}
                          className="w-40 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:ring-2 focus:ring-brand-red dark:bg-gray-800 dark:text-dark-text disabled:opacity-50"
                          placeholder="Add notes..."
                        />
                      </td>
                      {!isFinalized && (
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteExtraWork(work.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-dark-text">
                    Subtotal (Extra Work):
                  </td>
                  <td className="px-4 py-3 font-bold text-brand-red" colSpan={isFinalized ? 4 : 5}>
                    ₹{extraWorkSubtotal.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text mb-4">
          Summary
        </h3>
        <div className="max-w-md ml-auto space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-dark-text-secondary">Subtotal (Inspection):</span>
            <span className="font-medium text-gray-900 dark:text-dark-text">
              ₹{inspectionSubtotal.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-dark-text-secondary">Subtotal (Extra Work):</span>
            <span className="font-medium text-gray-900 dark:text-dark-text">
              ₹{extraWorkSubtotal.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-dark-text-secondary">Grand Total:</span>
            <span className="font-medium text-gray-900 dark:text-dark-text">
              ₹{grandTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
            <span>Estimate Discount:</span>
            <span>- ₹{estimateDiscount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t dark:border-gray-700 pt-3">
            <span className="text-gray-900 dark:text-dark-text">Final Total:</span>
            <span className="text-brand-red">
              ₹{finalTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {!isFinalized && (
            <>
              <Button onClick={handleSaveJobSheet} variant="secondary" disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Job Sheet
              </Button>
              <Button onClick={handleFinalizeJobSheet} disabled={loading}>
                {loading ? 'Finalizing...' : 'Finalize JobSheet & Post to Ledgers'}
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default JobSheetStep;
