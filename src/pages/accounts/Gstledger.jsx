// import React, { useState, useEffect } from "react";

// const GSTLedger = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [expandedMonth, setExpandedMonth] = useState(null);

//   useEffect(() => {
//     const saved = localStorage.getItem("malwa_invoices_v1");
//     if (saved) {
//       setInvoices(JSON.parse(saved));
//     }
//   }, []);

//   // Group invoices by month
//   const grouped = invoices.reduce((acc, inv) => {
//     const month = inv.date ? inv.date.slice(0, 7) : "Unknown"; // YYYY-MM
//     if (!acc[month]) acc[month] = [];
//     acc[month].push(inv);
//     return acc;
//   }, {});

//   const toggleExpand = (month) => {
//     setExpandedMonth(expandedMonth === month ? null : month);
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">GST Ledger</h2>

//       <table className="w-full border-collapse border border-gray-300">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="border p-2">Month</th>
//             <th className="border p-2">Total Invoices</th>
//             <th className="border p-2">Total GST</th>
//             <th className="border p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.keys(grouped).map((month) => {
//             const totalGST = grouped[month].reduce(
//               (sum, inv) => sum + inv.gstAmount,
//               0
//             );
//             return (
//               <React.Fragment key={month}>
//                 <tr className="bg-white">
//                   <td className="border p-2">{month}</td>
//                   <td className="border p-2">{grouped[month].length}</td>
//                   <td className="border p-2">₹{totalGST.toFixed(2)}</td>
//                   <td className="border p-2 text-center">
//                     <button
//                       onClick={() => toggleExpand(month)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       {expandedMonth === month ? "Hide" : "View"}
//                     </button>
//                   </td>
//                 </tr>

//                 {expandedMonth === month && (
//                   <tr>
//                     <td colSpan="4" className="border p-2">
//                       <table className="w-full border border-gray-300 mt-2">
//                         <thead className="bg-gray-100">
//                           <tr>
//                             <th className="border p-1">Supplier</th>
//                             <th className="border p-1">Item</th>
//                             <th className="border p-1">Qty</th>
//                             <th className="border p-1">Price</th>
//                             <th className="border p-1">GST %</th>
//                             <th className="border p-1">GST Amt</th>
//                             <th className="border p-1">Total</th>
//                             <th className="border p-1">Date</th>
//                             <th className="border p-1">Payment</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {grouped[month].map((inv) => (
//                             <tr key={inv.id}>
//                               <td className="border p-1">{inv.supplier}</td>
//                               <td className="border p-1">{inv.item}</td>
//                               <td className="border p-1">{inv.qty}</td>
//                               <td className="border p-1">₹{inv.price}</td>
//                               <td className="border p-1">{inv.gst}%</td>
//                               <td className="border p-1">₹{inv.gstAmount}</td>
//                               <td className="border p-1">₹{inv.totalAmount}</td>
//                               <td className="border p-1">{inv.date}</td>
//                               <td className="border p-1">{inv.paymentStatus}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default GSTLedger;

// 2 runing code
// import React, { useState, useEffect } from "react";

// const GSTLedger = () => {
//   const [invoices, setInvoices] = useState([]);
//   const [expandedMonth, setExpandedMonth] = useState(null);

//   // Load invoices from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem("invoices");
//     if (saved) setInvoices(JSON.parse(saved));
//   }, []);

//   // Group invoices by month YYYY-MM
//   const grouped = invoices.reduce((acc, inv) => {
//     const month = inv.date ? inv.date.slice(0, 7) : "Unknown";
//     if (!acc[month]) acc[month] = [];
//     acc[month].push(inv);
//     return acc;
//   }, {});

//   const toggleExpand = (month) => {
//     setExpandedMonth(expandedMonth === month ? null : month);
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-4 text-center">GST Ledger</h2>

