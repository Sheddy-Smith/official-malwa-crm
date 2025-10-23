// import React, { useState } from 'react'
// import Card from '../../components/ui/Card'
// import Button from '../../components/ui/Button'
// import { PlusCircle } from 'lucide-react'

// const VendorLedgerTab = () => {

//    const [open ,setopen] = useState(true) ;




//   return (
//     <>
    
//       <Card>
//       <div className="flex justify-between items-center mb-4 ">
//         <h3 className="text-lg font-bold dark:text-dark-text">Vendor Ledger</h3>
//         <Button  onClick={()=>setopen(!open)} variant="secondary">
//           <PlusCircle    className="h-4 w-4 mr-2" />
//           Add Entry
//         </Button>
//       </div>

      

// {open&&(

// <table className="min-w-full bg-white dark:bg-dark-bg rounded shadow">
//         <thead>
//             <tr>
//                 <th className="py-2 px-4 border-b text-left">Categories</th>
//                 <th className="py-2 px-4 border-b text-left">item</th>
//                 <th className="py-2 px-4 border-b text-left">Condition</th>
//                 <th className="py-2 px-4 border-b text-left">Cost(₹)</th>
//                 <th className="py-2 px-4 border-b text-left">Multiper</th>
//                  <th className="py-2 px-4 border-b text-left">Total</th>
//                    <th className="py-2 px-4 border-b text-left">Wrok by</th>
//                      <th className="py-2 px-4 border-b text-left">Notes</th>
//             </tr>
//         </thead>
//         <tbody>
//             {/* Example static data, replace with dynamic data from JobSheet */}
//             <tr>
//                 <td className="py-2 px-4 border-b">Parts</td>
//                 <td className="py-2 px-4 border-b">iron</td>
//                 <td className="py-2 px-4 border-b">Ok</td>
//                 <td className="py-2 px-4 border-b">20</td>
//                 <td className="py-2 px-4 border-b">3.5</td>
//                    <td className="py-2 px-4 border-b">70</td>
//                       <td className="py-2 px-4 border-b">Labour</td>
//                        <td className="py-2 px-4 border-b">Salman</td>
//             </tr>
//             <tr>
//                 <td className="py-2 px-4 border-b">Parts</td>
//                 <td className="py-2 px-4 border-b">iron</td>
//                 <td className="py-2 px-4 border-b">Ok</td>
//                 <td className="py-2 px-4 border-b">20</td>
//                 <td className="py-2 px-4 border-b">3.5</td>
//                    <td className="py-2 px-4 border-b">70</td>
//                       <td className="py-2 px-4 border-b">Labour</td>
//                        <td className="py-2 px-4 border-b">Salman</td>

//             </tr>
//             {/* Add more rows as needed */}
//         </tbody>
//     </table>

// )}


// <div className='text-right mt-[20px] font-bold text-lg'>Final Total</div>
//     </Card>
    
//     </>
//   )
// }

// export default VendorLedgerTab



// import React, { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit3, Save } from "lucide-react";

// const VendorLedgerTab = () => {
//   const [open, setOpen] = useState(false);
//   const [ledger, setLedger] = useState([]);

//   // Load vendorLedger from localStorage
//   useEffect(() => {
//     const savedLedger = JSON.parse(localStorage.getItem("vendorLedger") || "[]");
//     setLedger(savedLedger);
//   }, []);

//   // Function to add/update ledger from JobSheet
//   const syncFromJobSheet = () => {
//     const jobSheet = JSON.parse(localStorage.getItem("jobSheetEstimate") || "[]");
//     const extraWork = JSON.parse(localStorage.getItem("extraWork") || "[]");

//     // Filter only Vendor items
//     const vendorItems = [...jobSheet, ...extraWork].filter(
//       (item) => item.workBy === "Vendor"
//     ).map(item => ({
//       ...item,
//       paymentStatus: item.paymentStatus || "No", // default No
//       id: Math.random().toString(36).substr(2, 9), // unique id for edit/delete
//     }));

//     // Merge with existing ledger to avoid duplicates (by id)
//     const merged = [...ledger, ...vendorItems.filter(v => !ledger.find(l => l.id === v.id))];

//     setLedger(merged);
//     localStorage.setItem("vendorLedger", JSON.stringify(merged));
//     alert("✅ Vendor Ledger synced from Job Sheet!");
//   };

