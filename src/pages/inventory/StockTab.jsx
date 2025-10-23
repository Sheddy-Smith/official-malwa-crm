// //   working code // owner-code-run
// import { useState } from 'react';
// import useInventoryStore from '@/store/inventoryStore';
// import Button from '@/components/ui/Button';
// import Modal from '@/components/ui/Modal';
// import { toast } from 'sonner';
// import { Edit, Trash2, PlusCircle } from 'lucide-react';
// import ConfirmModal from '@/components/ui/ConfirmModal';

// const StockForm = ({ item, onSave, onCancel  }) => {
//     // Zustand Store se Categories
//      const { categories } = useInventoryStore();

// //    Ek state variable banaya formData ke naam se.
//     const [formData, setFormData] = useState(item || { name: '', categoryId: '', unit: 'pcs', quantity: 0, rate: 0 });
// // Ye har input field ke liye onChange handler hai.
//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!formData.name || !formData.quantity || !formData.rate) return toast.error("All fields are required.");
//         onSave(formData);
//     };
//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             {/* iteam name */}
//             <div><label>Item Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>

//   {/* categories working code */}  
// <div><label>Category</label><select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red">{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>





             
//   {/* unit */}
//             <div><label>Unit (kg/ltr/pcs)</label><input type="text" name="unit" value={formData.unit} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
 
//                   {/* Quantity */}
//             <div><label>Quantity</label><input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
     
//                {/* Rate */}
//             <div><label>Rate (Avg)</label><input type="number" name="rate" value={formData.rate} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
                      
//                       {/* save iteam */}
//             <div className="flex justify-end space-x-2">
//                 <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
//             <Button type="submit">Save Item</Button>
//             </div>

//         </form>
//     );
// };

// const StockTab = () => {
//     // useState
//     const { stockItems, categories, addStockItem, updateStockItem, deleteStockItem } = useInventoryStore();
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingItem, setEditingItem] = useState(null);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//     const [itemToDelete, setItemToDelete] = useState(null);

//     // Function handleSave
//     const handleSave = (itemData) => {
//         if (editingItem) {
//             updateStockItem({ ...editingItem, ...itemData });
//             toast.success("Stock item updated!");
//         } else {
//             addStockItem(itemData);
//             toast.success("New stock item added!");
//         }
//         setIsModalOpen(false);
//     };
//             // handleDelete
//     const handleDelete = (item) => {
//         setItemToDelete(item);
//         setIsDeleteModalOpen(true);
//     };

//         //    confirmDelete
//     const confirmDelete = () => {
//         deleteStockItem(itemToDelete.id);
//         toast.success("Stock item deleted.");
//         setIsDeleteModalOpen(false);
//     }

//     // change the function
//     const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'N/A';

//  return (
//         <div>
//             {/* <Modal> component function */}
//             <Modal isOpen={isModalOpen}
//              onClose={() => setIsModalOpen(false)}
//               title={editingItem ? "Edit Stock Item" : "Add Stock Item"}>
//                 <StockForm item={editingItem}
//              onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
//             </Modal>

//             {/* <ConfirmModal> cancel btn component function */}
//              <ConfirmModal
//                 isOpen={isDeleteModalOpen}
//                 onClose={() => setIsDeleteModalOpen(false)}
//                 onConfirm={confirmDelete}
//                 title="Delete Stock Item"
//                 message={`Are you sure you want to delete ${itemToDelete?.name}?`}
//             />
//                     {/* Add Stock Item btn ke bare me  */}
//             <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-bold dark:text-dark-text">Stock List</h3>
//                 <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
//                     <PlusCircle className="h-4 w-4 mr-2" />Add Stock Item</Button>
//             </div>
             
//              {/* list of iteam */}
//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm dark:text-dark-text-secondary">
//                     <thead className="bg-gray-50 dark:bg-gray-700 text-left">
//                         <tr><th className="p-2">Item</th>
//                         <th className="p-2">Category</th>
//                         <th className="p-2">Qty</th>
//                         <th className="p-2">Avg Rate</th>
//                         <th className="p-2">Valuation</th>
//                         <th className="p-2 text-right">Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                           {stockItems.length > 0 ? stockItems.map(item => (
//                             <tr key={item.id} className="border-b dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800/50">
//                                 <td className="p-2 font-medium dark:text-dark-text">{item.name}</td><td className="p-2">{getCategoryName(item.categoryId)}</td>
//                                 <td className="p-2">{item.quantity} {item.unit}</td>
//                                 <td className="p-2">{parseFloat(item.rate).toLocaleString('en-IN')}</td>
//                                 <td className="p-2">{(item.quantity * item.rate).toLocaleString('en-IN')}</td>