//       <table className="w-full border-collapse border border-gray-300">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="border p-2">Month</th>
//             <th className="border p-2">Total Invoices</th>
//             <th className="border p-2">Total GST</th>
//             <th className="border p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.keys(grouped).length === 0 && (
//             <tr>
//               <td colSpan="4" className="text-center p-4">
//                 No invoices found
//               </td>
//             </tr>
//           )}
//           {Object.keys(grouped).map((month) => {
//             const totalGST = grouped[month].reduce(
//               (sum, inv) => sum + (inv.gstAmount || 0),
//               0
//             );
//             return (
//               <React.Fragment key={month}>
//                 <tr className="bg-white">
//                   <td className="border p-2">{month}</td>
//                   <td className="border p-2">{grouped[month].length}</td>
//                   <td className="border p-2">₹{totalGST.toFixed(2)}</td>
//                   <td className="border p-2 text-center">
//                     <button
//                       onClick={() => toggleExpand(month)}
//                       className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                     >
//                       {expandedMonth === month ? "Hide" : "View"}
//                     </button>
//                   </td>
//                 </tr>

//                 {/* Expanded invoice table for the month */}
//                 {expandedMonth === month && (
//                   <tr>
//                     <td colSpan="4" className="p-2">
//                       <table className="w-full border-collapse border border-gray-300 mt-2">
//                         <thead className="bg-gray-100">
//                           <tr>
//                             <th className="border p-1">Supplier</th>
//                             <th className="border p-1">Item</th>
//                             <th className="border p-1">Qty</th>
//                             <th className="border p-1">Price</th>
//                             <th className="border p-1">GST %</th>
//                             <th className="border p-1">GST Amt</th>
//                             <th className="border p-1">Total</th>
//                             <th className="border p-1">Date</th>
//                             <th className="border p-1">Payment</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {grouped[month].map((inv) => (
//                             <tr key={inv.id} className="hover:bg-gray-50">
//                               <td className="border p-1">{inv.supplier}</td>
//                               <td className="border p-1">{inv.item}</td>
//                               <td className="border p-1">{inv.qty}</td>
//                               <td className="border p-1">₹{inv.price}</td>
//                               <td className="border p-1">{inv.gst}%</td>
//                               <td className="border p-1">₹{inv.gstAmount.toFixed(2)}</td>
//                               <td className="border p-1">₹{inv.totalAmount.toFixed(2)}</td>
//                               <td className="border p-1">{inv.date}</td>
//                               <td className="border p-1">{inv.paymentStatus}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default GSTLedger;


// running and sepcial code:-
// import React, { useState, useEffect } from "react";
// import { Edit, Trash } from "lucide-react";

// const GSTLedger = () => {
//   const [purchaseData, setPurchaseData] = useState([]);
//   const [sellData, setSellData] = useState([]);
//   const [expandedMonth, setExpandedMonth] = useState(null);

//   // Load Purchase & Sell data from localStorage
//   useEffect(() => {
//     const p = localStorage.getItem("materials");
//     const s = localStorage.getItem("invoices");
//     setPurchaseData(p ? JSON.parse(p) : []);
//     setSellData(s ? JSON.parse(s) : []);
//   }, []);

//   const toggleExpand = (month) => {
//     setExpandedMonth(expandedMonth === month ? null : month);
//   };

//   // Combine data with type
//   const combinedData = [
//     ...purchaseData.map((item) => ({ ...item, type: "Purchase" })),
//     ...sellData.map((item) => ({
//       id: item.id,
//       name: item.item,
//       qty: item.qty,
//       price: item.price,
//       supplier: item.supplier,
//       payment: item.paymentStatus || item.status,
//       category: item.category || "-",
//       source: item.source || "-",
//       vehicleNo: item.vehicleNo || "-",
//       date: item.date,
//       type: "Sell",
//     })),
//   ];

//   // Group by month
//   const grouped = combinedData.reduce((acc, inv) => {
//     const month = inv.date ? inv.date.slice(0, 7) : "Unknown";
//     if (!acc[month]) acc[month] = [];
//     acc[month].push(inv);
//     return acc;
//   }, {});