//   // Handle payment status change
//   const handlePaymentChange = (id, value) => {
//     const updated = ledger.map((item) =>
//       item.id === id ? { ...item, paymentStatus: value } : item
//     );
//     setLedger(updated);
//     localStorage.setItem("vendorLedger", JSON.stringify(updated));
//   };

//   // Handle delete
//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this entry?")) {
//       const updated = ledger.filter((item) => item.id !== id);
//       setLedger(updated);
//       localStorage.setItem("vendorLedger", JSON.stringify(updated));
//     }
//   };

//   // Handle edit (optional, here inline editing)
//   const handleFieldChange = (id, field, value) => {
//     const updated = ledger.map((item) =>
//       item.id === id ? { ...item, [field]: value } : item
//     );
//     setLedger(updated);
//     localStorage.setItem("vendorLedger", JSON.stringify(updated));
//   };

//   // Total calculation
//   const calculateTotal = (item) => {
//     const cost = parseFloat(item.cost) || 0;
//     const multiplier = parseFloat(item.multiplier) || 1;
//     return cost * multiplier;
//   };

//   return (
//     <Card>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-bold dark:text-dark-text">Vendor Ledger</h3>
//         <div className="flex gap-2">
//           <Button variant="secondary" onClick={() => setOpen(!open)}>
//             <PlusCircle className="h-4 w-4 mr-2" /> Add Entry
//           </Button>
//           <Button variant="secondary" onClick={syncFromJobSheet}>
//             <Save className="h-4 w-4 mr-2" /> Sync from Job Sheet
//           </Button>
//         </div>
//       </div>

//       {open && (
//         <div className="mb-4">
//           <p className="text-sm text-gray-500">Manual entry form can be added here if needed.</p>
//         </div>
//       )}

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white dark:bg-dark-bg rounded shadow">
//           <thead>
//             <tr>
//               <th className="py-2 px-4 border-b">Category</th>
//               <th className="py-2 px-4 border-b">Item</th>
//               <th className="py-2 px-4 border-b">Condition</th>
//               <th className="py-2 px-4 border-b">Cost (₹)</th>
//               <th className="py-2 px-4 border-b">Multiplier</th>
//               <th className="py-2 px-4 border-b">Total (₹)</th>
//               <th className="py-2 px-4 border-b">Work By</th>
//               <th className="py-2 px-4 border-b">Notes</th>
//               <th className="py-2 px-4 border-b">Payment</th>
//               <th className="py-2 px-4 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {ledger.length === 0 ? (
//               <tr>
//                 <td colSpan={10} className="text-center p-4 text-gray-500">
//                   No Vendor entries.
//                 </td>
//               </tr>
//             ) : (
//               ledger.map((item) => (
//                 <tr key={item.id} className="border-b">
//                   <td className="p-2">
//                     <input
//                       value={item.category}
//                       onChange={(e) => handleFieldChange(item.id, "category", e.target.value)}
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       value={item.item}
//                       onChange={(e) => handleFieldChange(item.id, "item", e.target.value)}
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       value={item.condition}
//                       onChange={(e) => handleFieldChange(item.id, "condition", e.target.value)}
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={item.cost}
//                       onChange={(e) => handleFieldChange(item.id, "cost", e.target.value)}
//                       className="w-24 p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">{item.multiplier}</td>
//                   <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                   <td className="p-2">{item.workBy}</td>
//                   <td className="p-2">
//                     <input
//                       value={item.notes}
//                       onChange={(e) => handleFieldChange(item.id, "notes", e.target.value)}
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <select
//                       value={item.paymentStatus}
//                       onChange={(e) => handlePaymentChange(item.id, e.target.value)}
//                       className="p-1 border rounded"
//                     >
//                       <option>No</option>
//                       <option>Yes</option>
//                     </select>
//                   </td>
//                   <td className="p-2 flex gap-2">
//                     <button onClick={() => handleDelete(item.id)}>
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="text-right mt-4 font-bold text-lg">
//         Final Total: ₹{ledger.reduce((acc, item) => acc + calculateTotal(item), 0).toFixed(2)}
//       </div>
//     </Card>
//   );
// };

// export default VendorLedgerTab;







import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PlusCircle, Trash2, Save } from "lucide-react";

