// // running code 
// import React, { useEffect, useState } from "react";

// /*
//   Voucher.jsx
//   - Beginner-friendly voucher system
//   - Features:
//     * Add voucher (type: Vendor | Labour | Supplier)
//     * Payment method (UPI / Bank / Cash / Manual) with relevant fields
//     * Each voucher saved to a global vouchers list + appended to the chosen ledger
//     * Data persisted in localStorage
//     * Simple tab view: All Vouchers | Vendor Ledger | Labour Ledger | Supplier Ledger
//     * Basic delete function
//   - No external UI libraries required (Tailwind classes used)
// */

// const VOUCHERS_KEY = "malwa_vouchers_v1";
// const LEDGERS_KEY = "malwa_ledgers_v1";

// const defaultLedgers = {
//   Vendor: [],
//   Labour: [],
//   Supplier: [],
// };

// const todayISO = () => new Date().toISOString().split("T")[0];

// const Badge = ({ children }) => (
//   <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
//     {children}
//   </span>
// );

// const Voucher = () => {
//   // --- UI State ---
//   const [activeTab, setActiveTab] = useState("All"); // All | Vendor | Labour | Supplier
//   const [showForm, setShowForm] = useState(false);

//   // --- Data State (vouchers + ledgers) ---
//   const [vouchers, setVouchers] = useState(() => {
//     const raw = localStorage.getItem(VOUCHERS_KEY);
//     return raw ? JSON.parse(raw) : [];
//   });
//   const [ledgers, setLedgers] = useState(() => {
//     const raw = localStorage.getItem(LEDGERS_KEY);
//     return raw ? JSON.parse(raw) : defaultLedgers;
//   });

//   // --- Form State ---
//   const [type, setType] = useState("Vendor"); // Vendor | Labour | Supplier
//   const [party, setParty] = useState(""); // party name (supplier/vendor/labour name)
//   const [amount, setAmount] = useState("");
//   const [date, setDate] = useState(todayISO());
//   const [method, setMethod] = useState("UPI"); // UPI | Bank | Cash | Manual
//   const [upi, setUpi] = useState("");
//   const [bankAcc, setBankAcc] = useState("");
//   const [notes, setNotes] = useState("");

//   // For edit (optional simple edit mode) - we keep it beginner friendly: add/edit same modal
//   const [editingId, setEditingId] = useState(null);

//   // Save to localStorage whenever data changes
//   useEffect(() => {
//     localStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
//   }, [vouchers]);

//   useEffect(() => {
//     localStorage.setItem(LEDGERS_KEY, JSON.stringify(ledgers));
//   }, [ledgers]);

//   // Helper: reset form
//   const resetForm = () => {
//     setType("Vendor");
//     setParty("");
//     setAmount("");
//     setDate(todayISO());
//     setMethod("UPI");
//     setUpi("");
//     setBankAcc("");
//     setNotes("");
//     setEditingId(null);
//   };

//   // Create new id (simple incremental)
//   const nextId = () => {
//     if (vouchers.length === 0) return 1;
//     return Math.max(...vouchers.map((v) => v.id)) + 1;
//   };

//   // Save / Update voucher
//   const handleSaveVoucher = (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (!party.trim()) {
//       alert("Please enter party name (Vendor / Labour / Supplier).");
//       return;
//     }
//     if (!amount || Number(amount) <= 0) {
//       alert("Please enter a valid amount.");
//       return;
//     }
//     // Payment method specific validation
//     if (method === "UPI" && !upi.trim()) {
//       alert("Please enter UPI id for UPI payments.");
//       return;
//     }
//     if (method === "Bank" && !bankAcc.trim()) {
//       alert("Please enter bank account details for Bank payments.");
//       return;
//     }

//     const voucherObj = {
//       id: editingId || nextId(),
//       type, // Vendor | Labour | Supplier
//       party: party.trim(),
//       amount: Number(amount),
//       date,
//       method, // UPI | Bank | Cash | Manual
//       upi: method === "UPI" ? upi.trim() : "",
//       bankAcc: method === "Bank" ? bankAcc.trim() : "",
//       notes: notes.trim() || "",
//       createdAt: new Date().toISOString(),
//     };