//                                 <td className="p-2 text-right space-x-1">
//                                     {/* Edit btn */}
//                                     <Button variant="ghost" className="p-1 h-auto"
//                                      onClick={() => { setEditingItem(item); setIsModalOpen(true); }}>
//                                         <Edit className="h-4 w-4 text-blue-600"/></Button>
//                                         {/* Delet btn */}
//                                     <Button variant="ghost" className="p-1 h-auto" onClick={() => handleDelete(item)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
//                                  </td>
//                             </tr>
//                         )) : (
//                             <tr><td colSpan="6" className="text-center p-8 text-gray-500 dark:text-dark-text-secondary">No stock items found.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default StockTab;


//  experimant code !! sucessful

// import React, { useState } from "react";
// const StockTab = ({ categories }) => {


// const [stockItems, setStockItems] = useState([
//     { item: "", category: "", qty: 0, rate: 0, valuation: 0 },
//   ]);

//   const handleAddRow = () => {
//     setStockItems([
//       ...stockItems,
//       { item: "", category: "", qty: 0, rate: 0, valuation: 0 },
//     ]);
//   };

//   const handleDeleteRow = (index) => {
//     const updated = stockItems.filter((_, i) => i !== index);
//     setStockItems(updated);
//   };

//   const handleChange = (index, field, value) => {
//     const updated = stockItems.map((row, i) => {
//       if (i === index) {
//         const newRow = { ...row, [field]: value };
//         if (field === "qty" || field === "rate") {
//           const qty = field === "qty" ? Number(value) : Number(row.qty);
//           const rate = field === "rate" ? Number(value) : Number(row.rate);
//           newRow.valuation = qty * rate;
//         }
//         return newRow;
//       }
//       return row;
//     });
//     setStockItems(updated);
//   };

//   return (
   
// <div className="p-4 border rounded mt-4">
//       <h2 className="text-xl font-bold mb-4">Stock Tab</h2>

//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">S.No</th>
//             <th className="border p-2">Item</th>
//             <th className="border p-2">Category</th>
//             <th className="border p-2">Qty</th>
//             <th className="border p-2">Rate</th>
//             <th className="border p-2">Valuation</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stockItems.map((row, index) => (
//             <tr key={index} className="even:bg-gray-50">
//               <td className="border p-2">{index + 1}</td>
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   value={row.item}
//                   onChange={(e) => handleChange(index, "item", e.target.value)}
//                   className="border p-1 w-full"
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   list="category-list"
//                   value={row.category}
//                   onChange={(e) =>
//                     handleChange(index, "category", e.target.value)
//                   }
//                   className="border p-1 w-full"
//                 />
//                 <datalist id="category-list">
//                   {categories.map((cat, i) => (
//                     <option key={i} value={cat.name} />
//                   ))}
//                 </datalist>
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="number"
//                   value={row.qty}
//                   onChange={(e) => handleChange(index, "qty", e.target.value)}
//                   className="border p-1 w-full"
//                 />
//               </td>
//               <td className="border p-2">
//                 <input
//                   type="number"
//                   value={row.rate}
//                   onChange={(e) => handleChange(index, "rate", e.target.value)}
//                   className="border p-1 w-full"
//                 />
//               </td>
//               <td className="border p-2">{row.valuation}</td>
//               <td className="border p-2 flex gap-2">
//                 <button
//                   onClick={() => handleDeleteRow(index)}
//                   className="bg-red-500 text-white px-2"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <button
//         onClick={handleAddRow}
//         className="mt-4 bg-blue-500 text-white px-4 py-2"
//       >
//         Add Row
//       </button>
//     </div>


//   )
// }

// export default StockTab



// import React, { useState } from "react";

// const StockTab = ({ categories }) => {
//   // -----------------------------
//   // Stock Items state
//   // -----------------------------
//   const [stockItems, setStockItems] = useState([
//     { item: "", category: "", qty: 0, rate: 0, valuation: 0 },
//   ]);