const VendorLedgerTab = () => {

  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    const savedLedger = JSON.parse(localStorage.getItem("vendorLedger") || "[]");
    setLedger(savedLedger);
  }, []);

  const syncFromJobSheet = () => {
    const jobSheet = JSON.parse(localStorage.getItem("jobSheetEstimate") || "[]");
    const extraWork = JSON.parse(localStorage.getItem("extraWork") || "[]");

    const vendorItems = [...jobSheet, ...extraWork]
      .filter((item) => item.workBy === "Vendor")
      .map((item) => ({
        ...item,
        paymentStatus: item.paymentStatus || "No",
        id: Math.random().toString(36).substr(2, 9),
      }));

    const merged = [
      ...ledger,
      ...vendorItems.filter((v) => !ledger.find((l) => l.id === v.id)),
    ];

    setLedger(merged);
    localStorage.setItem("vendorLedger", JSON.stringify(merged));
  };

  const handlePaymentChange = (id, value) => {
    const updated = ledger.map((item) =>
      item.id === id ? { ...item, paymentStatus: value } : item
    );
    setLedger(updated);
    localStorage.setItem("vendorLedger", JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const updated = ledger.filter((item) => item.id !== id);
      setLedger(updated);
      localStorage.setItem("vendorLedger", JSON.stringify(updated));
    }
  };

  const handleFieldChange = (id, field, value) => {
    const updated = ledger.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setLedger(updated);
    localStorage.setItem("vendorLedger", JSON.stringify(updated));
  };

  const calculateTotal = (item) => {
    const cost = parseFloat(item.cost) || 0;
    const multiplier = parseFloat(item.multiplier) || 1;
    return cost * multiplier;
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Vendor Ledger</h3>
        <div className="flex gap-2">
          
          <Button variant="secondary" onClick={syncFromJobSheet}>
            <Save className="h-4 w-4 mr-2" /> Sync from Job Sheet
          </Button>
        </div>
      </div>

     

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Item</th>
              <th className="py-2 px-4 border-b">Condition</th>
              <th className="py-2 px-4 border-b">Cost (₹)</th>
              <th className="py-2 px-4 border-b">Multiplier</th>
              <th className="py-2 px-4 border-b">Total (₹)</th>
              <th className="py-2 px-4 border-b">Work By</th>
              <th className="py-2 px-4 border-b">Notes</th>
              <th className="py-2 px-4 border-b">Payment</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ledger.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center p-4 text-gray-500">
                  No Vendor entries.
                </td>
              </tr>
            ) : (
              ledger.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-2">
                    <input
                      value={item.category}
                      onChange={(e) => handleFieldChange(item.id, "category", e.target.value)}
                      className=" border-none   w-full p-1 border rounded text-sm"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={item.item}
                      onChange={(e) => handleFieldChange(item.id, "item", e.target.value)}
                      className="border-none w-full p-1 border rounded text-sm"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      value={item.condition}
                      onChange={(e) => handleFieldChange(item.id, "condition", e.target.value)}
                      className="border-none w-full p-1 border rounded text-sm"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.cost}
                      onChange={(e) => handleFieldChange(item.id, "cost", e.target.value)}
                      className=" border-none w-24 p-1 border rounded text-sm"
                    />
                  </td>
                  <td className="p-2 text-center">{item.multiplier}</td>
                  <td className="p-2 text-center">{calculateTotal(item).toFixed(2)}</td>
                  <td className="p-2 text-center">{item.workBy}</td>
                  <td className="p-2">
                    <input
                      value={item.notes}
                      onChange={(e) => handleFieldChange(item.id, "notes", e.target.value)}
                      className="border-none w-full p-1 border rounded text-sm"
                    />
                  </td>
                  <td className="p-2 text-center text-sm">
                    <select
                      value={item.paymentStatus}
                      onChange={(e) => handlePaymentChange(item.id, e.target.value)}
                      className="border-none p-1 border rounded text-sm"
                    >
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </td>
                  <td className="p-2 flex justify-center gap-2">
                    <button onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-right mt-4 font-bold text-lg">
        Final Total: ₹{ledger.reduce((acc, item) => acc + calculateTotal(item), 0).toFixed(2)}
      </div>
    </Card>
  );
};

export default VendorLedgerTab;
