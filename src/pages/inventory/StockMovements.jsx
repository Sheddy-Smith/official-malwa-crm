// import Card from '@/components/ui/Card';
// import Button from '@/components/ui/Button';
// import { PlusCircle } from 'lucide-react';

// const StockMovements = () => {
//   return (
//      <Card>
//         <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-bold dark:text-dark-text">Stock Movements</h3>
//             <Button variant="secondary"><PlusCircle className="h-4 w-4 mr-2" />Add Movenment</Button>
//         </div>
//         <p className="dark:text-dark-text-secondary text-sm">This table will show a ledger of all stock movements (IN/OUT) linked to jobs or purchases.</p>
//     </Card>
//   )
// }

// export default StockMovements


// final code
// import React, { useState } from "react";
// import Button from "@/components/ui/Button"; // ✅ Tumhara Button component
// import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react"; // ✅ Icons

// const StockMovements = () => {
//   // 🔹 Ledger data
//   const [ledger, setLedger] = useState([]);

//   // 🔹 Input states
//   const [item, setItem] = useState("");
//   const [type, setType] = useState("IN");
//   const [qty, setQty] = useState("");
//   const [linkedTo, setLinkedTo] = useState("");

//   // 🔹 Edit mode states
//   const [editId, setEditId] = useState(null);
//   const [editItem, setEditItem] = useState("");
//   const [editType, setEditType] = useState("IN");
//   const [editQty, setEditQty] = useState("");
//   const [editLinkedTo, setEditLinkedTo] = useState("");

//   // ➕ Add entry
//   const handleAddEntry = () => {
//     if (!item || !qty || !linkedTo) return;

//     const newEntry = {
//       id: Date.now(),
//       item,
//       type,
//       qty,
//       linkedTo,
//       date: new Date().toLocaleString(),
//     };

//     setLedger([...ledger, newEntry]);

//     // Inputs reset
//     setItem("");
//     setQty("");
//     setLinkedTo("");
//   };

//   // 📝 Start Edit
//   const handleEdit = (entry) => {
//     setEditId(entry.id);
//     setEditItem(entry.item);
//     setEditType(entry.type);
//     setEditQty(entry.qty);
//     setEditLinkedTo(entry.linkedTo);
//   };

//   // 💾 Save Edit
//   const handleSave = () => {
//     const updated = ledger.map((entry) =>
//       entry.id === editId
//         ? {
//             ...entry,
//             item: editItem,
//             type: editType,
//             qty: editQty,
//             linkedTo: editLinkedTo,
//           }
//         : entry
//     );
//     setLedger(updated);
//     setEditId(null); // Edit mode off
//   };

//   // ❌ Delete entry
//   const handleDelete = (id) => {
//     const updated = ledger.filter((entry) => entry.id !== id);
//     setLedger(updated);
//   };

//   return (
//     <div className="p-6">
//       {/* Heading */}
//       <h2 className="text-xl font-bold mb-4">📒 Stock Ledger</h2>

//       {/* Form Inputs */}
//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           placeholder="Item Name"
//           value={item}
//           onChange={(e) => setItem(e.target.value)}
//           className="border p-2 flex-1"
//         />

//         <select
//           value={type}
//           onChange={(e) => setType(e.target.value)}
//           className="border p-2"
//         >
//           <option value="IN">IN</option>
//           <option value="OUT">OUT</option>
//         </select>

//         <input
//           type="number"
//           placeholder="Quantity"
//           value={qty}
//           onChange={(e) => setQty(e.target.value)}
//           className="border p-2 w-24"
//         />

//         <input
//           type="text"
//           placeholder="Linked To (Job/Purchase)"
//           value={linkedTo}
//           onChange={(e) => setLinkedTo(e.target.value)}
//           className="border p-2 flex-1"
//         />

