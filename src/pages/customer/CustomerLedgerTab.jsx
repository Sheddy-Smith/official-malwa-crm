import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { supabase } from '@/lib/supabase';
import { FileText, Download, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';

const InvoiceModal = ({ invoice, onClose }) => {
  if (!invoice) return null;

  return (
    <div className="space-y-4">
      <div className="border-b pb-4 dark:border-gray-700">
        <h3 className="text-xl font-bold dark:text-dark-text">Invoice Details</h3>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          {invoice.invoice_no}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
            Invoice Date
          </label>
          <p className="font-medium dark:text-dark-text">
            {new Date(invoice.invoice_date).toLocaleDateString('en-IN')}
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
            Invoice Number
          </label>
          <p className="font-medium dark:text-dark-text">{invoice.invoice_no}</p>
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
            Subtotal
          </label>
          <p className="font-medium dark:text-dark-text">
            ₹ {parseFloat(invoice.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
            Discount
          </label>
          <p className="font-medium dark:text-dark-text">
            ₹ {parseFloat(invoice.discount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
            GST ({invoice.gst_rate}%)
          </label>
          <p className="font-medium dark:text-dark-text">
            ₹ {parseFloat(invoice.gst_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
            Total Amount
          </label>
          <p className="font-bold text-lg text-brand-red">
            ₹ {parseFloat(invoice.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {invoice.items && invoice.items.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2 dark:text-dark-text">Items</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-2 text-left border dark:border-gray-600">Description</th>
                  <th className="p-2 text-right border dark:border-gray-600">Qty</th>
                  <th className="p-2 text-right border dark:border-gray-600">Rate</th>
                  <th className="p-2 text-right border dark:border-gray-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b dark:border-gray-700">
                    <td className="p-2 border dark:border-gray-600 dark:text-dark-text">
                      {item.description}
                    </td>
                    <td className="p-2 text-right border dark:border-gray-600 dark:text-dark-text">
                      {item.qty}
                    </td>
                    <td className="p-2 text-right border dark:border-gray-600 dark:text-dark-text">
                      ₹ {parseFloat(item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-2 text-right border dark:border-gray-600 dark:text-dark-text">
                      ₹ {(item.qty * item.rate).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

const ReceiptModal = ({ receipt, onClose }) => {
  if (!receipt) return null;

  return (
    <div className="space-y-4">
      <div className="border-b pb-4 dark:border-gray-700">
        <h3 className="text-xl font-bold dark:text-dark-text">Receipt Details</h3>
        <p className="text-sm text-gray-500 dark:text-dark-text-secondary mt-1">
          {receipt.receipt_no}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
            Receipt Date
          </label>
          <p className="font-medium dark:text-dark-text">
            {new Date(receipt.receipt_date).toLocaleDateString('en-IN')}
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
            Receipt Number
          </label>
          <p className="font-medium dark:text-dark-text">{receipt.receipt_no}</p>
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
            Amount Received
          </label>
          <p className="font-bold text-lg text-green-600">
            ₹ {parseFloat(receipt.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
            Payment Mode
          </label>
          <p className="font-medium dark:text-dark-text capitalize">
            {receipt.payment_mode}
          </p>
        </div>

        {receipt.reference && (
          <div className="col-span-2">
            <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
              Reference
            </label>
            <p className="font-medium dark:text-dark-text">{receipt.reference}</p>
          </div>
        )}

        {receipt.notes && (
          <div className="col-span-2">
            <label className="text-sm text-gray-500 dark:text-dark-text-secondary">
              Notes
            </label>
            <p className="font-medium dark:text-dark-text">{receipt.notes}</p>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
};

const CustomerLedgerTab = ({ customer }) => {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const fetchLedgerEntries = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('customer_ledger_entries')
        .select('*')
        .eq('customer_id', customer.id)
        .order('entry_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (startDate) {
        query = query.gte('entry_date', startDate);
      }
      if (endDate) {
        query = query.lte('entry_date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLedgerEntries(data || []);
    } catch (error) {
      console.error('Error fetching ledger entries:', error);
      toast.error('Failed to load ledger entries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedgerEntries();
  }, [customer.id]);

  const handleRefClick = async (entry) => {
    if (entry.ref_type === 'invoice') {
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', entry.ref_id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setSelectedInvoice(data);
          setIsInvoiceModalOpen(true);
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Failed to load invoice details');
      }
    } else if (entry.ref_type === 'receipt') {
      try {
        const { data, error } = await supabase
          .from('receipts')
          .select('*')
          .eq('id', entry.ref_id)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setSelectedReceipt(data);
          setIsReceiptModalOpen(true);
        }
      } catch (error) {
        console.error('Error fetching receipt:', error);
        toast.error('Failed to load receipt details');
      }
    }
  };

  const handleFilter = () => {
    fetchLedgerEntries();
  };

  const handlePrintStatement = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Customer Ledger Statement', 14, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${customer.name}`, 14, 30);
    doc.text(`Balance: ₹ ${customer.current_balance?.toLocaleString('en-IN') || '0'}`, 14, 37);

    if (startDate || endDate) {
      doc.text(`Period: ${startDate || 'Start'} to ${endDate || 'End'}`, 14, 44);
    }

    let yPos = 55;
    doc.setFontSize(10);
    doc.text('Date', 14, yPos);
    doc.text('Particulars', 40, yPos);
    doc.text('Debit', 120, yPos);
    doc.text('Credit', 150, yPos);
    doc.text('Balance', 180, yPos);

    yPos += 7;
    ledgerEntries.forEach(entry => {
      if (yPos > 280) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(new Date(entry.entry_date).toLocaleDateString('en-IN'), 14, yPos);
      doc.text(entry.particulars.substring(0, 25), 40, yPos);
      doc.text(entry.debit > 0 ? entry.debit.toFixed(2) : '-', 120, yPos);
      doc.text(entry.credit > 0 ? entry.credit.toFixed(2) : '-', 150, yPos);
      doc.text(entry.balance.toFixed(2), 180, yPos);

      yPos += 7;
    });

    doc.save(`ledger-${customer.name}-${Date.now()}.pdf`);
    toast.success('Statement downloaded successfully');
  };

  return (
    <>
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title=""
      >
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title=""
      >
        <ReceiptModal
          receipt={selectedReceipt}
          onClose={() => setIsReceiptModalOpen(false)}
        />
      </Modal>

      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl font-bold dark:text-dark-text">Account Ledger</h3>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded-lg bg-transparent dark:border-gray-600 dark:text-dark-text text-sm"
              />
              <span className="text-gray-500 dark:text-dark-text-secondary">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border rounded-lg bg-transparent dark:border-gray-600 dark:text-dark-text text-sm"
              />
            </div>

            <Button variant="secondary" size="sm" onClick={handleFilter}>
              Filter
            </Button>

            <Button variant="secondary" size="sm" onClick={handlePrintStatement}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-dark-text-secondary">
            Loading ledger entries...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-left border dark:border-gray-600">Date</th>
                  <th className="p-3 text-left border dark:border-gray-600">Particulars</th>
                  <th className="p-3 text-center border dark:border-gray-600">Ref No.</th>
                  <th className="p-3 text-right border dark:border-gray-600">
                    Debit (To Receive)
                  </th>
                  <th className="p-3 text-right border dark:border-gray-600">
                    Credit (Received)
                  </th>
                  <th className="p-3 text-right border dark:border-gray-600">
                    Balance (Due)
                  </th>
                </tr>
              </thead>
              <tbody>
                {ledgerEntries.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center p-8 text-gray-500 dark:text-dark-text-secondary"
                    >
                      No ledger entries found for this customer.
                    </td>
                  </tr>
                ) : (
                  ledgerEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="p-3 border dark:border-gray-600 dark:text-dark-text">
                        {new Date(entry.entry_date).toLocaleDateString('en-IN')}
                      </td>
                      <td className="p-3 border dark:border-gray-600 dark:text-dark-text">
                        {entry.particulars}
                      </td>
                      <td className="p-3 text-center border dark:border-gray-600">
                        {entry.ref_no ? (
                          <button
                            onClick={() => handleRefClick(entry)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium underline inline-flex items-center"
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            {entry.ref_no}
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="p-3 text-right border dark:border-gray-600 dark:text-dark-text">
                        {entry.debit > 0
                          ? `₹ ${parseFloat(entry.debit).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                            })}`
                          : '-'}
                      </td>
                      <td className="p-3 text-right border dark:border-gray-600 dark:text-dark-text">
                        {entry.credit > 0
                          ? `₹ ${parseFloat(entry.credit).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                            })}`
                          : '-'}
                      </td>
                      <td className="p-3 text-right border dark:border-gray-600 font-medium dark:text-dark-text">
                        ₹{' '}
                        {parseFloat(entry.balance).toLocaleString('en-IN', {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
};

export default CustomerLedgerTab;