//   const handleEdit = (inv) => {
//     alert(
//       `Edit action clicked for ${inv.type} Invoice: ID ${inv.id} (Implement actual edit separately)`
//     );
//   };

//   const handleDelete = (inv) => {
//     if (!window.confirm(`Delete this ${inv.type} record?`)) return;

//     if (inv.type === "Purchase") {
//       setPurchaseData((prev) => prev.filter((i) => i.id !== inv.id));
//       localStorage.setItem(
//         "materials",
//         JSON.stringify(purchaseData.filter((i) => i.id !== inv.id))
//       );
//     } else {
//       setSellData((prev) => prev.filter((i) => i.id !== inv.id));
//       localStorage.setItem(
//         "invoices",
//         JSON.stringify(sellData.filter((i) => i.id !== inv.id))
//       );
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4 text-center">GST Ledger</h2>

//       <table className="w-full border-collapse border border-gray-300">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="border p-2">Month</th>
//             <th className="border p-2">Total Records</th>
//             <th className="border p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {Object.keys(grouped).map((month) => (
//             <React.Fragment key={month}>
//               <tr className="bg-white">
//                 <td className="border p-2">{month}</td>
//                 <td className="border p-2">{grouped[month].length}</td>
//                 <td className="border p-2 text-center">
//                   <button
//                     onClick={() => toggleExpand(month)}
//                     className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                   >
//                     {expandedMonth === month ? "Hide" : "View"}
//                   </button>
//                 </td>
//               </tr>

//               {expandedMonth === month && (
//                 <tr>
//                   <td colSpan="3" className="border p-2">
//                     <div className="overflow-x-auto">
//                       <table className="w-full border-collapse border border-gray-300 mt-2">
//                         <thead className="bg-gray-100">
//                           <tr>
//                             <th className="border p-1">S.No</th>
//                             <th className="border p-1">Material</th>
//                             <th className="border p-1">Qty</th>
//                             <th className="border p-1">Price</th>
//                             <th className="border p-1">Supplier</th>
//                             <th className="border p-1">Payment</th>
//                             <th className="border p-1">Category</th>
//                             <th className="border p-1">Source</th>
//                             <th className="border p-1">VehicleNo</th>
//                             <th className="border p-1">Date</th>
//                             <th className="border p-1">Type</th>
//                             <th className="border p-1">Edit</th>
//                             <th className="border p-1">Delete</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {grouped[month].map((inv, index) => (
//                             <tr key={inv.id} className="hover:bg-gray-50 text-center">
//                               <td className="border p-1">{index + 1}</td>
//                               <td className="border p-1">{inv.name}</td>
//                               <td className="border p-1">{inv.qty}</td>
//                               <td className="border p-1">{inv.price}₹</td>
//                               <td className="border p-1">{inv.supplier}</td>
//                               <td className="border p-1">{inv.payment}</td>
//                               <td className="border p-1">{inv.category}</td>
//                               <td className="border p-1">{inv.source}</td>
//                               <td className="border p-1">{inv.vehicleNo}</td>
//                               <td className="border p-1">{inv.date}</td>
//                               <td className="border p-1">{inv.type}</td>
//                               <td className="border p-1">
//                                 <button
//                                   onClick={() => handleEdit(inv)}
//                                   className="bg-yellow-400 px-2 py-1 rounded"
//                                 >
//                                   <Edit className="inline w-4 h-4" />
//                                 </button>
//                               </td>
//                               <td className="border p-1">
//                                 <button
//                                   onClick={() => handleDelete(inv)}
//                                   className="bg-red-500 text-white px-2 py-1 rounded"
//                                 >
//                                   <Trash className="inline w-4 h-4" />
//                                 </button>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default GSTLedger;


// perfect code 1
// import React, { useState, useEffect } from "react";
// import { Edit, Trash } from "lucide-react";