//         <Button onClick={handleAddEntry} className="bg-blue-500 text-white">
//           <PlusCircle className="h-4 w-4 mr-2" /> Add
//         </Button>
//       </div>

//       {/* Ledger Table */}
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">S.No</th>
//             <th className="border p-2">Item</th>
//             <th className="border p-2">Type</th>
//             <th className="border p-2">Qty</th>
//             <th className="border p-2">Linked To</th>
//             <th className="border p-2">Date</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {ledger.map((entry, index) => (
//             <tr key={entry.id}>
//               <td className="border p-2">{index + 1}</td>
//               <td className="border p-2">
//                 {editId === entry.id ? (
//                   <input
//                     type="text"
//                     value={editItem}
//                     onChange={(e) => setEditItem(e.target.value)}
//                     className="border p-1"
//                   />
//                 ) : (
//                   entry.item
//                 )}
//               </td>
//               <td className="border p-2">
//                 {editId === entry.id ? (
//                   <select
//                     value={editType}
//                     onChange={(e) => setEditType(e.target.value)}
//                     className="border p-1"
//                   >
//                     <option value="IN">IN</option>
//                     <option value="OUT">OUT</option>
//                   </select>
//                 ) : (
//                   <span
//                     className={`font-bold ${
//                       entry.type === "IN" ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {entry.type}
//                   </span>
//                 )}
//               </td>
//               <td className="border p-2">
//                 {editId === entry.id ? (
//                   <input
//                     type="number"
//                     value={editQty}
//                     onChange={(e) => setEditQty(e.target.value)}
//                     className="border p-1 w-20"
//                   />
//                 ) : (
//                   entry.qty
//                 )}
//               </td>
//               <td className="border p-2">
//                 {editId === entry.id ? (
//                   <input
//                     type="text"
//                     value={editLinkedTo}
//                     onChange={(e) => setEditLinkedTo(e.target.value)}
//                     className="border p-1"
//                   />
//                 ) : (
//                   entry.linkedTo
//                 )}
//               </td>
//               <td className="border p-2">{entry.date}</td>
//               <td className="border p-2 flex gap-2">
//                 {editId === entry.id ? (
//                   <>
//                     <Button
//                       onClick={handleSave}
//                       className="bg-green-500 text-white"
//                     >
//                       <Save className="h-4 w-4 mr-1" /> 
//                       {/* Save */}
//                     </Button>
//                     <Button
//                       onClick={() => setEditId(null)}
//                       className="bg-gray-400 text-white"
//                     >
//                       <X className="h-4 w-4 mr-1" /> 
//                       {/* Cancel */}
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <Button
//                       onClick={() => handleEdit(entry)}
//                       className="bg-yellow-500 text-white"
//                     >
//                       <Edit className="h-4 w-4 mr-1" /> Edit
//                     </Button>
//                     <Button
//                       onClick={() => handleDelete(entry.id)}
//                       className="bg-red-500 text-white"
//                     >
//                       <Trash2 className="h-4 w-4 mr-1" /> Delete
//                     </Button>
//                   </>
//                 )}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default StockMovements;





// 1 Code check
// import React, { useState, useEffect } from "react";
// import { SaveAllIcon, Trash2 } from "lucide-react";
// import Card from "@/components/ui/Card";
// // import { Button } from "@/components/ui/button";
// import Button  from "@/components/ui/Button"

// const StockMovements = () => {
//   const [rows, setRows] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [items, setItems] = useState([]);

//   // ✅ Load from localStorage (Job Sheet)
//   useEffect(() => {
//     const jobSheetEstimate = JSON.parse(localStorage.getItem("jobSheetEstimate")) || [];
//     const extraWork = JSON.parse(localStorage.getItem("extraWork")) || [];

//     // combine and extract unique categories & items
//     const combined = [...jobSheetEstimate, ...extraWork];

//     const uniqueCategories = [...new Set(combined.map((row) => row.category || ""))].filter(Boolean);
//     const uniqueItems = [...new Set(combined.map((row) => row.item || ""))].filter(Boolean);

