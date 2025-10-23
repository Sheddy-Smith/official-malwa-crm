import { useState, useEffect } from 'react';
import { Download, Printer, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import useJobsStore from '@/store/jobsStore';
import useCustomerStore from '@/store/customerStore';
import jsPDF from 'jspdf';

const paymentTypes = ['Full Payment', 'Advance', 'Partial Payment', 'Credit'];

const InvoiceStep = ({ jobId }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    customerId: '',
    paymentType: 'Full Payment',
    gstRate: 18,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: ''
  });

  const fetchJobById = useJobsStore(state => state.fetchJobById);
  const createInvoice = useJobsStore(state => state.createInvoice);
  const customers = useCustomerStore(state => state.customers);
  const fetchCustomers = useCustomerStore(state => state.fetchCustomers);

  useEffect(() => {
    loadJob();
    fetchCustomers();
  }, [jobId]);

  const loadJob = async () => {
    const jobData = await fetchJobById(jobId);
    if (jobData) {
      setJob(jobData);
      if (jobData.customer_id) {
        setInvoiceData(prev => ({ ...prev, customerId: jobData.customer_id }));
      }
    }
  };

  const savedJobSheetEstimate = localStorage.getItem('jobSheetEstimate');
  const savedExtraWork = localStorage.getItem('extraWork');
  const savedDiscount = localStorage.getItem('estimateDiscount');

  const items = savedJobSheetEstimate ? JSON.parse(savedJobSheetEstimate) : [];
  const extraWork = savedExtraWork ? JSON.parse(savedExtraWork) : [];

  const subtotal = [...items, ...extraWork].reduce((sum, item) => {
    return sum + (parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1));
  }, 0);

  const estimateDiscount = savedDiscount ? parseFloat(savedDiscount) : 0;
  const taxableAmount = subtotal - estimateDiscount;
  const gstAmount = (taxableAmount * parseFloat(invoiceData.gstRate)) / 100;
  const finalTotal = taxableAmount + gstAmount;

  const handleSaveInvoice = async () => {
    if (!invoiceData.customerId) {
      alert('Please select a customer');
      return;
    }

    setLoading(true);

    const allItems = [...items, ...extraWork].map(item => ({
      description: item.item,
      category: item.category,
      cost: parseFloat(item.cost || 0),
      multiplier: parseFloat(item.multiplier || 1),
      total: parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1)
    }));

    const invoicePayload = {
      customerId: invoiceData.customerId,
      invoiceDate: invoiceData.invoiceDate,
      dueDate: invoiceData.dueDate || null,
      subtotal: taxableAmount,
      gstRate: parseFloat(invoiceData.gstRate),
      gstAmount: gstAmount,
      discountAmount: estimateDiscount,
      totalAmount: finalTotal,
      paymentType: invoiceData.paymentType,
      items: allItems,
      notes: invoiceData.notes
    };

    const result = await createInvoice(jobId, invoicePayload);

    setLoading(false);

    if (result) {
      alert(`✅ Invoice ${result.invoice_no} created! Customer ledger updated.`);
      loadJob();
    } else {
      alert('❌ Error creating invoice. Please try again.');
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const customer = customers.find(c => c.id === invoiceData.customerId);

    doc.setFontSize(20);
    doc.text('INVOICE', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Invoice No: ${job.invoice_data?.invoiceNo || 'DRAFT'}`, 20, 40);
    doc.text(`Job No: ${job.job_no}`, 20, 47);
    doc.text(`Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN')}`, 20, 54);

    doc.text('Bill To:', 20, 68);
    doc.setFontSize(10);
    doc.text(customer?.name || job.owner_name || '', 20, 75);
    if (customer?.company) doc.text(customer.company, 20, 82);
    if (customer?.phone) doc.text(`Ph: ${customer.phone}`, 20, 89);

    doc.setFontSize(10);
    doc.text(`Vehicle: ${job.vehicle_no}`, 120, 75);

    let yPos = 105;
    doc.text('Description', 20, yPos);
    doc.text('Category', 90, yPos);
    doc.text('Amount', 170, yPos);
    yPos += 5;
    doc.line(20, yPos, 200, yPos);
    yPos += 7;

    [...items, ...extraWork].forEach(item => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      const amount = parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1);
      doc.text((item.item || '').substring(0, 30), 20, yPos);
      doc.text(item.category || '', 90, yPos);
      doc.text(`₹${amount.toFixed(2)}`, 170, yPos);
      yPos += 7;
    });

    yPos += 5;
    doc.line(20, yPos, 200, yPos);
    yPos += 7;

    doc.text(`Subtotal:`, 130, yPos);
    doc.text(`₹${subtotal.toFixed(2)}`, 170, yPos);
    yPos += 7;

    if (estimateDiscount > 0) {
      doc.text(`Discount:`, 130, yPos);
      doc.text(`- ₹${estimateDiscount.toFixed(2)}`, 170, yPos);
      yPos += 7;
    }

    doc.text(`Taxable Amount:`, 130, yPos);
    doc.text(`₹${taxableAmount.toFixed(2)}`, 170, yPos);
    yPos += 7;

    doc.text(`GST (${invoiceData.gstRate}%):`, 130, yPos);
    doc.text(`₹${gstAmount.toFixed(2)}`, 170, yPos);
    yPos += 7;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text(`Total Amount:`, 130, yPos);
    doc.text(`₹${finalTotal.toFixed(2)}`, 170, yPos);

    doc.save(`Invoice-${job.job_no}.pdf`);
  };

  if (!job) {
    return <div className="text-center py-12 text-gray-500 dark:text-dark-text-secondary">Loading invoice...</div>;
  }

  const isInvoiceCreated = job.invoice_data && job.invoice_data.invoiceNo;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">Invoice</h2>
          <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
            Status: <span className={`font-medium ${isInvoiceCreated ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
              {isInvoiceCreated ? 'Invoice Generated' : 'Pending Invoice'}
            </span>
          </p>
        </div>
      </div>

      {isInvoiceCreated && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-300 font-medium">
            ✓ Invoice {job.invoice_data.invoiceNo} created. Customer ledger updated.
          </p>
        </div>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text">Invoice Details</h3>
          <div className="flex gap-2">
            <Button onClick={generatePDF} variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />PDF
            </Button>
            <Button onClick={() => window.print()} variant="secondary" size="sm">
              <Printer className="h-4 w-4 mr-2" />Print
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Customer *</label>
            <select value={invoiceData.customerId} onChange={(e) => setInvoiceData({ ...invoiceData, customerId: e.target.value })} disabled={isInvoiceCreated} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text disabled:opacity-50">
              <option value="">Select Customer</option>
              {customers.map(customer => (<option key={customer.id} value={customer.id}>{customer.name} {customer.company && `- ${customer.company}`}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Payment Type</label>
            <select value={invoiceData.paymentType} onChange={(e) => setInvoiceData({ ...invoiceData, paymentType: e.target.value })} disabled={isInvoiceCreated} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text disabled:opacity-50">
              {paymentTypes.map(type => (<option key={type} value={type}>{type}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Invoice Date</label>
            <input type="date" value={invoiceData.invoiceDate} onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })} disabled={isInvoiceCreated} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text disabled:opacity-50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Due Date (Optional)</label>
            <input type="date" value={invoiceData.dueDate} onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })} disabled={isInvoiceCreated} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text disabled:opacity-50" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">GST Rate (%)</label>
            <input type="number" value={invoiceData.gstRate} onChange={(e) => setInvoiceData({ ...invoiceData, gstRate: e.target.value })} disabled={isInvoiceCreated} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text disabled:opacity-50" min="0" max="100" step="0.01" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary mb-1">Notes (Optional)</label>
            <input type="text" value={invoiceData.notes} onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })} disabled={isInvoiceCreated} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent dark:bg-gray-800 dark:text-dark-text disabled:opacity-50" placeholder="Add notes..." />
          </div>
        </div>

        <h4 className="font-semibold text-gray-900 dark:text-dark-text mb-3">Invoice Items</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Condition</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Cost (₹)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-text-secondary uppercase">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
              {[...items, ...extraWork].map((item, index) => {
                const itemTotal = parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1);
                return (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">{item.item}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">{item.condition}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-text">₹{parseFloat(item.cost).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-dark-text">₹{itemTotal.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 border-t dark:border-gray-700 pt-6">
          <div className="max-w-md ml-auto space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-dark-text-secondary">Subtotal:</span>
              <span className="font-medium text-gray-900 dark:text-dark-text">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            {estimateDiscount > 0 && (
              <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                <span>Estimate Discount:</span>
                <span>- ₹{estimateDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-dark-text-secondary">Taxable Amount:</span>
              <span className="font-medium text-gray-900 dark:text-dark-text">₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-dark-text-secondary">GST ({invoiceData.gstRate}%):</span>
              <span className="font-medium text-gray-900 dark:text-dark-text">₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between text-lg font-bold border-t dark:border-gray-700 pt-3">
              <span className="text-gray-900 dark:text-dark-text">Total Amount:</span>
              <span className="text-brand-red">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {!isInvoiceCreated && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveInvoice} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating Invoice...' : 'Save Invoice & Post to Ledgers'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default InvoiceStep;