//     if (editingId) {
//       // update existing voucher
//       const updated = vouchers.map((v) => (v.id === editingId ? voucherObj : v));
//       setVouchers(updated);

//       // update ledger entry (find & replace by id)
//       setLedgers((prev) => {
//         const copy = { ...prev };
//         // remove old id if exists in all ledgers & re-add to the correct ledger
//         ["Vendor", "Labour", "Supplier"].forEach((k) => {
//           copy[k] = copy[k].filter((it) => it.id !== editingId);
//         });
//         // add to proper ledger
//         copy[type] = [...copy[type], voucherObj];
//         return copy;
//       });
//     } else {
//       // add new voucher
//       setVouchers((prev) => [...prev, voucherObj]);

//       // append to ledger of the correct type
//       setLedgers((prev) => {
//         const copy = { ...prev };
//         copy[type] = [...(copy[type] || []), voucherObj];
//         return copy;
//       });
//     }

//     resetForm();
//     setShowForm(false);
//   };

//   // Start editing a voucher (populate form)
//   const handleEdit = (v) => {
//     setEditingId(v.id);
//     setType(v.type);
//     setParty(v.party);
//     setAmount(String(v.amount));
//     setDate(v.date || todayISO());
//     setMethod(v.method || "UPI");
//     setUpi(v.upi || "");
//     setBankAcc(v.bankAcc || "");
//     setNotes(v.notes || "");
//     setShowForm(true);
//   };

//   // Delete voucher
//   const handleDelete = (id) => {
//     if (!window.confirm("Delete this voucher?")) return;
//     setVouchers((prev) => prev.filter((v) => v.id !== id));
//     setLedgers((prev) => {
//       const copy = { ...prev };
//       ["Vendor", "Labour", "Supplier"].forEach((k) => {
//         copy[k] = copy[k].filter((it) => it.id !== id);
//       });
//       return copy;
//     });
//   };

//   // Render list helpers
//   const renderVoucherRow = (v) => (
//     <tr key={v.id} className="hover:bg-gray-50">
//       <td className="p-2 border text-sm">{v.id}</td>
//       <td className="p-2 border text-sm">{v.type}</td>
//       <td className="p-2 border text-sm">{v.party}</td>
//       <td className="p-2 border text-sm">₹{v.amount.toLocaleString("en-IN")}</td>
//       <td className="p-2 border text-sm">{v.date}</td>
//       <td className="p-2 border text-sm">{v.method}</td>
//       <td className="p-2 border text-sm">{v.method === "UPI" ? v.upi : v.method === "Bank" ? v.bankAcc : "-"}</td>
//       <td className="p-2 border text-sm">{v.notes || "-"}</td>
//       <td className="p-2 border text-sm">
//         <button
//           onClick={() => handleEdit(v)}
//           className="px-2 py-1 text-xs bg-yellow-100 rounded"
//         >
//           Edit
//         </button>
//       </td>
//       <td className="p-2 border text-sm">
//         <button
//           onClick={() => handleDelete(v.id)}
//           className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
//         >
//           Delete
//         </button>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="p-6 space-y-4">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold">Vouchers</h2>
//           <p className="text-sm text-gray-600">Create & manage payment vouchers.</p>
//         </div>