//     setCategories(uniqueCategories);
//     setItems(uniqueItems);

//     // Load stock movement data (if saved before)
//     const savedRows = JSON.parse(localStorage.getItem("stockMovements")) || [];
//     setRows(savedRows);
//   }, []);

//   // ✅ Save rows to localStorage
//   const saveToLocalStorage = (updatedRows) => {
//     localStorage.setItem("stockMovements", JSON.stringify(updatedRows));
//   };

//   // ✅ Add Row
//   const handleAddRow = () => {
//     const newRow = {
//       date: "",
//       item: "",
//       qty: "",
//       linkedTo: "",
//       remarks: "",
//     };
//     const updatedRows = [...rows, newRow];
//     setRows(updatedRows);
//     saveToLocalStorage(updatedRows);
//   };

//   // ✅ Delete Row
//   const handleDeleteRow = (index) => {
//     const updatedRows = rows.filter((_, i) => i !== index);
//     setRows(updatedRows);
//     saveToLocalStorage(updatedRows);
//   };

//   // ✅ Update Row
//   const handleChange = (index, field, value) => {
//     const updatedRows = [...rows];
//     updatedRows[index][field] = value;
//     setRows(updatedRows);
//     saveToLocalStorage(updatedRows);
//   };

//   return (
//     <Card className="p-4 mt-2">
//       <h2 className="text-lg font-semibold mb-4">📦 Stock Movements</h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300 text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border p-2">Date</th>
//               <th className="border p-2">Item</th>
//               {/* <th className="border p-2">Qty</th> */}
//               <th className="border p-2">Linked To (Category)</th>
//               {/* <th className="border p-2">Remarks</th> */}
//               <th className="border p-2 w-[100px]">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((row, index) => (
//               <tr key={index} className="hover:bg-gray-50">
//                 <td className="border p-2">
//                   <input
//                     type="date"
//                     value={row.date}
//                     onChange={(e) => handleChange(index, "date", e.target.value)}
//                     className="w-full border rounded px-2 py-1"
//                   />
//                 </td>
//                 <td className="border p-2">
//                   <input
//                     list="itemsList"
//                     value={row.item}
//                     onChange={(e) => handleChange(index, "item", e.target.value)}
//                     className="w-full border rounded px-2 py-1"
//                     placeholder="Select Item"
//                   />
//                   <datalist id="itemsList">
//                     {items.map((it, i) => (
//                       <option key={i} value={it} />
//                     ))}
//                   </datalist>
//                 </td>
                
//                 <td className="border p-2">
//                   <input
//                     list="categoriesList"
//                     value={row.linkedTo}
//                     onChange={(e) => handleChange(index, "linkedTo", e.target.value)}
//                     className="w-full border rounded px-2 py-1"
//                     placeholder="Select Category"
//                   />
//                   <datalist id="categoriesList">
//                     {categories.map((cat, i) => (
//                       <option key={i} value={cat} />
//                     ))}
//                   </datalist>
//                 </td>
              
//                 <td className="border p-2 text-center">
//                   <Button
//                     variant="destructive"
//                     size="sm"
//                     onClick={() => handleDeleteRow(index)}
//                   >

//                     <Trash2 className="text-red-900"/>


//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-between mt-4">
//         <Button onClick={handleAddRow} className="bg-blue-600 text-white">
//           + Add Row
//         </Button>
//         <Button
//           onClick={() => saveToLocalStorage(rows)}
//           className="text-white"
//         ><SaveAllIcon/>
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default StockMovements;




// import React, { useState, useEffect } from "react";
// import { SaveAllIcon, Trash2 } from "lucide-react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";

// const StockMovements = () => {
//   const [rows, setRows] = useState([]);

