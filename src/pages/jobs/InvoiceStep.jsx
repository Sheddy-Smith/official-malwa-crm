import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Save, Printer } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const InvoiceStep = () => {
  // Job Sheet data (static)
  const jobSheetEstimate = JSON.parse(localStorage.getItem("jobSheetEstimate") || "[]");
  const extraWork = JSON.parse(localStorage.getItem("extraWork") || "[]");

  // Total Calculation (Multiplier static from Job Sheet/Extra Work)
  const calculateTotal = (item) => {
    const cost = parseFloat(item.cost) || 0;
    const multiplier = parseFloat(item.multiplier) || 1;
    return cost * multiplier;
  };

  const subTotalEstimate = jobSheetEstimate.reduce(
    (acc, item) => acc + calculateTotal(item),
    0
  );

  const subTotalExtra = extraWork.reduce(
    (acc, item) => acc + calculateTotal(item),
    0
  );

  const subTotal = subTotalEstimate + subTotalExtra;

  const [customer, setCustomer] = useState("");
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [paymentType, setPaymentType] = useState("Full Payment");
  const [gstRate, setGstRate] = useState(18); // GST default 18%

  const discount = parseFloat(localStorage.getItem("estimateDiscount") || 0);
  const gstAmount = (subTotal * gstRate) / 100;
  const grandTotal = subTotal + gstAmount;
  const finalTotal = grandTotal - discount;

  // PDF download
  const handleSavePDF = () => {
    const input = document.getElementById("invoice-body");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");
    });
  };

  // Print
  const handlePrint = () => {
    const printContent = document.getElementById("invoice-body");
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(`<html><head><title>Invoice</title></head><body>${printContent.innerHTML}</body></html>`);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-xl font-bold">Invoice</h3>

      <Card>
        {/* Customer & Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold">Customer</label>
            {!isNewCustomer ? (
              <select
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full border p-2 rounded mt-1"
              >
                <option value="">Select Customer</option>
                <option value="Customer 1">Customer 1</option>
                <option value="Customer 2">Customer 2</option>
              </select>
            ) : (
              <input
                type="text"
                placeholder="Enter new customer"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="w-full border p-2 rounded mt-1"
              />
            )}
            <div className="mt-2">
              <button
                className="text-sm text-blue-500 underline"
                onClick={() => setIsNewCustomer(!isNewCustomer)}
              >
                {isNewCustomer ? "Select Existing" : "Add New Customer"}
              </button>
            </div>
          </div>

          <div>
            <label className="font-semibold">Payment Type</label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
              className="w-full border p-2 rounded mt-1"
            >
              <option>Full Payment</option>
              <option>Advance Payment</option>
              <option>Partial Payment</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">GST Rate (%)</label>
            <input
              type="number"
              value={gstRate}
              onChange={(e) => setGstRate(parseFloat(e.target.value))}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        </div>

        {/* Invoice Body */}
        <div id="invoice-body" className="overflow-x-auto p-2 border rounded">
          
          <h4 className="font-semibold mb-2">Challan Items (Static View)</h4>
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Condition</th>
                <th className="p-2 border">Cost (₹)</th>
                <th className="p-2 border">Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {jobSheetEstimate.map((item, idx) => (
                <tr key={`est-${idx}`} className="border-b">
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.item}</td>
                  <td className="p-2">{item.condition}</td>
                  <td className="p-2">{item.cost}</td>
                  <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
                </tr>
              ))}
              {extraWork.map((item, idx) => (
                <tr key={`extra-${idx}`} className="border-b">
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.item}</td>
                  <td className="p-2">{item.condition}</td>
                  <td className="p-2">{item.cost}</td>
                  <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-4 text-right space-y-1">
            <div>Subtotal: ₹{subTotal.toFixed(2)}</div>
            <div>GST ({gstRate}%): ₹{gstAmount.toFixed(2)}</div>
            <div>Estimate Discount: ₹{discount.toFixed(2)}</div>
            <div className="text-lg font-bold">Final Total: ₹{finalTotal.toFixed(2)}</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-4">
          <Button onClick={handleSavePDF}>
            <Save className="h-4 w-4 mr-2" /> Save Invoice
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Print Invoice
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default InvoiceStep;