// const GSTLedger = () => {
//   // Load Purchase & Sell data from localStorage
//   const [purchaseData, setPurchaseData] = useState(() => {
//     const raw = localStorage.getItem("materials");
//     return raw ? JSON.parse(raw) : [];
//   });

//   const [sellData, setSellData] = useState(() => {
//     const raw = localStorage.getItem("malwa_invoices_v1");
//     return raw ? JSON.parse(raw) : [];
//   });

//   const [editingItem, setEditingItem] = useState(null); // {type, data}

//   // Sync to localStorage
//   useEffect(() => {
//     localStorage.setItem("materials", JSON.stringify(purchaseData));
//   }, [purchaseData]);

//   useEffect(() => {
//     localStorage.setItem("malwa_invoices_v1", JSON.stringify(sellData));
//   }, [sellData]);

//   // Delete
//   const handleDelete = (type, id) => {
//     if (!window.confirm("Are you sure to delete?")) return;

//     if (type === "Purchase") {
//       setPurchaseData(purchaseData.filter((p) => p.id !== id));
//     } else {
//       setSellData(sellData.filter((s) => s.id !== id));
//     }
//   };

//   // Edit (just open form with existing data)
//   const handleEdit = (type, data) => {
//     setEditingItem({ type, data });
//   };

//   // Merge both data with type label
//   const ledgerData = [
//     ...purchaseData.map((p) => ({ ...p, type: "Purchase" })),
//     ...sellData.map((s) => ({ ...s, type: "Sell" })),
//   ].sort((a, b) => new Date(b.date) - new Date(a.date)); // latest first

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4 text-center">GST Ledger</h2>
//       <div className="overflow-x-auto border rounded shadow-sm">
//         <table className="min-w-full border-collapse text-center">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 border">S.No</th>
//               <th className="p-2 border">Material/Item</th>
//               <th className="p-2 border">Quantity</th>
//               <th className="p-2 border">Price</th>
//               <th className="p-2 border">Supplier</th>
//               <th className="p-2 border">Payment/Status</th>
//               <th className="p-2 border">Category</th>
//               <th className="p-2 border">Source</th>
//               <th className="p-2 border">VehicleNo</th>
//               <th className="p-2 border">Date</th>
//               <th className="p-2 border">Type</th>
//               <th className="p-2 border">Edit</th>
//               <th className="p-2 border">Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {ledgerData.length === 0 ? (
//               <tr>
//                 <td colSpan="13" className="p-4 text-gray-500">
//                   No data available
//                 </td>
//               </tr>
//             ) : (
//               ledgerData.map((item, index) => (
//                 <tr
//                   key={`${item.type}-${item.id}`}
//                   className="hover:bg-gray-50"
//                 >
//                   <td className="p-2 border">{index + 1}</td>
//                   <td className="p-2 border">
//                     {item.type === "Purchase" ? item.name : item.item}
//                   </td>
//                   <td className="p-2 border">{item.qty}</td>
//                   <td className="p-2 border">
//                     {item.type === "Purchase" ? item.price : item.rate}
//                   </td>
//                   <td className="p-2 border">
//                     {item.type === "Purchase" ? item.supplier : item.supplier}
//                   </td>
//                   <td className="p-2 border">
//                     {item.type === "Purchase" ? item.payment : item.status}
//                   </td>
//                   <td className="p-2 border">
//                     {item.type === "Purchase" ? item.category : "-"}
//                   </td>
//                   <td className="p-2 border">
//                     {item.type === "Purchase" ? item.source : "-"}
//                   </td>
//                   <td className="p-2 border">
//                     {item.type === "Purchase" ? item.vehicleNo : "-"}
//                   </td>
//                   <td className="p-2 border">{item.date}</td>
//                   <td className="p-2 border font-semibold">{item.type}</td>
//                   <td className="p-2 border">
//                     <button
//                       onClick={() => handleEdit(item.type, item)}
//                       className="px-2 py-1 bg-yellow-400 rounded"
//                     >
//                       <Edit className="w-4 h-4" />
//                     </button>
//                   </td>
//                   <td className="p-2 border">
//                     <button
//                       onClick={() => handleDelete(item.type, item.id)}
//                       className="px-2 py-1 bg-red-500 text-white rounded"
//                     >
//                       <Trash className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Edit form placeholder */}
//       {editingItem && (
//         <div className="mt-4 p-4 border rounded bg-yellow-50">
//           <p>
//             Editing <strong>{editingItem.type}</strong> -{" "}
//             {editingItem.type === "Purchase"
//               ? editingItem.data.name
//               : editingItem.data.item}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GSTLedger;