//   // ✅ Load from JobSheet (estimate + extraWork)
//   useEffect(() => {
//     const jobSheetEstimate = JSON.parse(localStorage.getItem("jobSheetEstimate")) || [];
//     const extraWork = JSON.parse(localStorage.getItem("extraWork")) || [];

//     const combined = [...jobSheetEstimate, ...extraWork];

//     // ✅ Transform JobSheet data into StockMovements format
//     const transformedRows = combined.map((r) => ({
//       date: new Date().toISOString().split("T")[0],
//       type: "In",
//       item: r.item || "",
//       linkedTo: r.category || "",
//       qty: r.qty || r.quantity || "",
//       cost: r.rate || r.cost || "",
//       total: (r.qty || r.quantity || 0) * (r.rate || r.cost || 0),
//       referral: r.jobSheetNo || "JobSheet",
//     }));

//     setRows(transformedRows);
//     localStorage.setItem("stockMovements", JSON.stringify(transformedRows));
//   }, []);

//   // ✅ Handle type change
//   const handleChangeType = (index, value) => {
//     const updated = [...rows];
//     updated[index].type = value;
//     setRows(updated);
//     localStorage.setItem("stockMovements", JSON.stringify(updated));
//   };

//   // ✅ Handle delete row
//   const handleDelete = (index) => {
//     const updated = rows.filter((_, i) => i !== index);
//     setRows(updated);
//     localStorage.setItem("stockMovements", JSON.stringify(updated));
//   };

//   // ✅ Save manually (optional)
//   const saveToLocalStorage = () => {
//     localStorage.setItem("stockMovements", JSON.stringify(rows));
//   };

//   return (
//     <Card className="p-4 mt-2">
//       <h2 className="text-lg font-semibold mb-4">📦 Stock Movements</h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300 text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border p-2">Date</th>
//               <th className="border p-2">Type</th>
//               <th className="border p-2">Item</th>
//               <th className="border p-2">Category</th>
//               <th className="border p-2 text-right">Qty</th>
//               <th className="border p-2 text-right">Cost</th>
//               <th className="border p-2 text-right">Total</th>
//               <th className="border p-2">Referral (JobSheet)</th>
//               <th className="border p-2 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.length === 0 ? (
//               <tr>
//                 <td colSpan="9" className="text-center p-3 text-gray-500">
//                   No Stock Movement Data Found
//                 </td>
//               </tr>
//             ) : (
//               rows.map((row, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="border p-2 text-center">{row.date}</td>

//                   <td className="border p-2">
//                     <select
//                       value={row.type}
//                       onChange={(e) => handleChangeType(index, e.target.value)}
//                       className="w-full border rounded px-2 py-1"
//                     >
//                       <option value="In">In</option>
//                       <option value="Out">Out</option>
//                     </select>
//                   </td>

//                   <td className="border p-2">{row.item}</td>
//                   <td className="border p-2">{row.linkedTo}</td>
//                   <td className="border p-2 text-right">{row.qty}</td>
//                   <td className="border p-2 text-right">{row.cost}</td>
//                   <td className="border p-2 text-right">{row.total?.toFixed(2)}</td>
//                   <td className="border p-2">{row.referral}</td>

//                   {/* ✅ Delete Button */}
//                   <td className="border p-2 text-center">
//                     <button
//                       onClick={() => handleDelete(index)}
//                       className="text-red-600 hover:text-red-800"
//                       title="Delete Row"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-end mt-4">
//         <Button onClick={saveToLocalStorage} className="bg-green-600 text-white">
//           <SaveAllIcon className="mr-2" /> Save All
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default StockMovements;






// import React, { useState, useEffect } from "react";
// import { SaveAllIcon, Trash2 } from "lucide-react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";

// const StockMovements = () => {
//   const [rows, setRows] = useState([]);

//   // ✅ Load from JobSheet (estimate + extraWork) with correct Cost & Total
//   useEffect(() => {
//     const jobSheetEstimate = JSON.parse(localStorage.getItem("jobSheetEstimate")) || [];
//     const extraWork = JSON.parse(localStorage.getItem("extraWork")) || [];