//         <div className="flex gap-2">
//           <Badge>{vouchers.length} total</Badge>
//           <button
//             onClick={() => {
//               resetForm();
//               setShowForm(true);
//             }}
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//           >
//             + New Voucher
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 items-center">
//         {["All", "Vendor", "Labour", "Supplier"].map((t) => (
//           <button
//             key={t}
//             onClick={() => setActiveTab(t)}
//             className={`px-3 py-1 rounded-t-lg border-b-2 ${
//               activeTab === t ? "border-red-600 text-red-700 bg-red-50" : "border-transparent text-gray-600"
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {/* Content */}
//       <div className="border rounded shadow-sm bg-white p-4">
//         {/* All Vouchers */}
//         {activeTab === "All" && (
//           <>
//             <h3 className="font-medium mb-3">All Vouchers</h3>
//             {vouchers.length === 0 ? (
//               <div className="text-sm text-gray-500">No vouchers created yet.</div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="p-2 border text-sm">ID</th>
//                       <th className="p-2 border text-sm">Type</th>
//                       <th className="p-2 border text-sm">Party</th>
//                       <th className="p-2 border text-sm">Amount</th>
//                       <th className="p-2 border text-sm">Date</th>
//                       <th className="p-2 border text-sm">Method</th>
//                       <th className="p-2 border text-sm">UPI/Bank</th>
//                       <th className="p-2 border text-sm">Notes</th>
//                       <th className="p-2 border text-sm">Edit</th>
//                       <th className="p-2 border text-sm">Delete</th>
//                     </tr>
//                   </thead>
//                   <tbody>{vouchers.map(renderVoucherRow)}</tbody>
//                 </table>
//               </div>
//             )}
//           </>
//         )}

//         {/* Ledgers */}
//         {["Vendor", "Labour", "Supplier"].includes(activeTab) && (
//           <>
//             <h3 className="font-medium mb-3">{activeTab} Ledger</h3>

//             <div className="mb-4 flex items-center justify-between">
//               <div className="text-sm text-gray-600">
//                 Total entries: {ledgers[activeTab]?.length || 0}
//               </div>
//               <div className="text-sm font-medium">
//                 Total amount: ₹
//                 {(
//                   (ledgers[activeTab] || []).reduce((s, it) => s + Number(it.amount || 0), 0) || 0
//                 ).toLocaleString("en-IN")}
//               </div>
//             </div>

//             {(!ledgers[activeTab] || ledgers[activeTab].length === 0) ? (
//               <div className="text-sm text-gray-500">No entries in this ledger.</div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full border-collapse">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="p-2 border text-sm">ID</th>
//                       <th className="p-2 border text-sm">Party</th>
//                       <th className="p-2 border text-sm">Amount</th>
//                       <th className="p-2 border text-sm">Date</th>
//                       <th className="p-2 border text-sm">Method</th>
//                       <th className="p-2 border text-sm">UPI/Bank</th>
//                       <th className="p-2 border text-sm">Notes</th>
//                       <th className="p-2 border text-sm">Edit</th>
//                       <th className="p-2 border text-sm">Delete</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {ledgers[activeTab].map((v) => (
//                       <tr key={v.id} className="hover:bg-gray-50">
//                         <td className="p-2 border text-sm">{v.id}</td>
//                         <td className="p-2 border text-sm">{v.party}</td>
//                         <td className="p-2 border text-sm">₹{v.amount.toLocaleString("en-IN")}</td>
//                         <td className="p-2 border text-sm">{v.date}</td>
//                         <td className="p-2 border text-sm">{v.method}</td>
//                         <td className="p-2 border text-sm">{v.method === "UPI" ? v.upi : v.method === "Bank" ? v.bankAcc : "-"}</td>
//                         <td className="p-2 border text-sm">{v.notes || "-"}</td>
//                         <td className="p-2 border text-sm">
//                           <button onClick={() => handleEdit(v)} className="px-2 py-1 bg-yellow-100 rounded text-xs">Edit</button>
//                         </td>
//                         <td className="p-2 border text-sm">
//                           <button onClick={() => handleDelete(v.id)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Delete</button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Form Modal */}
//       {showForm && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-40">
//           <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-[92%] max-w-xl p-5">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">{editingId ? "Edit Voucher" : "New Voucher"}</h3>
//               <div className="flex gap-2">
//                 <Badge>{editingId ? "Editing" : "Create"}</Badge>
//                 <button
//                   onClick={() => {
//                     setShowForm(false);
//                     resetForm();
//                   }}
//                   className="px-3 py-1 rounded text-sm bg-gray-100"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>

