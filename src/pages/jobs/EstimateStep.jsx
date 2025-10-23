import { useState, useEffect } from 'react';
import { Download, Printer, AlertTriangle, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useJobsStore from '@/store/jobsStore';
import jsPDF from 'jspdf';

const EstimateStep = ({ jobId }) => {
  const [job, setJob] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchJobById = useJobsStore(state => state.fetchJobById);
  const updateEstimateData = useJobsStore(state => state.updateEstimateData);

  useEffect(() => {
    loadJob();
    loadFromLocalStorage();
  }, [jobId]);

  const loadJob = async () => {
    const jobData = await fetchJobById(jobId);
    if (jobData) {
      setJob(jobData);
    }
  };

  const loadFromLocalStorage = () => {
    const savedDiscount = localStorage.getItem('estimateDiscount');
    if (savedDiscount) {
      setDiscount(parseFloat(savedDiscount));
    }
  };

  const getInspectionItems = () => {
    const savedItems = localStorage.getItem('inspectionItems');
    return savedItems ? JSON.parse(savedItems) : [];
  };

  const inspectionItems = getInspectionItems();

  const subtotal = inspectionItems.reduce((sum, item) => {
    return sum + (parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1));
  }, 0);

  const discountAmount = parseFloat(discount || 0);
  const finalTotal = subtotal - discountAmount;
  const discountPercent = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;
  const approvalNeeded = discountPercent > 5;

  const handleSaveEstimate = async () => {
    localStorage.setItem('estimateDiscount', discountAmount.toString());

    setLoading(true);
    const estimateData = {
      items: inspectionItems.map(item => ({
        ...item,
        sellingPrice: parseFloat(item.cost) * parseFloat(item.multiplier)
      })),
      discount: discountAmount,
      subtotal,
      finalTotal,
      gst_rate: 18,
      approvalNeeded,
      status: approvalNeeded ? 'pending_approval' : 'approved'
    };

    await updateEstimateData(jobId, estimateData);
    setLoading(false);
    alert('Estimate saved successfully!');
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('ESTIMATE', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Job No: ${job.job_no}`, 20, 40);
    doc.text(`Vehicle: ${job.vehicle_no}`, 20, 47);
    doc.text(`Owner: ${job.owner_name}`, 20, 54);
    doc.text(`Date: ${new Date(job.job_date).toLocaleDateString('en-IN')}`, 20, 61);
    doc.text(`Branch: ${job.branch}`, 20, 68);

    doc.setFontSize(14);
    doc.text('Estimate Items', 20, 85);

    doc.setFontSize(10);
    let yPos = 95;

    doc.text('Category', 20, yPos);
    doc.text('Item', 55, yPos);
    doc.text('Condition', 95, yPos);
    doc.text('Cost', 130, yPos);
    doc.text('Multiplier', 155, yPos);
    doc.text('Total', 185, yPos);

    yPos += 5;
    doc.line(20, yPos, 200, yPos);
    yPos += 7;

    inspectionItems.forEach(item => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      const total = parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1);
      doc.text(item.category || '', 20, yPos);
      doc.text((item.item || '').substring(0, 20), 55, yPos);
      doc.text(item.condition || '', 95, yPos);
      doc.text(`₹${parseFloat(item.cost || 0).toFixed(2)}`, 130, yPos);
      doc.text(`${item.multiplier}x`, 155, yPos);
      doc.text(`₹${total.toFixed(2)}`, 185, yPos);
      yPos += 7;
    });

    yPos += 5;
    doc.line(20, yPos, 200, yPos);
    yPos += 7;

    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 130, yPos);
    yPos += 7;
    if (discountAmount > 0) {
      doc.text(`Discount: ₹${discountAmount.toFixed(2)}`, 130, yPos);
      yPos += 7;
    }
    doc.setFont(undefined, 'bold');
    doc.text(`Final Total: ₹${finalTotal.toFixed(2)}`, 130, yPos);

    if (approvalNeeded) {
      yPos += 15;
      doc.setFontSize(10);
      doc.setTextColor(220, 38, 38);
      doc.text('* Approval Required (Discount > 5%)', 20, yPos);
    }

    doc.save(`Estimate-${job.job_no}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!job) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-dark-text-secondary">
        Loading estimate...
      </div>
    );
  }

  if (inspectionItems.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text mb-2">
          No Inspection Items
        </h3>
        <p className="text-gray-500 dark:text-dark-text-secondary">
          Please complete the Vehicle Inspection step first to generate an estimate.
        </p>
      </div>
    );
  }

  const estimateStatus = job.estimate_data?.status || 'pending';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Estimate</h2>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
            Status: <span className={`font-medium ${approvalNeeded ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
              {approvalNeeded ? 'Approval Required' : estimateStatus === 'approved' ? 'Approved' : 'Estimate Pending'}
            </span>
          </p>
        </div>
      </div>

      {approvalNeeded && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-900 dark:text-amber-300">
              Admin Approval Required
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              Discount of {discountPercent.toFixed(1)}% exceeds the 5% threshold. Admin approval is required before proceeding to Job Sheet.
            </p>
          </div>
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
            Estimate Details
          </h3>
          <div className="flex gap-2">
            <Button onClick={generatePDF} variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={handlePrint} variant="secondary" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print Estimate
            </Button>
          </div>
        </div>

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
                      ₹{parseFloat(item.cost).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                      {item.multiplier}x
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-dark-text">
                      ₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 border-t dark:border-gray-700 pt-6">
          <div className="max-w-md ml-auto space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-dark-text-secondary">Subtotal:</span>
              <span className="font-medium text-gray-900 dark:text-dark-text">
                ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
                Discount (₹):
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text text-right"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            {discountAmount > 0 && (
              <div className="text-xs text-gray-500 dark:text-dark-text-secondary text-right">
                Discount Percentage: {discountPercent.toFixed(2)}%
              </div>
            )}

            <div className="flex justify-between text-lg font-bold border-t dark:border-gray-700 pt-3">
              <span className="text-gray-900 dark:text-dark-text">Final Total:</span>
              <span className="text-brand-red">
                ₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveEstimate} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Estimate'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EstimateStep;