//     const combined = [...jobSheetEstimate, ...extraWork];

//     const transformedRows = combined.map((r) => {
//       const qty = parseFloat(r.qty || r.quantity || 0);
//       const cost = parseFloat(r.rate || r.cost || 0);
//       return {
//         date: new Date().toISOString().split("T")[0],
//         type: "In",
//         item: r.item || "",
//         linkedTo: r.category || "",
//         qty: qty,
//         cost: cost,
//         total: (qty * cost).toFixed(2),
//         referral: r.jobSheetNo || "JobSheet",
//       };
//     });

//     setRows(transformedRows);
//     localStorage.setItem("stockMovements", JSON.stringify(transformedRows));
//   }, []);

//   // ✅ Handle manual type change
//   const handleChangeType = (index, value) => {
//     const updated = [...rows];
//     updated[index].type = value;
//     setRows(updated);
//     localStorage.setItem("stockMovements", JSON.stringify(updated));
//   };

//   // ✅ Delete row
//   const handleDelete = (index) => {
//     const updated = rows.filter((_, i) => i !== index);
//     setRows(updated);
//     localStorage.setItem("stockMovements", JSON.stringify(updated));
//   };

//   // ✅ Save manually (optional)
//   const saveToLocalStorage = () => {
//     localStorage.setItem("stockMovements", JSON.stringify(rows));
//   };

//   return (
//     <Card className="p-4 mt-2">
//       <h2 className="text-lg font-semibold mb-4">📦 Stock Movements</h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300 text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border p-2">Date</th>
//               <th className="border p-2">Type</th>
//               <th className="border p-2">Item</th>
//               <th className="border p-2">Category</th>
//               <th className="border p-2 text-right">Qty</th>
//               <th className="border p-2 text-right">Cost</th>
//               <th className="border p-2 text-right">Total</th>
//               <th className="border p-2">Referral (JobSheet)</th>
//               <th className="border p-2 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.length === 0 ? (
//               <tr>
//                 <td colSpan="9" className="text-center p-3 text-gray-500">
//                   No Stock Movement Data Found
//                 </td>
//               </tr>
//             ) : (
//               rows.map((row, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="border p-2 text-center">{row.date}</td>

//                   <td className="border p-2">
//                     <select
//                       value={row.type}
//                       onChange={(e) => handleChangeType(index, e.target.value)}
//                       className="w-full border rounded px-2 py-1"
//                     >
//                       <option value="In">In</option>
//                       <option value="Out">Out</option>
//                     </select>
//                   </td>

//                   <td className="border p-2">{row.item}</td>
//                   <td className="border p-2">{row.linkedTo}</td>
//                   <td className="border p-2 text-right">{row.qty}</td>
//                   <td className="border p-2 text-right">{row.cost}</td>
//                   <td className="border p-2 text-right">{row.total}</td>
//                   <td className="border p-2">{row.referral}</td>

//                   {/* ✅ Delete Button */}
//                   <td className="border p-2 text-center">
//                     <button
//                       onClick={() => handleDelete(index)}
//                       className="text-red-600 hover:text-red-800"
//                       title="Delete Row"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-end mt-4">
//         <Button onClick={saveToLocalStorage} className="bg-green-600 text-white">
//           <SaveAllIcon className="mr-2" /> Save All
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default StockMovements;






// import React, { useState, useEffect } from "react";
// import { SaveAllIcon, Trash2 } from "lucide-react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";

// const StockMovements = () => {
//   const [rows, setRows] = useState([]);

//   // ✅ Load from JobSheet (estimate + extraWork) with correct Cost & Total
//   useEffect(() => {
//     const jobSheetEstimate = JSON.parse(localStorage.getItem("jobSheetEstimate")) || [];
//     const extraWork = JSON.parse(localStorage.getItem("extraWork")) || [];