//   // -----------------------------
//   // Example items per category
//   // Ye aap future me API ya localStorage se le sakte ho
//   // -----------------------------
//   const itemsByCategory = {
//     Parts: ["Brake Pad", "Clutch", "Gear"],
//     Labour: ["Painting", "Welding", "Polishing"],
//     Hardware: ["Nuts", "Bolts", "Screws"],
//     Steel: ["Beam", "Rod", "Sheet"],
//   };

//   // -----------------------------
//   // Add new row
//   // -----------------------------
//   const handleAddRow = () => {
//     setStockItems([
//       ...stockItems,
//       { item: "", category: "", qty: 0, rate: 0, valuation: 0 },
//     ]);
//   };

//   // -----------------------------
//   // Delete row
//   // -----------------------------
//   const handleDeleteRow = (index) => {
//     const updated = stockItems.filter((_, i) => i !== index);
//     setStockItems(updated);
//   };

//   // -----------------------------
//   // Handle change in any field
//   // -----------------------------
//   const handleChange = (index, field, value) => {
//     const updated = stockItems.map((row, i) => {
//       if (i === index) {
//         const newRow = { ...row, [field]: value };

//         // Auto calculate valuation if qty or rate changes
//         if (field === "qty" || field === "rate") {
//           const qty = field === "qty" ? Number(value) : Number(row.qty);
//           const rate = field === "rate" ? Number(value) : Number(row.rate);
//           newRow.valuation = qty * rate;
//         }

//         // Auto clear item if category changes
//         if (field === "category") {
//           newRow.item = ""; // category change -> reset item
//         }

//         return newRow;
//       }
//       return row;
//     });
//     setStockItems(updated);
//   };

//   return (
//     <div className="p-4 border rounded mt-4">
//       <h2 className="text-xl font-bold mb-4">Stock Tab</h2>

//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">S.No</th>
//             <th className="border p-2">Item</th>
//             <th className="border p-2">Category</th>
//             <th className="border p-2">Qty</th>
//             <th className="border p-2">Rate</th>
//             <th className="border p-2">Valuation</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {stockItems.map((row, index) => (
//             <tr key={index} className="even:bg-gray-50">
//               {/* S.No */}
//               <td className="border p-2">{index + 1}</td>

//               {/* Item Input */}
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   list={`items-${index}`} // unique datalist for each row
//                   value={row.item}
//                   onChange={(e) => handleChange(index, "item", e.target.value)}
//                   className="border p-1 w-full"
//                   placeholder="Type or select item"
//                 />
//                 <datalist id={`items-${index}`}>
//                   {row.category &&
//                     itemsByCategory[row.category]?.map((item, i) => (
//                       <option key={i} value={item} />
//                     ))}
//                 </datalist>
//               </td>

//               {/* Category Input */}
//               <td className="border p-2">
//                 <input
//                   type="text"
//                   list="category-list"
//                   value={row.category}
//                   onChange={(e) =>
//                     handleChange(index, "category", e.target.value)
//                   }
//                   className="border p-1 w-full"
//                   placeholder="Type or select category"
//                 />
//                 <datalist id="category-list">
//                   {categories?.map((cat, i) => (
//                     <option key={i} value={cat.name} />
//                   ))}
//                 </datalist>
//               </td>

//               {/* Quantity */}
//               <td className="border p-2">
//                 <input
//                   type="number"
//                   value={row.qty}
//                   onChange={(e) => handleChange(index, "qty", e.target.value)}
//                   className="border p-1 w-full"
//                 />
//               </td>

//               {/* Rate */}
//               <td className="border p-2">
//                 <input
//                   type="number"
//                   value={row.rate}
//                   onChange={(e) => handleChange(index, "rate", e.target.value)}
//                   className="border p-1 w-full"
//                 />
//               </td>

//               {/* Valuation */}
//               <td className="border p-2">{row.valuation}</td>

//               {/* Actions */}
//               <td className="border p-2 flex gap-2">
//                 <button
//                   onClick={() => handleDeleteRow(index)}
//                   className="bg-red-500 text-white px-2 rounded"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Add Row Button */}
//       <button
//         onClick={handleAddRow}
//         className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Add Row
//       </button>
//     </div>
//   );
// };

// export default StockTab;






// ye direct job sheet se aa raha hai.
import React, { useState, useEffect } from "react";
import { SaveAllIcon, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const StockTab = () => {
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

export default StockTab;