//             <form onSubmit={handleSaveVoucher} className="space-y-3">
//               {/* Type */}
//               <div>
//                 <label className="block text-sm font-medium">Voucher Type</label>
//                 <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded">
//                   <option value="Vendor">Vendor</option>
//                   <option value="Labour">Labour</option>
//                   <option value="Supplier">Supplier</option>
//                 </select>
//               </div>

//               {/* Party */}
//               <div>
//                 <label className="block text-sm font-medium">Party (Name)</label>
//                 <input value={party} onChange={(e) => setParty(e.target.value)} className="w-full p-2 border rounded" placeholder={`Enter ${type} name`} />
//               </div>

//               {/* Amount + Date */}
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <label className="block text-sm font-medium">Amount</label>
//                   <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. 2500" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium">Date</label>
//                   <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded" />
//                 </div>
//               </div>

//               {/* Method */}
//               <div>
//                 <label className="block text-sm font-medium">Payment Method</label>
//                 <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full p-2 border rounded">
//                   <option value="UPI">UPI</option>
//                   <option value="Bank">Bank Transfer</option>
//                   <option value="Cash">Cash</option>
//                   <option value="Manual">Manual</option>
//                 </select>
//               </div>

//               {/* Method-specific fields */}
//               {method === "UPI" && (
//                 <div>
//                   <label className="block text-sm font-medium">UPI ID</label>
//                   <input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="example@bank" className="w-full p-2 border rounded" />
//                 </div>
//               )}

//               {method === "Bank" && (
//                 <div>
//                   <label className="block text-sm font-medium">Bank account / IFSC</label>
//                   <input value={bankAcc} onChange={(e) => setBankAcc(e.target.value)} placeholder="Account no / IFSC" className="w-full p-2 border rounded" />
//                 </div>
//               )}

//               {/* Notes */}
//               <div>
//                 <label className="block text-sm font-medium">Notes (optional)</label>
//                 <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded" rows={3} placeholder="Payment details, reference, remarks..." />
//               </div>

//               {/* Buttons */}
//               <div className="flex gap-2">
//                 <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
//                   {editingId ? "Update Voucher" : "Save Voucher"}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setShowForm(false);
//                     resetForm();
//                   }}
//                   className="px-4 py-2 border rounded"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Voucher;


// import React from 'react'
// import { useState } from 'react'
// import { PlusCircle } from 'lucide-react'
// import { s } from 'framer-motion/m'
// const Voucher = () => {
//   const [Open, setOpen] = useState(false)
//    return (
//     <div>
//       {/* First div  */}
// <div className='flex iteam-center justify-between'>
//   <h1 className='font-bold  text-2xl'>Voucher Details</h1>
// <button onClick={()=>{setOpen(!Open)}} className='border-2 px-2 py-2 flex gap-2 font-bold bg-blue-400 rounded-lg text-white'> <PlusCircle className='w-8'/>Add Voucher </button>
// </div>
// {/* Second div start */}
// <div>

//   {/* Buttons */}
//   <div  className='flex gap-5 font-semibold'>
// <button>All</button>
// <button>Voucher</button>
// <button>Labour</button>
// <button>Supplier</button>
// </div>

// {Open&&(
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
// <table className='border w-full mt-[10px] ' >
//   <thead className='border'>
// <th className='border'>ID</th>
// <th className='border' >Type</th>
// <th className='border' >Party</th>
// <th className='border' >Amount</th>
// <th className='border' >Date</th>
// <th className='border' >Method</th>
// <th className='border' >UPI/Bank</th>
// <th className='border' >Notes</th>
// <th className='border' >Edit</th>
// <th className='border' >Delet</th>
// </thead>

// <tbody className='text-center'>
// <tr>
//   <td  className='border'>none</td>
//   <td  className='border'>none</td>
//   <td  className='border'>none</td>
//   <td  className='border'>none</td>
//   <td  className='border'>none</td>
//   <td  className='border'>none</td>
//   <td  className='border'>none</td>
//   <td  className='border'>none</td>
//   <td  className='border'>none</td>
//   <td  className='border'>none</td>
//    </tr>
// </tbody>
// </table>