//     const combined = [...jobSheetEstimate, ...extraWork];

//     const transformedRows = combined.map((r) => {
//       const qty = parseFloat(r.qty || r.quantity || 0);
//       const cost = parseFloat(r.rate || r.cost || 0);
//       const total = qty * cost; // keep as number
//       return {
//         date: new Date().toISOString().split("T")[0],
//         type: "In",
//         item: r.item || "",
//         linkedTo: r.category || "",
//         qty,
//         cost,
//         total,
//         referral: r.jobSheetNo || "JobSheet",
//       };
//     });

//     setRows(transformedRows);
//     localStorage.setItem("stockMovements", JSON.stringify(transformedRows));
//   }, []);

//   // ✅ Handle manual type change
//   const handleChangeType = (index, value) => {
//     const updated = [...rows];
//     updated[index].type = value;
//     setRows(updated);
//     localStorage.setItem("stockMovements", JSON.stringify(updated));
//   };

//   // ✅ Delete row
//   const handleDelete = (index) => {
//     const updated = rows.filter((_, i) => i !== index);
//     setRows(updated);
//     localStorage.setItem("stockMovements", JSON.stringify(updated));
//   };

//   // ✅ Save manually (optional)
//   const saveToLocalStorage = () => {
//     localStorage.setItem("stockMovements", JSON.stringify(rows));
//   };

//   return (
//     <Card className="p-4 mt-2">
//       <h2 className="text-lg font-semibold mb-4">📦 Stock Movements</h2>

//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-300 text-sm">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="border p-2">Date</th>
//               <th className="border p-2">Type</th>
//               <th className="border p-2">Item</th>
//               <th className="border p-2">Category</th>
//               <th className="border p-2 text-right">Qty</th>
//               <th className="border p-2 text-right">Cost</th>
//               <th className="border p-2 text-right">Total</th>
//               <th className="border p-2">Referral (JobSheet)</th>
//               <th className="border p-2 text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.length === 0 ? (
//               <tr>
//                 <td colSpan="9" className="text-center p-3 text-gray-500">
//                   No Stock Movement Data Found
//                 </td>
//               </tr>
//             ) : (
//               rows.map((row, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   <td className="border p-2 text-center">{row.date}</td>

//                   <td className="border p-2">
//                     <select
//                       value={row.type}
//                       onChange={(e) => handleChangeType(index, e.target.value)}
//                       className="w-full border rounded px-2 py-1"
//                     >
//                       <option value="In">In</option>
//                       <option value="Out">Out</option>
//                     </select>
//                   </td>

//                   <td className="border p-2">{row.item}</td>
//                   <td className="border p-2">{row.linkedTo}</td>
//                   <td className="border p-2 text-right">{row.qty}</td>
//                   <td className="border p-2 text-right">{row.cost}</td>
//                   <td className="border p-2 text-right">{row.total.toFixed(2)}</td>
//                   <td className="border p-2">{row.referral}</td>

//                   {/* ✅ Delete Button */}
//                   <td className="border p-2 text-center">
//                     <button
//                       onClick={() => handleDelete(index)}
//                       className="text-red-600 hover:text-red-800"
//                       title="Delete Row"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-end mt-4">
//         <Button onClick={saveToLocalStorage} className="bg-green-600 text-white">
//           <SaveAllIcon className="mr-2" /> Save All
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default StockMovements;