// done
import React, { useState, useEffect } from "react";

const GSTLedger = () => {
  // --- Purchase Data ---
  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem("materials");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Sell Data ---
  const [sells, setSells] = useState(() => {
    const saved = localStorage.getItem("malwa_invoices_v1");
    return saved ? JSON.parse(saved) : [];
  });

  // Combine both for display
  const ledgerData = [
    ...purchases.map((p) => ({ ...p, type: "Purchase" })),
    ...sells.map((s) => ({
      id: s.id,
      name: s.item,
      qty: s.qty,
      price: s.rate,
      supplier: s.supplier,
      payment: s.status,
      category: "-",
      source: "-",
      vehicleNo: "-",
      date: s.date,
      type: "Sell",
    })),
  ];

  // Delete Function
  const handleDelete = (id, type) => {
    if (!window.confirm("Are you sure to delete?")) return;

    if (type === "Purchase") {
      setPurchases(purchases.filter((p) => p.id !== id));
      localStorage.setItem(
        "materials",
        JSON.stringify(purchases.filter((p) => p.id !== id))
      );
    } else {
      setSells(sells.filter((s) => s.id !== id));
      localStorage.setItem(
        "malwa_invoices_v1",
        JSON.stringify(sells.filter((s) => s.id !== id))
      );
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        GST Ledger
      </h2>

      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="min-w-full border-collapse border">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 border text-sm text-gray-700">S.No</th>
              <th className="p-3 border text-sm text-gray-700">Material</th>
              <th className="p-3 border text-sm text-gray-700">Quantity</th>
              <th className="p-3 border text-sm text-gray-700">Price</th>
              <th className="p-3 border text-sm text-gray-700">Supplier</th>
              <th className="p-3 border text-sm text-gray-700">Payment</th>
              <th className="p-3 border text-sm text-gray-700">Category</th>
              <th className="p-3 border text-sm text-gray-700">Source</th>
              <th className="p-3 border text-sm text-gray-700">Vehicle No</th>
              <th className="p-3 border text-sm text-gray-700">Date</th>
              <th className="p-3 border text-sm text-gray-700">Type</th>
              <th className="p-3 border text-sm text-gray-700">Delete</th>
            </tr>
          </thead>
          <tbody>
            {ledgerData.length === 0 && (
              <tr>
                <td
                  colSpan="12"
                  className="text-center p-4 text-gray-500 font-medium"
                >
                  No records available
                </td>
              </tr>
            )}

            {ledgerData.map((row, index) => (
              <tr
                key={`${row.type}-${row.id}`}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="p-2 border text-center">{index + 1}</td>
                <td className="p-2 border text-center">{row.name}</td>
                <td className="p-2 border text-center">{row.qty}</td>
                <td className="p-2 border text-center">₹{row.price}</td>
                <td className="p-2 border text-center">{row.supplier}</td>
                <td className="p-2 border text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      row.payment === "Paid" ||
                      row.payment === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.payment}
                  </span>
                </td>
                <td className="p-2 border text-center">{row.category}</td>
                <td className="p-2 border text-center">{row.source}</td>
                <td className="p-2 border text-center">{row.vehicleNo}</td>
                <td className="p-2 border text-center">{row.date}</td>
                <td className="p-2 border text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      row.type === "Purchase"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {row.type}
                  </span>
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => handleDelete(row.id, row.type)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GSTLedger;