// <button  onClick={()=>{setOpen(false)}}  className='border-2 mt-4 bg-blue-400 rounded-xl font-semibold px-2 py-2 '>Close</button>

// </div>
// </div>
// )}
// </div>
// </div>
//   )
// }


// export default Voucher



// import { PlusCircle } from 'lucide-react'
// import { s } from 'framer-motion/m'
// import { useState } from 'react'
// const Voucher = () => {
//   const [open , setopen] = useState(false)
  
//    return (
//     <div>
//       {/* First div  */}
// <div className='flex iteam-center justify-between'>
//   <h1 className='font-bold  text-2xl'>Voucher Details</h1>
// <button  onClick={()=>{setopen(!open)}} className='border-2 px-2 py-2 flex gap-2 font-bold bg-blue-400 rounded-lg text-white'> <PlusCircle className='w-8'/>Add Voucher </button>
// </div>
// {/* Second div start */}
// <div>

//   {/* Buttons */}
//   <div  className='flex gap-5 font-semibold'>
// <button>All</button>
// <button>Voucher</button>
// <button>Labour</button>
// <button>Supplier</button>
// </div>

// {open&&(
// <div className='text-center '>
// <h4>Material</h4>

//  <input className='mt-[10px] rounded-lg' type='text' placeholder='Enter ID'/><br/>
// <input className='mt-[10px] rounded-lg' type='text' placeholder='Enter Type'/><br/>
// <input className='mt-[10px] rounded-lg' type='text' placeholder='Enter Party'/><br/>
// <input className='mt-[10px] rounded-lg' type='text' placeholder='Enter Amount'/><br/>
// <input className='mt-[10px] rounded-lg' type='text' placeholder='Enter Date'/><br/>
// <input className='mt-[10px] rounded-lg' type='text' placeholder='Enter Method'/><br/>
// <input className='mt-[10px] rounded-lg' type='text' placeholder='Enter '/><br/>
// <input className='mt-[10px] rounded-lg' type='text' placeholder='Enter ID'/><br/>




// </div>
    
// )}  
// </div>
// </div>

//   )
// }


// export default Voucher

