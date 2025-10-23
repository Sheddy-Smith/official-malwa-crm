import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useJobsStore from '@/store/jobsStore';

const EstimateStep = ({ jobId }) => {
  const [job, setJob] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [gstRate, setGstRate] = useState(18);

  const fetchJobById = useJobsStore(state => state.fetchJobById);
  const updateEstimateData = useJobsStore(state => state.updateEstimateData);
  const loading = useJobsStore(state => state.loading);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    const jobData = await fetchJobById(jobId);
    if (jobData) {
      setJob(jobData);
      setDiscount(jobData.estimate_data?.discount || 0);
      setGstRate(jobData.estimate_data?.gst_rate || 18);
    }
  };

  const items = job?.inspection_data?.items || [];
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.cost || 0), 0);
  const discountAmount = parseFloat(discount || 0);
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = (taxableAmount * parseFloat(gstRate)) / 100;
  const total = taxableAmount + gstAmount;

  const handleSave = async () => {
    await updateEstimateData(jobId, {
      items,
      discount: discountAmount,
      gst_rate: gstRate,
      subtotal,
      taxableAmount,
      gstAmount,
      total
    });
    alert('Estimate saved!');
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-6">Estimate</h3>

        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Condition</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">{item.item}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">{item.condition}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-dark-text">₹{parseFloat(item.cost || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t dark:border-gray-700 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Subtotal:</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-dark-text">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Discount:</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-dark-text text-right"
              />
            </div>

            <div className="flex justify-between items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">GST Rate (%):</span>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)}
                className="w-32 px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-dark-text text-right"
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Taxable Amount:</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-dark-text">₹{taxableAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">GST Amount:</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-dark-text">₹{gstAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center border-t dark:border-gray-700 pt-3">
              <span className="text-lg font-bold text-gray-900 dark:text-dark-text">Total:</span>
              <span className="text-2xl font-bold text-brand-red">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Estimate
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EstimateStep;
