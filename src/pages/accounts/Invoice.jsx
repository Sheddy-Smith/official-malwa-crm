// // Invoice.jsx
import React, { useState, useEffect } from "react";

const INVOICES_KEY = "malwa_invoices_v1";
const SUPPLIER_LEDGER_KEY = "malwa_supplier_ledger_v1";

const todayISO = () => new Date().toISOString().split("T")[0];

const Badge = ({ children, color = "gray" }) => (
  <span
    className={`inline-block px-2 py-0.5 text-xs rounded bg-${color}-100 text-${color}-700`}
  >
    {children}
  </span>
);

const Invoice = () => {
  // --- UI State ---
  const [showForm, setShowForm] = useState(false);

  // --- Data State ---
  const [invoices, setInvoices] = useState(() => {
    const raw = localStorage.getItem(INVOICES_KEY);
    return raw ? JSON.parse(raw) : [];
  });

  const [ledger, setLedger] = useState(() => {
    const raw = localStorage.getItem(SUPPLIER_LEDGER_KEY);
    return raw ? JSON.parse(raw) : [];
  });

  // --- Form State ---
  const [supplier, setSupplier] = useState("");
  const [item, setItem] = useState("");
  const [qty, setQty] = useState(1);
  const [rate, setRate] = useState(0);
  const [gst, setGst] = useState(18);
  const [date, setDate] = useState(todayISO());
  const [status, setStatus] = useState("Pending");

  const [editingId, setEditingId] = useState(null);

  // --- Derived total ---
  const baseTotal = qty * rate;
  const gstAmount = (baseTotal * gst) / 100;
  const finalTotal = baseTotal + gstAmount;

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(SUPPLIER_LEDGER_KEY, JSON.stringify(ledger));
  }, [ledger]);

  const resetForm = () => {
    setSupplier("");
    setItem("");
    setQty(1);
    setRate(0);
    setGst(18);
    setDate(todayISO());
    setStatus("Pending");
    setEditingId(null);
  };

  const nextId = () => {
    if (invoices.length === 0) return 1;
    return Math.max(...invoices.map((i) => i.id)) + 1;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!supplier.trim()) {
      alert("Enter supplier name.");
      return;
    }
    if (!item.trim()) {
      alert("Enter item name.");
      return;
    }

    const invoiceObj = {
      id: editingId || nextId(),
      supplier: supplier.trim(),
      item: item.trim(),
      qty: Number(qty),
      rate: Number(rate),
      gst: Number(gst),
      baseTotal,
      finalTotal,
      date,
      status,
    };

    if (editingId) {
      const updated = invoices.map((i) =>
        i.id === editingId ? invoiceObj : i
      );
      setInvoices(updated);

      setLedger((prev) => {
        const copy = [...prev.filter((l) => l.id !== editingId), invoiceObj];
        return copy;
      });
    } else {
      setInvoices((prev) => [...prev, invoiceObj]);
      setLedger((prev) => [...prev, invoiceObj]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleEdit = (inv) => {
    setEditingId(inv.id);
    setSupplier(inv.supplier);
    setItem(inv.item);
    setQty(inv.qty);
    setRate(inv.rate);
    setGst(inv.gst);
    setDate(inv.date);
    setStatus(inv.status);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this invoice?")) return;
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    setLedger((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoices</h2>
          <p className="text-sm text-gray-600">
            Manage supplier invoices with GST & payment status.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + New Invoice
        </button>
      </div>

      {/* Table */}
      <div className="border rounded shadow-sm bg-white p-4">
        {invoices.length === 0 ? (
          <div className="text-sm text-gray-500">No invoices yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-sm">ID</th>
                  <th className="p-2 border text-sm">Supplier</th>
                  <th className="p-2 border text-sm">Item</th>
                  <th className="p-2 border text-sm">Qty</th>
                  <th className="p-2 border text-sm">Rate</th>
                  <th className="p-2 border text-sm">GST%</th>
                  <th className="p-2 border text-sm">Total</th>
                  <th className="p-2 border text-sm">Final (with GST)</th>
                  <th className="p-2 border text-sm">Date</th>
                  <th className="p-2 border text-sm">Status</th>
                  <th className="p-2 border text-sm">Edit</th>
                  <th className="p-2 border text-sm">Delete</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="p-2 border text-sm">{inv.id}</td>
                    <td className="p-2 border text-sm">{inv.supplier}</td>
                    <td className="p-2 border text-sm">{inv.item}</td>
                    <td className="p-2 border text-sm">{inv.qty}</td>
                    <td className="p-2 border text-sm">₹{inv.rate}</td>
                    <td className="p-2 border text-sm">{inv.gst}%</td>
                    <td className="p-2 border text-sm">₹{inv.baseTotal}</td>
                    <td className="p-2 border text-sm font-medium">
                      ₹{inv.finalTotal}
                    </td>
                    <td className="p-2 border text-sm">{inv.date}</td>
                    <td className="p-2 border text-sm">
                      <Badge color={inv.status === "Paid" ? "green" : "red"}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="p-2 border text-sm">
                      <button
                        onClick={() => handleEdit(inv)}
                        className="px-2 py-1 text-xs bg-yellow-100 rounded"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="p-2 border text-sm">
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-40">
          <div className="bg-white rounded-lg shadow-lg w-[92%] max-w-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Invoice" : "New Invoice"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-3 py-1 rounded text-sm bg-gray-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              {/* Supplier */}
              <div>
                <label className="block text-sm font-medium">Supplier</label>
                <input
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter supplier name"
                />
              </div>

              {/* Item */}
              <div>
                <label className="block text-sm font-medium">Item</label>
                <input
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Item details"
                />
              </div>

              {/* Qty & Rate */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium">Quantity</label>
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Rate</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* GST & Date */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium">GST (%)</label>
                  <input
                    type="number"
                    value={gst}
                    onChange={(e) => setGst(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              {/* Totals */}
              <div className="text-sm text-gray-700">
                <p>Base Total: ₹{baseTotal}</p>
                <p>GST: ₹{gstAmount}</p>
                <p className="font-medium">Final Total: ₹{finalTotal}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  {editingId ? "Update Invoice" : "Save Invoice"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoice;


  //  Runnimg code 1
// import React, { useState, useEffect } from "react";

// const Invoice = () => {
//   const [supplier, setSupplier] = useState("");
//   const [item, setItem] = useState("");
//   const [qty, setQty] = useState("");
//   const [rate, setRate] = useState("");
//   const [gst, setGst] = useState("");
//   const [date, setDate] = useState("");
//   const [status, setStatus] = useState("Unpaid");

//   const [invoices, setInvoices] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   // Load from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("invoices");
//     if (stored) setInvoices(JSON.parse(stored));
//   }, []);

//   // Save to localStorage
//   useEffect(() => {
//     localStorage.setItem("invoices", JSON.stringify(invoices));
//   }, [invoices]);

//   // Helper for ID
//   const nextId = () =>
//     invoices.length > 0 ? Math.max(...invoices.map((i) => i.id)) + 1 : 1;

//   // Add or Update Invoice
//   const handleAddOrUpdate = () => {
//     if (!supplier || !item || !qty || !rate || !gst || !date) {
//       alert("Please fill all fields");
//       return;
//     }

//     const baseTotal = Number(qty) * Number(rate);
//     const gstAmount = (baseTotal * Number(gst)) / 100;
//     const finalTotal = baseTotal + gstAmount;

//     const invoiceObj = {
//       id: editingId || nextId(),
//       supplier: supplier.trim(),
//       item: item.trim(),
//       qty: Number(qty),
//       rate: Number(rate),
//       price: Number(rate), // 👈 alias for GST Ledger
//       gst: Number(gst),
//       gstAmount, // 👈 explicit GST amount
//       baseTotal,
//       finalTotal,
//       totalAmount: finalTotal, // 👈 alias for GST Ledger
//       date,
//       status,
//       paymentStatus: status, // 👈 alias for GST Ledger
//     };

//     if (editingId) {
//       setInvoices(
//         invoices.map((inv) => (inv.id === editingId ? invoiceObj : inv))
//       );
//       setEditingId(null);
//     } else {
//       setInvoices([...invoices, invoiceObj]);
//     }

//     // Reset fields
//     setSupplier("");
//     setItem("");
//     setQty("");
//     setRate("");
//     setGst("");
//     setDate("");
//     setStatus("Unpaid");
//   };

//   const handleEdit = (id) => {
//     const inv = invoices.find((i) => i.id === id);
//     if (!inv) return;

//     setSupplier(inv.supplier);
//     setItem(inv.item);
//     setQty(inv.qty);
//     setRate(inv.rate);
//     setGst(inv.gst);
//     setDate(inv.date);
//     setStatus(inv.status);
//     setEditingId(id);
//   };

//   const handleDelete = (id) => {
//     setInvoices(invoices.filter((i) => i.id !== id));
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-4 text-center">Invoice Manager</h2>

//       {/* Input Form */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Supplier"
//           className="border p-2 rounded"
//           value={supplier}
//           onChange={(e) => setSupplier(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Item"
//           className="border p-2 rounded"
//           value={item}
//           onChange={(e) => setItem(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Qty"
//           className="border p-2 rounded"
//           value={qty}
//           onChange={(e) => setQty(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Rate"
//           className="border p-2 rounded"
//           value={rate}
//           onChange={(e) => setRate(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="GST %"
//           className="border p-2 rounded"
//           value={gst}
//           onChange={(e) => setGst(e.target.value)}
//         />
//         <input
//           type="date"
//           className="border p-2 rounded"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//         />
//         <select
//           className="border p-2 rounded"
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//         >
//           <option value="Unpaid">Unpaid</option>
//           <option value="Paid">Paid</option>
//         </select>
//       </div>

//       <button
//         className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700"
//         onClick={handleAddOrUpdate}
//       >
//         {editingId ? "Update Invoice" : "Add Invoice"}
//       </button>

//       {/* Invoice Table */}
//       <div className="mt-8">
//         <table className="w-full border-collapse border">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="border p-2">ID</th>
//               <th className="border p-2">Supplier</th>
//               <th className="border p-2">Item</th>
//               <th className="border p-2">Qty</th>
//               <th className="border p-2">Price</th>
//               <th className="border p-2">GST%</th>
//               <th className="border p-2">GST Amt</th>
//               <th className="border p-2">Total</th>
//               <th className="border p-2">Date</th>
//               <th className="border p-2">Payment</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoices.map((inv) => (
//               <tr key={inv.id} className="hover:bg-gray-100">
//                 <td className="border p-2">{inv.id}</td>
//                 <td className="border p-2">{inv.supplier}</td>
//                 <td className="border p-2">{inv.item}</td>
//                 <td className="border p-2">{inv.qty}</td>
//                 <td className="border p-2">{inv.price}</td>
//                 <td className="border p-2">{inv.gst}%</td>
//                 <td className="border p-2">{inv.gstAmount}</td>
//                 <td className="border p-2">{inv.totalAmount}</td>
//                 <td className="border p-2">{inv.date}</td>
//                 <td className="border p-2">{inv.paymentStatus}</td>
//                 <td className="border p-2 space-x-2">
//                   <button
//                     className="bg-yellow-400 px-3 py-1 rounded"
//                     onClick={() => handleEdit(inv.id)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="bg-red-500 text-white px-3 py-1 rounded"
//                     onClick={() => handleDelete(inv.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Invoice;