// Real as a biggner level
import React, { useState, useEffect } from "react";
import { Edit,Trash } from "lucide-react";
const Voucher = () => {
  // --- State ---
  const [vouchers, setVouchers] = useState(() => {
    const saved = localStorage.getItem("vouchers");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [id, setId] = useState(null); // edit mode
  const [type, setType] = useState("Vendor");
  const [party, setParty] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [method, setMethod] = useState("UPI");
  const [upi, setUpi] = useState("");
  const [bankAcc, setBankAcc] = useState("");
  const [notes, setNotes] = useState("");

  // --- Save to localStorage ---
  useEffect(() => {
    localStorage.setItem("vouchers", JSON.stringify(vouchers));
  }, [vouchers]);

  // --- Reset form ---
  const resetForm = () => {
    setId(null);
    setType("Vendor");
    setParty("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]);
    setMethod("UPI");
    setUpi("");
    setBankAcc("");
    setNotes("");
  };

  // --- Add / Update ---
  const handleSave = (e) => {
    e.preventDefault();
    if (!party || !amount) return alert("Please fill required fields!");

    const voucherObj = {
      id: id || Date.now(),
      type,
      party,
      amount: Number(amount),
      date,
      method,
      upi: method === "UPI" ? upi : "",
      bankAcc: method === "Bank" ? bankAcc : "",
      notes,
    };

    if (id) {
      // update
      setVouchers(vouchers.map((v) => (v.id === id ? voucherObj : v)));
    } else {
      // add
      setVouchers([...vouchers, voucherObj]);
    }

    resetForm();
    setShowForm(false);
  };

  // --- Edit ---
  const handleEdit = (v) => {
    setId(v.id);
    setType(v.type);
    setParty(v.party);
    setAmount(v.amount);
    setDate(v.date);
    setMethod(v.method);
    setUpi(v.upi);
    setBankAcc(v.bankAcc);
    setNotes(v.notes);
    setShowForm(true);
  };

  // --- Delete ---
  const handleDelete = (id) => {
    setVouchers(vouchers.filter((v) => v.id !== id));
  };

  // --- Filter by Tab ---
  const filteredVouchers =
    activeTab === "All" ? vouchers : vouchers.filter((v) => v.type === activeTab);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Vouchers</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          + New Voucher
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {["All", "Vendor", "Labour", "Supplier"].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-3 py-1 rounded ${
              activeTab === t ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Type</th>
              <th className="border p-2">Party</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Method</th>
              <th className="border p-2">Details</th>
              <th className="border p-2">Notes</th>
              <th className="border p-2">Edit</th>
               <th className="border p-2">Delet</th>
            </tr>
          </thead>
          <tbody>
            {filteredVouchers.map((v) => (
              <tr key={v.id} className="text-center">
                <td className="border p-2">{v.type}</td>
                <td className="border p-2">{v.party}</td>
                <td className="border p-2">₹{v.amount}</td>
                <td className="border p-2">{v.date}</td>
                <td className="border p-2">{v.method}</td>
                <td className="border p-2">
                  {v.method === "UPI" ? v.upi : v.method === "Bank" ? v.bankAcc : "-"}
                </td>
                <td className="border p-2">{v.notes || "-"}</td>
                <td className="border p-2 space-x-2">
                  <button onClick={() => handleEdit(v)} className="px-2 py-1 text-yellow-500 rounded">
                    <Edit/>
                  </button>
                  </td>
                   <td className="border p-2 space-x-2">
                  <button onClick={() => handleDelete(v.id)} className="px-2 py-1  text-red-500 rounded">
                    <Trash/>
                  </button>
                </td>
              </tr>
            ))}
            {filteredVouchers.length === 0 && (
              <tr>
                <td colSpan="8" className="text-gray-500 p-4">No vouchers</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96 space-y-3">
            <h3 className="text-lg font-bold">{id ? "Edit Voucher" : "New Voucher"}</h3>

            <form onSubmit={handleSave} className="space-y-3">
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded">
                <option>Vendor</option>
                <option>Labour</option>
                <option>Supplier</option>
              </select>
                    
                    {/* pura code  */}
              {/* <input value={party}
               onChange={(e) => setParty(e.target.value)}
                placeholder="Party Name"
                 className="w-full p-2 border rounded" /> */}

                 <input
                 list="party-list"
                 value={party}
                 onChange={(e) => setParty(e.target.value)}
                 placeholder="Party Name"
                 className="w-full p-2 border rounded"
                        />

               <datalist id="party-list">
                 <option value="Supplier A" />
                 <option value="Supplier B" />
                 <option value="Supplier C" />
                 <option value="Local Vendor" />
               </datalist>




              <input type="number"
               value={amount}
                onChange={(e) => setAmount(e.target.value)}
                 placeholder="Amount"
                  className="w-full p-2 border rounded" />

              <input type="date" value={date}
               onChange={(e) => setDate(e.target.value)} 
               className="w-full p-2 border rounded" />

              <select value={method} 
              onChange={(e) => setMethod(e.target.value)}
               className="w-full p-2 border rounded">
                <option>UPI</option>
                <option>Bank</option>
                <option>Cash</option>
                <option>Manual</option>
              </select>

              {method === "UPI" && (
                <input value={upi} 
                onChange={(e) => setUpi(e.target.value)} 
                placeholder="UPI ID" 
                className="w-full p-2 border rounded" />
              )}

              {method === "Bank" && (
                <input value={bankAcc} onChange={(e) => setBankAcc(e.target.value)} placeholder="Bank Account / IFSC" className="w-full p-2 border rounded" />
              )}

              <textarea value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Notes"
               className="w-full p-2 border rounded" />

              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded">
                  {id ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 border py-2 rounded"
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

export default Voucher;