import React, { useState, useEffect } from "react";
import { SaveAllIcon, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const StockMovements = () => {
  const [rows, setRows] = useState([]);

  // Load from JobSheet (estimate + extraWork) with robust cost/total logic
  useEffect(() => {
    const jobSheetEstimate = JSON.parse(localStorage.getItem("jobSheetEstimate")) || [];
    const extraWork = JSON.parse(localStorage.getItem("extraWork")) || [];

    const combined = [...jobSheetEstimate, ...extraWork];

    const transformedRows = combined.map((r) => {
      // normalize numeric inputs
      const qty = Number.isFinite(parseFloat(r.qty)) ? parseFloat(r.qty) : (Number.isFinite(parseFloat(r.quantity)) ? parseFloat(r.quantity) : 0);
      const cost = Number.isFinite(parseFloat(r.cost)) ? parseFloat(r.cost) : (Number.isFinite(parseFloat(r.rate)) ? parseFloat(r.rate) : 0);
      const multiplier =
        Number.isFinite(parseFloat(r.multiplier)) ? parseFloat(r.multiplier) :
        Number.isFinite(parseFloat(r.mul)) ? parseFloat(r.mul) :
        0;

      // priority for total:
      // 1) if row.total provided and numeric -> use it
      // 2) else if multiplier present -> cost * multiplier (JobSheet style)
      // 3) else if qty present -> cost * qty
      // 4) else fallback to cost
      let totalValue = 0;
      if (Number.isFinite(parseFloat(r.total))) {
        totalValue = parseFloat(r.total);
      } else if (multiplier > 0) {
        totalValue = cost * multiplier;
      } else if (qty > 0) {
        totalValue = cost * qty;
      } else {
        totalValue = cost;
      }

      return {
        // keep raw numbers so we can format when rendering
        date: new Date().toISOString().split("T")[0],
        type: "In",
        item: r.item || "",
        linkedTo: r.category || r.linkedTo || "",
        qty: qty,     // number (0 if not provided)
        cost: cost,   // number
        total: totalValue, // number
        referral: r.jobSheetNo || r.referral || "JobSheet",
      };
    });

    setRows(transformedRows);
    localStorage.setItem("stockMovements", JSON.stringify(transformedRows));
  }, []);

  // Handle manual type change (In/Out)
  const handleChangeType = (index, value) => {
    const updated = [...rows];
    updated[index].type = value;
    setRows(updated);
    localStorage.setItem("stockMovements", JSON.stringify(updated));
  };

  // Delete row -> update state + localStorage
  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this stock row?")) return;
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    localStorage.setItem("stockMovements", JSON.stringify(updated));
  };

  // Save manually (optional)
  const saveToLocalStorage = () => {
    localStorage.setItem("stockMovements", JSON.stringify(rows));
    alert("✅ Stock Movements saved.");
  };

  return (
    <Card className="p-4 mt-2">
      <h2 className="text-lg font-semibold mb-4">📦 Stock Movements</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Item</th>
              <th className="border p-2">Category</th>
              <th className="border p-2 text-right">Qty</th>
              <th className="border p-2 text-right">Cost</th>
              <th className="border p-2 text-right">Total</th>
              <th className="border p-2">Referral (JobSheet)</th>
              <th className="border p-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-3 text-gray-500">
                  No Stock Movement Data Found
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{row.date}</td>

                  <td className="border p-2">
                    <select
                      value={row.type}
                      onChange={(e) => handleChangeType(index, e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="In">In</option>
                      <option value="Out">Out</option>
                    </select>
                  </td>

                  <td className="border p-2">{row.item}</td>
                  <td className="border p-2">{row.linkedTo}</td>

                  <td className="border p-2 text-right">{Number.isFinite(row.qty) ? row.qty : "-"}</td>
                  <td className="border p-2 text-right">{Number.isFinite(row.cost) ? row.cost.toFixed(2) : "-"}</td>
                  <td className="border p-2 text-right">{Number.isFinite(row.total) ? row.total.toFixed(2) : "-"}</td>
                  <td className="border p-2">{row.referral}</td>

                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Row"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4">
        <Button onClick={saveToLocalStorage} className="bg-green-600 text-white">
          <SaveAllIcon className="mr-2" /> Save All
        </Button>
      </div>
    </Card>
  );
};

export default StockMovements;


