import { useState, useEffect } from 'react';
import { Download, Printer } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useJobsStore from '@/store/jobsStore';
import jsPDF from 'jspdf';

const ChalanStep = ({ jobId }) => {
  const [job, setJob] = useState(null);

  const fetchJobById = useJobsStore(state => state.fetchJobById);
  const updateChalanData = useJobsStore(state => state.updateChalanData);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    const jobData = await fetchJobById(jobId);
    if (jobData) {
      setJob(jobData);
    }
  };

  const handleSaveChallan = async () => {
    const chalanData = {
      items: job.jobsheet_data?.items || [],
      extraWork: job.jobsheet_data?.extraWork || [],
      generatedAt: new Date().toISOString()
    };

    await updateChalanData(jobId, chalanData);
    alert('Challan saved successfully!');
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('DELIVERY CHALLAN', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Job No: ${job.job_no}`, 20, 40);
    doc.text(`Vehicle: ${job.vehicle_no}`, 20, 47);
    doc.text(`Owner: ${job.owner_name}`, 20, 54);
    doc.text(`Date: ${new Date(job.job_date).toLocaleDateString()}`, 20, 61);
    doc.text(`Branch: ${job.branch}`, 20, 68);

    doc.setFontSize(14);
    doc.text('Inspection Items', 20, 85);

    doc.setFontSize(10);
    let yPos = 95;

    doc.text('Category', 20, yPos);
    doc.text('Item', 55, yPos);
    doc.text('Cost', 105, yPos);
    doc.text('Total', 130, yPos);
    doc.text('Work By', 160, yPos);

    yPos += 5;
    doc.line(20, yPos, 200, yPos);
    yPos += 5;

    const items = job.jobsheet_data?.items || [];
    items.forEach(item => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      const total = parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1);
      doc.text(item.category || '', 20, yPos);
      doc.text((item.item || '').substring(0, 20), 55, yPos);
      doc.text(`₹${parseFloat(item.cost || 0).toFixed(2)}`, 105, yPos);
      doc.text(`₹${total.toFixed(2)}`, 130, yPos);
      doc.text(item.workBy || '-', 160, yPos);
      yPos += 7;
    });

    const extraWork = job.jobsheet_data?.extraWork || [];
    if (extraWork.length > 0) {
      yPos += 5;
      doc.setFontSize(14);
      doc.text('Extra Work', 20, yPos);
      yPos += 10;

      doc.setFontSize(10);
      extraWork.forEach(work => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        const total = parseFloat(work.cost || 0) * parseFloat(work.multiplier || 1);
        doc.text(work.category || '', 20, yPos);
        doc.text((work.item || '').substring(0, 20), 55, yPos);
        doc.text(`₹${parseFloat(work.cost || 0).toFixed(2)}`, 105, yPos);
        doc.text(`₹${total.toFixed(2)}`, 130, yPos);
        doc.text(work.workBy || '-', 160, yPos);
        yPos += 7;
      });
    }

    const inspectionSubtotal = items.reduce((sum, item) =>
      sum + (parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1)), 0
    );
    const extraWorkSubtotal = extraWork.reduce((sum, work) =>
      sum + (parseFloat(work.cost || 0) * parseFloat(work.multiplier || 1)), 0
    );
    const estimateDiscount = parseFloat(job.estimate_data?.discount || 0);
    const grandTotal = inspectionSubtotal + extraWorkSubtotal - estimateDiscount;

    yPos += 5;
    doc.line(20, yPos, 200, yPos);
    yPos += 7;

    doc.text(`Subtotal (Inspection): ₹${inspectionSubtotal.toFixed(2)}`, 130, yPos);
    yPos += 7;
    doc.text(`Subtotal (Extra Work): ₹${extraWorkSubtotal.toFixed(2)}`, 130, yPos);
    yPos += 7;
    doc.text(`Discount: ₹${estimateDiscount.toFixed(2)}`, 130, yPos);
    yPos += 7;
    doc.setFont(undefined, 'bold');
    doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 130, yPos);

    doc.save(`Challan-${job.job_no}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!job) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-dark-text-secondary">
        Loading challan...
      </div>
    );
  }

  const items = job.jobsheet_data?.items || [];
  const extraWork = job.jobsheet_data?.extraWork || [];
  const inspectionSubtotal = items.reduce((sum, item) =>
    sum + (parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1)), 0
  );
  const extraWorkSubtotal = extraWork.reduce((sum, work) =>
    sum + (parseFloat(work.cost || 0) * parseFloat(work.multiplier || 1)), 0
  );
  const estimateDiscount = parseFloat(job.estimate_data?.discount || 0);
  const grandTotal = inspectionSubtotal + extraWorkSubtotal - estimateDiscount;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">
              Delivery Challan
            </h3>
            <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
              Job No: {job.job_no} | Vehicle: {job.vehicle_no}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSaveChallan} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Save Challan
            </Button>
            <Button onClick={generatePDF} variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button onClick={handlePrint} variant="secondary" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500 dark:text-dark-text-secondary">Owner:</span>
              <p className="font-medium text-gray-900 dark:text-dark-text">{job.owner_name}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-dark-text-secondary">Date:</span>
              <p className="font-medium text-gray-900 dark:text-dark-text">
                {new Date(job.job_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-dark-text-secondary">Branch:</span>
              <p className="font-medium text-gray-900 dark:text-dark-text">{job.branch}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-dark-text-secondary">Status:</span>
              <p className="font-medium text-gray-900 dark:text-dark-text capitalize">{job.status}</p>
            </div>
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-3">Inspection Items</h4>
        <div className="overflow-x-auto mb-6">
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
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => {
                const itemTotal = parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1);
                return (
                  <tr key={item.id}>
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
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                      {item.workBy || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-dark-text-secondary">
                      {item.notes || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {extraWork.length > 0 && (
          <>
            <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-3">Extra Work</h4>
            <div className="overflow-x-auto mb-6">
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
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                  {extraWork.map((work) => {
                    const workTotal = parseFloat(work.cost || 0) * parseFloat(work.multiplier || 1);
                    return (
                      <tr key={work.id}>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                          {work.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                          {work.item}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                          {work.condition}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                          ₹{parseFloat(work.cost).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                          {work.multiplier}x
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-dark-text">
                          ₹{workTotal.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">
                          {work.workBy || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-dark-text-secondary">
                          {work.notes || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="border-t dark:border-gray-700 pt-6">
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
            <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
              <span>Estimate Discount:</span>
              <span>- ₹{estimateDiscount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t dark:border-gray-700 pt-3">
              <span className="text-gray-900 dark:text-dark-text">Grand Total:</span>
              <span className="text-brand-red">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChalanStep;
