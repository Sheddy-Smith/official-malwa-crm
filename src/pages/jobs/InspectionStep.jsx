// import { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";
// import useJobsStore from "@/store/jobsStore";
// import useInventoryStore from "@/store/inventoryStore";
// import { toast } from "sonner";
// import ConfirmModal from "@/components/ui/ConfirmModal";

// // Editable Row for Inspection Items
// const EditableRow = ({ item, onSave, onCancel, onDelete }) => {
//     const { stockItems } = useInventoryStore();
//     const [isEditing, setIsEditing] = useState(item.id === 'new');
//     const [data, setData] = useState(item);
//     const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//     const handleEdit = () => setIsEditing(true);
//     const handleCancel = () => { setData(item); setIsEditing(false); onCancel(); };
//     const handleSave = () => {
//         if (!data.item || !data.cost || !data.category) return toast.error("Item, Category and Cost are required.");
//         onSave(data);
//         setIsEditing(false);
//     };
//     const handleChange = e => setData(prev => ({...prev, [e.target.name]: e.target.value}));

//     if (isEditing) {
//         return (
//              <tr className="bg-blue-50 dark:bg-blue-900/20">
//                 <td className="p-2">
//                     <input type="text" name="item" value={data.item} onChange={handleChange} list="inventory-items" className="w-full p-1 border rounded-lg bg-transparent dark:text-dark-text dark:border-gray-600 focus:ring-2 focus:ring-brand-red" placeholder="e.g., Bumper Repair"/>
//                     <datalist id="inventory-items">
//                         {stockItems.map(stock => <option key={stock.id} value={stock.name} />)}
//                     </datalist>
//                 </td>
//                  <td className="p-2">
//                     <select name="category" value={data.category} onChange={handleChange} className="w-full p-1 border rounded-lg bg-transparent dark:text-dark-text dark:border-gray-600 focus:ring-2 focus:ring-brand-red">
//                         <option value="">Select</option><option value="Parts">Parts</option><option value="Labour">Labour</option><option value="Hardware">Hardware</option><option value="Steel">Steel</option>
//                     </select>
//                 </td>
//                 <td className="p-2"><select name="condition" value={data.condition} onChange={handleChange} className="w-full p-1 border rounded-lg bg-transparent dark:text-dark-text dark:border-gray-600 focus:ring-2 focus:ring-brand-red"><option>OK</option><option>Repair Needed</option><option>Replace</option></select></td>
//                 <td className="p-2"><input type="number" name="cost" value={data.cost} onChange={handleChange} className="w-24 p-1 border rounded-lg bg-transparent dark:text-dark-text dark:border-gray-600 focus:ring-2 focus:ring-brand-red"/></td>
//                 <td className="p-2 text-right space-x-1"><Button variant="ghost" className="p-1 h-auto" onClick={handleSave}><Save className="h-4 w-4 text-green-600"/></Button><Button variant="ghost" className="p-1 h-auto" onClick={handleCancel}><X className="h-4 w-4 text-gray-600 dark:text-gray-400"/></Button></td>
//             </tr>
//         );
//     }
//     return (
//         <>
//             <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={() => { onDelete(item.id); setIsDeleteModalOpen(false); }} title="Delete Item" message={`Delete "${item.item}"?`}/>
//             <tr className="border-b dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800/50"><td className="p-2 font-medium">{item.item}</td><td className="p-2">{item.category}</td><td className="p-2">{item.condition}</td><td className="p-2">{parseFloat(item.cost).toLocaleString('en-IN')}</td><td className="p-2 text-right space-x-1"><Button variant="ghost" className="p-1 h-auto" onClick={handleEdit}><Edit className="h-4 w-4 text-blue-600"/></Button><Button variant="ghost" className="p-1 h-auto" onClick={() => setIsDeleteModalOpen(true)}><Trash2 className="h-4 w-4 text-red-500"/></Button></td></tr>
//         </>
//     );
// };

// // Main Component
// const InspectionStep = ({ jobId }) => {
//     const { jobs, updateJobDetails, addInspectionItem, updateInspectionItem, deleteInspectionItem } = useJobsStore();
//     const job = jobs[jobId];
//     const [newItem, setNewItem] = useState(null);
//     const [details, setDetails] = useState(job);

//     useEffect(() => setDetails(job), [job]);
//     const handleDetailChange = e => setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
//     const handleSaveDetails = () => { updateJobDetails(jobId, details); toast.success("Vehicle details updated!"); };

//     const handleAddNewRow = () => setNewItem({ id: 'new', item: '', category: 'Parts', condition: 'OK', cost: '0' });

//     const handleSaveNewItem = itemData => { addInspectionItem(jobId, { ...itemData, id: undefined }); toast.success("Item added!"); setNewItem(null); };

//     const handleDeleteItem = itemId => { deleteInspectionItem(jobId, itemId); toast.success("Item deleted."); };

//     if (!job) return <div>Loading...</div>;

//     return (
//         <div className="space-y-4 text-brand-dark dark:text-dark-text">
//             <h3 className="text-xl font-bold">Vehicle Inspection</h3>

//                                                {/* Card 1 */}
//             <Card>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                     <div><label className="font-medium text-gray-500">Vehicle No:</label><input type="text" name="vehicleNo" value={details.vehicleNo} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red"/></div>
//                     <div><label className="font-medium text-gray-500">Owner Name:</label><input type="text" name="ownerName" value={details.ownerName} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red"/></div>
//                     <div><label className="font-medium text-gray-500">Inspection Date:</label><input type="date" name="inspectionDate" value={details.inspectionDate} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red"/></div>
//                     <div><label className="font-medium text-gray-500">Branch:</label><input type="text" name="branch" value={details.branch} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red"/></div>
//                  </div>
//                 <div className="flex justify-end mt-4"><Button onClick={handleSaveDetails}><Save className="h-4 w-4 mr-2" />Save Details</Button></div>
//             </Card>
//                                                           {/* Card 2 */}
//              <Card title="Inspection Items">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                         <thead className="bg-gray-50 dark:bg-gray-700 text-left">
//                             <tr>
//                             <th className="p-2">Item</th>
//                             <th className="p-2">Category</th>
//                             <th className="p-2">Condition</th>
//                             <th className="p-2">Cost (₹)</th>
//                             <th className="p-2 text-right">Actions</th>
//                             </tr>
//                         </thead>
//                          <tbody>
//                             {job.inspection?.items.map(item => <EditableRow key={item.id} item={item}
//                             onSave={updated => updateInspectionItem(jobId, updated)}
//                             onDelete={handleDeleteItem}
//                              onCancel={() => {}}/>)}
//                             {newItem && <EditableRow item={newItem}
//                             onSave={handleSaveNewItem} onCancel={() => setNewItem(null)}/>}
//                          </tbody>
//                     </table>
//                      {job.inspection?.items.length === 0 && !newItem && <div className="text-center p-4 text-gray-500 dark:text-dark-text-secondary">No inspection items.</div>}
//                 </div>
//                 <div className="mt-4"><Button variant="secondary" onClick={handleAddNewRow} disabled={!!newItem}><PlusCircle className="h-4 w-4 mr-2"/> Add Item</Button></div>
//             </Card>
// </div>

//     );
// };
// export default InspectionStep;

// Easy Code

// import { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";
// import useJobsStore from "@/store/jobsStore";
// import useInventoryStore from "@/store/inventoryStore";
// import { toast } from "sonner";
// import ConfirmModal from "@/components/ui/ConfirmModal";

// // -----------------------------------
// // Editable Row Component
// // -----------------------------------
// const EditableRow = ({ item, onSave, onCancel, onDelete }) => {
//   const { stockItems } = useInventoryStore();

//   const [editData, setEditData] = useState(item); // current row data
//   const [isEditing, setIsEditing] = useState(item.id === "new"); // new row direct edit mode
//   const [showDelete, setShowDelete] = useState(false);

//   // handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({ ...prev, [name]: value }));
//   };

//   // save row
//   const handleSave = () => {
//     if (!editData.item || !editData.category || !editData.cost) {
//       return toast.error("Item, Category and Cost are required.");
//     }
//     onSave(editData);
//     setIsEditing(false);
//   };

//   // cancel edit
//   const handleCancel = () => {
//     setEditData(item);
//     setIsEditing(false);
//     onCancel();
//   };

//   // if row is in edit mode
//   if (isEditing) {
//     return (
//       <tr className="bg-blue-50 dark:bg-blue-900/20">
//         {/* Item Input */}
//         <td className="p-2">
//           <input
//             type="text"
//             name="item"
//             value={editData.item}
//             onChange={handleChange}
//             list="inventory-items"
//             placeholder="e.g., Bumper Repair"
//             className="w-full p-1 border rounded-lg bg-transparent dark:text-dark-text"
//           />
//           <datalist id="inventory-items">
//             {stockItems.map((s) => (
//               <option key={s.id} value={s.name} />
//             ))}
//           </datalist>
//         </td>

//         {/* Category Select */}
//         <td className="p-2">
//           <select
//             name="category"
//             value={editData.category}
//             onChange={handleChange}
//             className="w-full p-1 border rounded-lg bg-transparent dark:text-dark-text"
//           >
//             <option value="">Select</option>
//             <option value="Parts">Parts</option>
//             <option value="Labour">Labour</option>
//             <option value="Hardware">Hardware</option>
//             <option value="Steel">Steel</option>
//           </select>
//         </td>

//         {/* Condition */}
//         <td className="p-2">
//           <select
//             name="condition"
//             value={editData.condition}
//             onChange={handleChange}
//             className="w-full p-1 border rounded-lg bg-transparent dark:text-dark-text"
//           >
//             <option>OK</option>
//             <option>Repair Needed</option>
//             <option>Replace</option>
//           </select>
//         </td>

//         {/* Cost */}
//         <td className="p-2">
//           <input
//             type="number"
//             name="cost"
//             value={editData.cost}
//             onChange={handleChange}
//             className="w-24 p-1 border rounded-lg bg-transparent dark:text-dark-text"
//           />
//         </td>

//         {/* Save / Cancel */}
//         <td className="p-2 text-right space-x-1">
//           <Button variant="ghost" className="p-1 h-auto" onClick={handleSave}>
//             <Save className="h-4 w-4 text-green-600" />
//           </Button>
//           <Button variant="ghost" className="p-1 h-auto" onClick={handleCancel}>
//             <X className="h-4 w-4 text-gray-600" />
//           </Button>
//         </td>
//       </tr>
//     );
//   }

//   // if row is in display mode
//   return (
//     <>
//       <ConfirmModal
//         isOpen={showDelete}
//         onClose={() => setShowDelete(false)}
//         onConfirm={() => onDelete(item.id)}
//         title="Delete Item"
//         message={`Delete "${item.item}"?`}
//       />
//       <tr className="border-b">
//         <td className="p-2 font-medium">{item.item}</td>
//         <td className="p-2">{item.category}</td>
//         <td className="p-2">{item.condition}</td>
//         <td className="p-2">{parseFloat(item.cost).toLocaleString("en-IN")}</td>
//         <td className="p-2 text-right space-x-1">
//           <Button variant="ghost" className="p-1 h-auto" onClick={() => setIsEditing(true)}>
//             <Edit className="h-4 w-4 text-blue-600" />
//           </Button>
//           <Button variant="ghost" className="p-1 h-auto" onClick={() => setShowDelete(true)}>
//             <Trash2 className="h-4 w-4 text-red-500" />
//           </Button>
//         </td>
//       </tr>
//     </>
//   );
// };

// // -----------------------------------
// // Main Component
// // -----------------------------------
// const InspectionStep = ({ jobId }) => {
//   const { jobs, updateJobDetails, addInspectionItem, updateInspectionItem, deleteInspectionItem } =
//     useJobsStore();

//   const job = jobs[jobId]; // current job
//   const [details, setDetails] = useState(job); // vehicle details
//   const [newItem, setNewItem] = useState(null); // for adding new row

//   useEffect(() => setDetails(job), [job]);

//   // handle vehicle detail change
//   const handleDetailChange = (e) => {
//     const { name, value } = e.target;
//     setDetails((prev) => ({ ...prev, [name]: value }));
//   };

//   // save vehicle details
//   const handleSaveDetails = () => {
//     updateJobDetails(jobId, details);
//     toast.success("Vehicle details updated!");
//   };

//   // add new row
//   const handleAddNewRow = () => {
//     setNewItem({ id: "new", item: "", category: "Parts", condition: "OK", cost: "0" });
//   };

//   if (!job) return <div>Loading...</div>;

//   return (
//     <div className="space-y-4 text-brand-dark">
//       <h3 className="text-xl font-bold">Vehicle Inspection</h3>

//       {/* Card 1: Vehicle Details */}
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <label>Vehicle No:</label>
//             <input
//               type="text"
//               name="vehicleNo"
//               value={details.vehicleNo}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Owner Name:</label>
//             <input
//               type="text"
//               name="ownerName"
//               value={details.ownerName}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Inspection Date:</label>
//             <input
//               type="date"
//               name="inspectionDate"
//               value={details.inspectionDate}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Branch:</label>
//             <input
//               type="text"
//               name="branch"
//               value={details.branch}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//         </div>
//         <div className="flex justify-end mt-4">
//           <Button onClick={handleSaveDetails}>
//             <Save className="h-4 w-4 mr-2" /> Save Details
//           </Button>
//         </div>
//       </Card>

//       {/* Card 2: Inspection Items */}
//       <Card title="Inspection Items">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-2">Item</th>
//                 <th className="p-2">Category</th>
//                 <th className="p-2">Condition</th>
//                 <th className="p-2">Cost (₹)</th>
//                 <th className="p-2 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {job.inspection?.items.map((item) => (
//                 <EditableRow
//                   key={item.id}
//                   item={item}
//                   onSave={(updated) => updateInspectionItem(jobId, updated)}
//                   onDelete={(id) => deleteInspectionItem(jobId, id)}
//                   onCancel={() => {}}
//                 />
//               ))}
//               {newItem && (
//                 <EditableRow
//                   item={newItem}
//                   onSave={(data) => {
//                     addInspectionItem(jobId, { ...data, id: undefined });
//                     toast.success("Item added!");
//                     setNewItem(null);
//                   }}
//                   onCancel={() => setNewItem(null)}
//                 />
//               )}
//             </tbody>
//           </table>

//           {/* No items message */}
//           {job.inspection?.items.length === 0 && !newItem && (
//             <div className="text-center p-4 text-gray-500">No inspection items.</div>
//           )}
//         </div>

//         {/* Add Item Button */}
//         <div className="mt-4">
//           <Button variant="secondary" onClick={handleAddNewRow} disabled={!!newItem}>
//             <PlusCircle className="h-4 w-4 mr-2" /> Add Item
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default InspectionStep;

// Beginner level

// import { useState } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";

// // -----------------------------------
// // Inspection Step Component
// // -----------------------------------
// const InspectionStep = () => {
//   // Vehicle Details (Card 1)
//   const [details, setDetails] = useState({
//     vehicleNo: "",
//     ownerName: "",
//     inspectionDate: "",
//     branch: "",
//   });

//   // Inspection Items (Card 2)
//   const [items, setItems] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null); // konsa row edit ho raha hai
//   const [newItem, setNewItem] = useState(null); // naya row add ho raha hai

//   // Change vehicle details
//   const handleDetailChange = (e) => {
//     setDetails({ ...details, [e.target.name]: e.target.value });
//   };

//   // Save vehicle details
//   const saveDetails = () => {
//     console.log("Vehicle details:", details);
//     alert("Vehicle details saved!");
//   };

//   // Add new row
//   const addRow = () => {
//     setNewItem({ item: "", category: "Parts", condition: "OK", cost: "0" });
//   };

//   // Save new row
//   const saveNewRow = () => {
//     setItems([...items, newItem]);
//     setNewItem(null);
//   };

//   // Edit row
//   const editRow = (index) => {
//     setEditingIndex(index);
//   };

//   // Save edited row
//   const saveEditRow = (index) => {
//     setEditingIndex(null);
//   };

//   // Delete row
//   const deleteRow = (index) => {
//     const updated = items.filter((_, i) => i !== index);
//     setItems(updated);
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Vehicle Inspection</h3>

//       {/* Card 1: Vehicle Details */}
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <label>Vehicle No:</label>
//             <input
//               type="text"
//               name="vehicleNo"
//               value={details.vehicleNo}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Owner Name:</label>
//             <input
//               type="text"
//               name="ownerName"
//               value={details.ownerName}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Inspection Date:</label>
//             <input
//               type="date"
//               name="inspectionDate"
//               value={details.inspectionDate}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Branch:</label>
//             <input
//               type="text"
//               name="branch"
//               value={details.branch}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//         </div>
//         <div className="flex justify-end mt-4">
//           <Button onClick={saveDetails}>
//             <Save className="h-4 w-4 mr-2" /> Save Details
//           </Button>
//         </div>
//       </Card>

//       {/* Card 2: Inspection Items */}
//       <Card title="Inspection Items">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-2">Item</th>
//                 <th className="p-2">Category</th>
//                 <th className="p-2">Condition</th>
//                 <th className="p-2">Cost (₹)</th>
//                 <th className="p-2 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Existing Rows */}
//               {items.map((item, index) =>
//                 editingIndex === index ? (
//                   // If editing mode
//                   <tr key={index} className="bg-blue-50">
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.item}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].item = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <select
//                         value={item.category}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].category = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       >
//                         <option>Parts</option>
//                         <option>Labour</option>
//                         <option>Hardware</option>
//                         <option>Steel</option>
//                       </select>
//                     </td>
//                     <td className="p-2">
//                       <select
//                         value={item.condition}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].condition = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       >
//                         <option>OK</option>
//                         <option>Repair Needed</option>
//                         <option>Replace</option>
//                       </select>
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.cost}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].cost = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-24 p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button
//                         variant="ghost"
//                         className="p-1 h-auto"
//                         onClick={() => saveEditRow(index)}
//                       >
//                         <Save className="h-4 w-4 text-green-600" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         className="p-1 h-auto"
//                         onClick={() => setEditingIndex(null)}
//                       >
//                         <X className="h-4 w-4 text-gray-600" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ) : (
//                   // Normal display row
//                   <tr key={index}>
//                     <td className="p-2">{item.item}</td>
//                     <td className="p-2">{item.category}</td>
//                     <td className="p-2">{item.condition}</td>
//                     <td className="p-2">{item.cost}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button
//                         variant="ghost"
//                         className="p-1 h-auto"
//                         onClick={() => editRow(index)}
//                       >
//                         <Edit className="h-4 w-4 text-blue-600" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         className="p-1 h-auto"
//                         onClick={() => deleteRow(index)}
//                       >
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </td>
//                   </tr>
//                 )
//               )}

//               {/* New Row */}
//               {newItem && (
//                 <tr className="bg-blue-50">
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={newItem.item}
//                       onChange={(e) =>
//                         setNewItem({ ...newItem, item: e.target.value })
//                       }
//                       className="w-full p-1 border rounded-lg"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <select
//                       value={newItem.category}
//                       onChange={(e) =>
//                         setNewItem({ ...newItem, category: e.target.value })
//                       }
//                       className="w-full p-1 border rounded-lg"
//                     >
//                       <option>Parts</option>
//                       <option>Labour</option>
//                       <option>Hardware</option>
//                       <option>Steel</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <select
//                       value={newItem.condition}
//                       onChange={(e) =>
//                         setNewItem({ ...newItem, condition: e.target.value })
//                       }
//                       className="w-full p-1 border rounded-lg"
//                     >
//                       <option>OK</option>
//                       <option>Repair Needed</option>
//                       <option>Replace</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={newItem.cost}
//                       onChange={(e) =>
//                         setNewItem({ ...newItem, cost: e.target.value })
//                       }
//                       className="w-24 p-1 border rounded-lg"
//                     />
//                   </td>
//                   <td className="p-2 text-right space-x-1">
//                     <Button
//                       variant="ghost"
//                       className="p-1 h-auto"
//                       onClick={saveNewRow}
//                     >
//                       <Save className="h-4 w-4 text-green-600" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       className="p-1 h-auto"
//                       onClick={() => setNewItem(null)}
//                     >
//                       <X className="h-4 w-4 text-gray-600" />
//                     </Button>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* If no items */}
//           {items.length === 0 && !newItem && (
//             <div className="text-center p-4 text-gray-500">
//               No inspection items.
//             </div>
//           )}
//         </div>

//         {/* Add Button */}
//         <div className="mt-4">
//           <Button variant="secondary" onClick={addRow} disabled={!!newItem}>
//             <PlusCircle className="h-4 w-4 mr-2" /> Add Item
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default InspectionStep;

// Running code

// import { useState } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";

// const InspectionStep = () => {
//   // Vehicle Details
//   const [details, setDetails] = useState({
//     vehicleNo: "",
//     ownerName: "",
//     inspectionDate: "",
//     branch: "",
//   });

//   // Inspection Items
//   const [items, setItems] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [newItem, setNewItem] = useState(null);

//   // Category → Items mapping
//   const categoryItemsMap = {
//     Parts: ["Nut", "Bolt", "Screw"],
//     Labour: ["Mechanic Labour", "Painting Labour"],
//     Hardware: ["Hammer", "Wrench", "Screwdriver"],
//     Steel: ["Rod", "Sheet", "Pipe"],
//   };

//   // Vehicle Details change
//   const handleDetailChange = (e) => {
//     setDetails({ ...details, [e.target.name]: e.target.value });
//   };

//   const saveDetails = () => {
//     console.log("Vehicle details:", details);
//     alert("Vehicle details saved!");
//   };

//   // Add new row
//   const addRow = () => {
//     setNewItem({ item: "", category: "", itemsOptions: [], condition: "OK", cost: "0" });
//   };

//   // Save new row
//   const saveNewRow = () => {
//     setItems([...items, newItem]);
//     setNewItem(null);
//   };

//   // Edit row
//   const editRow = (index) => {
//     setEditingIndex(index);
//   };

//   // Save edited row
//   const saveEditRow = (index) => {
//     setEditingIndex(null);
//   };

//   // Delete row
//   const deleteRow = (index) => {
//     const updated = items.filter((_, i) => i !== index);
//     setItems(updated);
//   };

//   // Category change for newItem
//   const handleCategoryChange = (value) => {
//     const options = categoryItemsMap[value] || []; // get items for this category
//     setNewItem({ ...newItem, category: value, itemsOptions: options, item: options[0] || "" });
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Vehicle Inspection</h3>

//       {/* Card 1 * Vehicle Details */}
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <label>Vehicle No:</label>
//             <input
//               type="text"
//               name="vehicleNo"
//               value={details.vehicleNo}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Owner Name:</label>
//             <input
//               type="text"
//               name="ownerName"
//               value={details.ownerName}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Inspection Date:</label>
//             <input
//               type="date"
//               name="inspectionDate"
//               value={details.inspectionDate}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Branch:</label>
//             <input
//               type="text"
//               name="branch"
//               value={details.branch}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//         </div>
//         <div className="flex justify-end mt-4">
//           <Button onClick={saveDetails}>
//             <Save className="h-4 w-4 mr-2" /> Save Details
//           </Button>
//         </div>
//       </Card>


//       {/* Card 2 * Inspection Items */}
//       <Card title="Inspection Items">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-2">Item</th>
//                 <th className="p-2">Category</th>
//                 <th className="p-2">Condition</th>
//                 <th className="p-2">Cost (₹)</th>
//                 <th className="p-2 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Existing Rows */}
//               {items.map((item, index) =>
//                 editingIndex === index ? (
//                   <tr key={index} className="bg-blue-50">
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.item}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].item = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <select
//                         value={item.category}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].category = e.target.value;
//                           copy[index].itemsOptions = categoryItemsMap[e.target.value] || [];
//                           copy[index].item = copy[index].itemsOptions[0] || "";
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       >
//                         {Object.keys(categoryItemsMap).map((cat, i) => (
//                           <option key={i}>{cat}</option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="p-2">
//                       <select
//                         value={item.condition}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].condition = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       >
//                         <option>OK</option>
//                         <option>Repair Needed</option>
//                         <option>Replace</option>
//                       </select>
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.cost}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].cost = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-24 p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => saveEditRow(index)}>
//                         <Save className="h-4 w-4 text-green-600" />
//                       </Button>
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => setEditingIndex(null)}>
//                         <X className="h-4 w-4 text-gray-600" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ) : (
//                   <tr key={index}>
//                     <td className="p-2">{item.item}</td>
//                     <td className="p-2">{item.category}</td>
//                     <td className="p-2">{item.condition}</td>
//                     <td className="p-2">{item.cost}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => editRow(index)}>
//                         <Edit className="h-4 w-4 text-blue-600" />
//                       </Button>
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => deleteRow(index)}>
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </td>
//                   </tr>
//                 )
//               )}

//               {/* New Row */}
//               {newItem && (
//                 <tr className="bg-blue-50">
//                   <td className="p-2">
//                     <select
//                       value={newItem.item}
//                       onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
//                       className="w-full p-1 border rounded-lg"
//                     >
//                       {newItem.itemsOptions?.map((opt, i) => (
//                         <option key={i}>{opt}</option>
//                       ))}
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input
//                       list="categories-list"
//                       value={newItem.category}
//                       onChange={(e) => handleCategoryChange(e.target.value)}
//                       placeholder="Type or select category"
//                       className="w-full p-1 border rounded-lg"
//                     />
//                     <datalist id="categories-list">
//                       {Object.keys(categoryItemsMap).map((cat, i) => (
//                         <option key={i}>{cat}</option>
//                       ))}
//                     </datalist>
//                   </td>
//                   <td className="p-2">
//                     <select
//                       value={newItem.condition}
//                       onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
//                       className="w-full p-1 border rounded-lg"
//                     >
//                       <option>OK</option>
//                       <option>Repair Needed</option>
//                       <option>Replace</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={newItem.cost}
//                       onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
//                       className="w-24 p-1 border rounded-lg"
//                     />
//                   </td>
//                   <td className="p-2 text-right space-x-1">
//                     <Button variant="ghost" className="p-1 h-auto" onClick={saveNewRow}>
//                       <Save className="h-4 w-4 text-green-600" />
//                     </Button>
//                     <Button variant="ghost" className="p-1 h-auto" onClick={() => setNewItem(null)}>
//                       <X className="h-4 w-4 text-gray-600" />
//                     </Button>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {items.length === 0 && !newItem && (
//             <div className="text-center p-4 text-gray-500">No inspection items.</div>
//           )}
//         </div>

//         {/* Add Button */}
//         <div className="mt-4">
//           <Button variant="secondary" onClick={addRow} disabled={!!newItem}>
//             <PlusCircle className="h-4 w-4 mr-2" /> Add Item
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default InspectionStep;

// Running but not Local storage 
// import { useState } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";

// const InspectionStep = () => {
//   // Vehicle Details
//   const [details, setDetails] = useState({
//     vehicleNo: "",
//     ownerName: "",
//     inspectionDate: "",
//     branch: "",
//   });

//   // Inspection Items
//   const [items, setItems] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [newItem, setNewItem] = useState(null);

//   // Multipliers
//   const multipliers = {
//     Parts: 1.5,
//     Labour: 2,
//     Hardware: 2,
//     Steel: 1.5,
//   };

//   // Vehicle Details change
//   const handleDetailChange = (e) => {
//     setDetails({ ...details, [e.target.name]: e.target.value });
//   };

//   const saveDetails = () => {
//     console.log("Vehicle details:", details);
//     alert("Vehicle details saved!");
//   };

//   // Add new row
//   const addRow = () => {
//     setNewItem({ item: "", category: "", condition: "OK", cost: "0" });
//   };

//   // Save new row
//   const saveNewRow = () => {
//     setItems([...items, newItem]);
//     setNewItem(null);
//   };

//   // Edit row
//   const editRow = (index) => {
//     setEditingIndex(index);
//   };

//   // Save edited row
//   const saveEditRow = (index) => {
//     setEditingIndex(null);
//   };

//   // Delete row
//   const deleteRow = (index) => {
//     const updated = items.filter((_, i) => i !== index);
//     setItems(updated);
//   };

//   // Calculate total based on multiplier
//   const calculateTotal = (item) => {
//     const cost = parseFloat(item.cost) || 0;
//     const multiplier = multipliers[item.item] || 1;
//     return (cost * multiplier).toFixed(2);
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Vehicle Inspection</h3>

//       {/* Card 1 - Vehicle Details */}
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <label>Vehicle No:</label>
//             <input
//               type="text"
//               name="vehicleNo"
//               value={details.vehicleNo}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Owner Name:</label>
//             <input
//               type="text"
//               name="ownerName"
//               value={details.ownerName}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Inspection Date:</label>
//             <input
//               type="date"
//               name="inspectionDate"
//               value={details.inspectionDate}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Branch:</label>
//             <input
//               type="text"
//               name="branch"
//               value={details.branch}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//         </div>
//         <div className="flex justify-end mt-4">
//           <Button onClick={saveDetails}>
//             <Save className="h-4 w-4 mr-2" /> Save Details
//           </Button>
//         </div>
//       </Card>

//       {/* Card 2 - Inspection Items */}
//       <Card title="Inspection Items">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-2">category</th>
//                 <th className="p-2">iteam</th>
//                 <th className="p-2">Condition</th>
//                 <th className="p-2">Cost (₹)</th>
//                 <th className="p-2">Total (₹)</th>
//                 <th className="p-2 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Existing Rows */}
//               {items.map((item, index) =>
//                 editingIndex === index ? (
//                   <tr key={index} className="bg-blue-50">
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.item}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].item = e.target.value;
//                           setItems(copy);
//                         }}
//                         list="items-list"
//                         placeholder="Type or select item"
//                         className="w-full p-1 border rounded-lg"
//                       />
//                       <datalist id="items-list">
//                         <option value="Parts" />
//                         <option value="Labour" />
//                         <option value="Hardware" />
//                         <option value="Steel" />
//                       </datalist>
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.category}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].category = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <select
//                         value={item.condition}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].condition = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       >
//                         <option>OK</option>
//                         <option>Repair Needed</option>
//                         <option>Replace</option>
//                       </select>
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.cost}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].cost = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-24 p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">{calculateTotal(item)}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => saveEditRow(index)}>
//                         <Save className="h-4 w-4 text-green-600" />
//                       </Button>
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => setEditingIndex(null)}>
//                         <X className="h-4 w-4 text-gray-600" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ) : (
//                   <tr key={index}>
//                     <td className="p-2">{item.item}</td>
//                     <td className="p-2">{item.category}</td>
//                     <td className="p-2">{item.condition}</td>
//                     <td className="p-2">{item.cost}</td>
//                     <td className="p-2">{calculateTotal(item)}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => editRow(index)}>
//                         <Edit className="h-4 w-4 text-blue-600" />
//                       </Button>
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => deleteRow(index)}>
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </td>
//                   </tr>
//                 )
//               )}

//               {/* New Row */}
//               {newItem && (
//                 <tr className="bg-blue-50">
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={newItem.item}
//                       onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
//                       list="items-list"
//                       placeholder="Type or select item"
//                       className="w-full p-1 border rounded-lg"
//                     />
//                     <datalist id="items-list">
//                       <option value="Parts" />
//                       <option value="Labour" />
//                       <option value="Hardware" />
//                       <option value="Steel" />
//                     </datalist>
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={newItem.category}
//                       onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
//                       className="w-full p-1 border rounded-lg"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <select
//                       value={newItem.condition}
//                       onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
//                       className="w-full p-1 border rounded-lg"
//                     >
//                       <option>OK</option>
//                       <option>Repair Needed</option>
//                       <option>Replace</option>
//                         <option>Damage</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={newItem.cost}
//                       onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
//                       className="w-24 p-1 border rounded-lg"
//                     />
//                   </td>
//                   <td className="p-2">{calculateTotal(newItem)}</td>
//                   <td className="p-2 text-right space-x-1">
//                     <Button variant="ghost" className="p-1 h-auto" onClick={saveNewRow}>
//                       <Save className="h-4 w-4 text-green-600" />
//                     </Button>
//                     <Button variant="ghost" className="p-1 h-auto" onClick={() => setNewItem(null)}>
//                       <X className="h-4 w-4 text-gray-600" />
//                     </Button>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {items.length === 0 && !newItem && (
//             <div className="text-center p-4 text-gray-500">No inspection items.</div>
//           )}
//         </div>

//         {/* Add Button */}
//         <div className="mt-4">
//           <Button variant="secondary" onClick={addRow} disabled={!!newItem}>
//             <PlusCircle className="h-4 w-4 mr-2" /> Add Item
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default InspectionStep;



// import { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";

// const InspectionStep = () => {
//   // Vehicle Details
//   const [details, setDetails] = useState({
//     vehicleNo: "",
//     ownerName: "",
//     inspectionDate: "",
//     branch: "",
//   });

//   // Inspection Items (Load from localStorage if available)
//   const [items, setItems] = useState(() => {
//     const saved = localStorage.getItem("inspectionItems");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [editingIndex, setEditingIndex] = useState(null);
//   const [newItem, setNewItem] = useState(null);

//   // Multipliers
//   const multipliers = {
//     Parts: 1.5,
//     Labour: 2,
//     Hardware: 2,
//     Steel: 1.5,
//   };

//   // Save to localStorage whenever items change
//   useEffect(() => {
//     localStorage.setItem("inspectionItems", JSON.stringify(items));
//   }, [items]);

//   // Vehicle Details change
//   const handleDetailChange = (e) => {
//     setDetails({ ...details, [e.target.name]: e.target.value });
//   };

//   const saveDetails = () => {
//     console.log("Vehicle details:", details);
//     alert("Vehicle details saved!");
//   };

//   // Add new row
//   const addRow = () => {
//     setNewItem({ item: "", category: "", condition: "OK", cost: "0" });
//   };

//   // Save new row
//   const saveNewRow = () => {
//     setItems([...items, newItem]);
//     setNewItem(null);
//   };

//   // Edit row
//   const editRow = (index) => {
//     setEditingIndex(index);
//   };

//   // Save edited row
//   const saveEditRow = (index) => {
//     setEditingIndex(null);
//   };

//   // Delete row
//   const deleteRow = (index) => {
//     const updated = items.filter((_, i) => i !== index);
//     setItems(updated);
//   };

//   // Calculate total based on multiplier
//   const calculateTotal = (item) => {
//     const cost = parseFloat(item.cost) || 0;
//     const multiplier = multipliers[item.item] || 1;
//     return (cost * multiplier).toFixed(2);
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Vehicle Inspection</h3>

//       {/* Card 1 - Vehicle Details */}
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <label>Vehicle No:</label>
//             <input
//               type="text"
//               name="vehicleNo"
//               value={details.vehicleNo}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Owner Name:</label>
//             <input
//               type="text"
//               name="ownerName"
//               value={details.ownerName}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Inspection Date:</label>
//             <input
//               type="date"
//               name="inspectionDate"
//               value={details.inspectionDate}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label>Branch:</label>
//             <input
//               type="text"
//               name="branch"
//               value={details.branch}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//         </div>
//         <div className="flex justify-end mt-4">
//           <Button onClick={saveDetails}>
//             <Save className="h-4 w-4 mr-2" /> Save Details
//           </Button>
//         </div>
//       </Card>

//       {/* Card 2 - Inspection Items */}
//       <Card title="Inspection Items">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-2">category</th>
//                 <th className="p-2">iteam</th>
//                 <th className="p-2">Condition</th>
//                 <th className="p-2">Cost (₹)</th>
//                 <th className="p-2">Total (₹)</th>
//                 <th className="p-2 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {/* Existing Rows */}
//               {items.map((item, index) =>
//                 editingIndex === index ? (
//                   <tr key={index} className="bg-blue-50">
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.item}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].item = e.target.value;
//                           setItems(copy);
//                         }}
//                         list="items-list"
//                         placeholder="Type or select item"
//                         className="w-full p-1 border rounded-lg"
//                       />
//                       <datalist id="items-list">
//                         <option value="Parts" />
//                         <option value="Labour" />
//                         <option value="Hardware" />
//                         <option value="Steel" />
//                       </datalist>
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.category}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].category = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <select
//                         value={item.condition}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].condition = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       >
//                         <option>OK</option>
//                         <option>Repair Needed</option>
//                         <option>Replace</option>
//                       </select>
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.cost}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].cost = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-24 p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">{calculateTotal(item)}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => saveEditRow(index)}>
//                         <Save className="h-4 w-4 text-green-600" />
//                       </Button>
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => setEditingIndex(null)}>
//                         <X className="h-4 w-4 text-gray-600" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ) : (
//                   <tr key={index}>
//                     <td className="p-2">{item.item}</td>
//                     <td className="p-2">{item.category}</td>
//                     <td className="p-2">{item.condition}</td>
//                     <td className="p-2">{item.cost}</td>
//                     <td className="p-2">{calculateTotal(item)}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => editRow(index)}>
//                         <Edit className="h-4 w-4 text-blue-600" />
//                       </Button>
//                       <Button variant="ghost" className="p-1 h-auto" onClick={() => deleteRow(index)}>
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </td>
//                   </tr>
//                 )
//               )}

//               {/* New Row */}
//               {newItem && (
//                 <tr className="bg-blue-50">
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={newItem.item}
//                       onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
//                       list="items-list"
//                       placeholder="Type or select item"
//                       className="w-full p-1 border rounded-lg"
//                     />
//                     <datalist id="items-list">
//                       <option value="Parts" />
//                       <option value="Labour" />
//                       <option value="Hardware" />
//                       <option value="Steel" />
//                     </datalist>
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={newItem.category}
//                       onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
//                       className="w-full p-1 border rounded-lg"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <select
//                       value={newItem.condition}
//                       onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
//                       className="w-full p-1 border rounded-lg"
//                     >
//                       <option>OK</option>
//                       <option>Repair Needed</option>
//                       <option>Replace</option>
//                       <option>Damage</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={newItem.cost}
//                       onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
//                       className="w-24 p-1 border rounded-lg"
//                     />
//                   </td>
//                   <td className="p-2">{calculateTotal(newItem)}</td>
//                   <td className="p-2 text-right space-x-1">
//                     <Button variant="ghost" className="p-1 h-auto" onClick={saveNewRow}>
//                       <Save className="h-4 w-4 text-green-600" />
//                     </Button>
//                     <Button variant="ghost" className="p-1 h-auto" onClick={() => setNewItem(null)}>
//                       <X className="h-4 w-4 text-gray-600" />
//                     </Button>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {items.length === 0 && !newItem && (
//             <div className="text-center p-4 text-gray-500">No inspection items.</div>
//           )}
//         </div>

//         {/* Add Button */}
//         <div className="mt-4">
//           <Button variant="secondary" onClick={addRow} disabled={!!newItem}>
//             <PlusCircle className="h-4 w-4 mr-2" /> Add Item
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default InspectionStep;

// working perfect code and final
// import { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";

// const InspectionStep = () => {
//   // 👉 Vehicle ka basic details (inputs ke liye ek object use kar rahe hain)
//   const [details, setDetails] = useState({
//     vehicleNo: "",
//     ownerName: "",
//     inspectionDate: "",
//     branch: "",
//   });

//   // 👉 Inspection Items (localStorage se load hoga agar pehle se save hai)
//   const [items, setItems] = useState(() => {
//     const saved = localStorage.getItem("inspectionItems");
//     return saved ? JSON.parse(saved) : [];
//   });

//   // 👉 Edit karne ke liye row index save karte hain
//   const [editingIndex, setEditingIndex] = useState(null);

//   // 👉 Naya item add karne ke liye temporary state
//   const [newItem, setNewItem] = useState(null);

//   // 👉 Multiplier table (alag-alag item ka cost multiply karne ke liye)
//   const multipliers = {
//     Parts: 1.5,
//     Labour: 2,
//     Hardware: 2,
//     Steel: 1.5,
//   };

//   // 👉 Jab bhi items update hote hain, unhe localStorage me save kar do
//   useEffect(() => {
//     localStorage.setItem("inspectionItems", JSON.stringify(items));
//   }, [items]);

//   // 👉 Vehicle Details ke inputs ke liye change handler
//   const handleDetailChange = (e) => {
//     setDetails({ ...details, [e.target.name]: e.target.value });
//   };

//   // 👉 Save vehicle details (abhi ke liye console + alert hi rakha hai)
//   const saveDetails = () => {
//     console.log("Vehicle details:", details);
//     alert("Vehicle details saved!");
//   };

//   // 👉 Naya row add karna
//   const addRow = () => {
//     setNewItem({ item: "", category: "", condition: "OK", cost: "0" });
//   };

//   // 👉 Naya row save karna
//   const saveNewRow = () => {
//     setItems([...items, newItem]);
//     setNewItem(null);
//   };

//   // 👉 Row ko edit mode me lana
//   const editRow = (index) => {
//     setEditingIndex(index);
//   };

//   // 👉 Edited row save karna
//   const saveEditRow = () => {
//     setEditingIndex(null);
//   };

//   // 👉 Row delete karna
//   const deleteRow = (index) => {
//     const updated = items.filter((_, i) => i !== index);
//     setItems(updated);
//   };

//   // 👉 Cost × multiplier se total calculate karna
//   const calculateTotal = (item) => {
//     const cost = parseFloat(item.cost) || 0;
//     const multiplier = multipliers[item.item] || 1;
//     return (cost * multiplier).toFixed(2);
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Vehicle Inspection</h3>

//       {/* 🚗 Card 1 - Vehicle Details */}
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           {/* Vehicle No */}
//           <div>
//             <label>Vehicle No:</label>
//             <input
//               type="text"
//               name="vehicleNo"
//               value={details.vehicleNo}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>

//           {/* Owner Name */}
//           <div>
//             <label>Owner Name:</label>
//             <input
//               type="text"
//               name="ownerName"
//               value={details.ownerName}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>

//           {/* Inspection Date */}
//           <div>
//             <label>Inspection Date:</label>
//             <input
//               type="date"
//               name="inspectionDate"
//               value={details.inspectionDate}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>

//           {/* Branch */}
//           <div>
//             <label>Branch:</label>
//             <input
//               type="text"
//               name="branch"
//               value={details.branch}
//               onChange={handleDetailChange}
//               className="w-full mt-1 p-2 border rounded-lg"
//             />
//           </div>
//         </div>

//         {/* Save Vehicle Details Button */}
//         <div className="flex justify-end mt-4">
//           <Button onClick={saveDetails}>
//             <Save className="h-4 w-4 mr-2" /> Save Details
//           </Button>
//         </div>
//       </Card>

//       {/* 📝 Card 2 - Inspection Items */}
//       <Card title="Inspection Items">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-2">Item</th>
//                 <th className="p-2">Category</th>
//                 <th className="p-2">Condition</th>
//                 <th className="p-2">Cost (₹)</th>
//                 <th className="p-2">Total (₹)</th>
//                 <th className="p-2 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* 👉 Existing Rows */}
//               {items.map((item, index) =>
//                 editingIndex === index ? (
//                   // Editable row
//                   <tr key={index} className="bg-blue-50">
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.item}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].item = e.target.value;
//                           setItems(copy);
//                         }}
//                         list="items-list"
//                         placeholder="Type or select item"
//                         className="w-full p-1 border rounded-lg"
//                       />
//                       <datalist id="items-list">
//                         <option value="Parts" />
//                         <option value="Labour" />
//                         <option value="Hardware" />
//                         <option value="Steel" />
//                       </datalist>
//                     </td>

//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.category}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].category = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <select
//                         value={item.condition}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].condition = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       >
//                         <option>OK</option>
//                         <option>Repair Needed</option>
//                         <option>Replace</option>
//                       </select>
//                     </td>

//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.cost}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index].cost = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-24 p-1 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">{calculateTotal(item)}</td>

//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" onClick={() => saveEditRow(index)}>
//                         <Save className="h-4 w-4 text-green-600" />
//                       </Button>
//                       <Button variant="ghost" onClick={() => setEditingIndex(null)}>
//                         <X className="h-4 w-4 text-gray-600" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ) : (
//                   // Normal row
//                   <tr key={index}>
//                     <td className="p-2">{item.item}</td>
//                     <td className="p-2">{item.category}</td>
//                     <td className="p-2">{item.condition}</td>
//                     <td className="p-2">{item.cost}</td>
//                     <td className="p-2">{calculateTotal(item)}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" onClick={() => editRow(index)}>
//                         <Edit className="h-4 w-4 text-blue-600" />
//                       </Button>
//                       <Button variant="ghost" onClick={() => deleteRow(index)}>
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </td>
//                   </tr>
//                 )
//               )}

//               {/* 👉 New Row */}
//               {newItem && (
//                 <tr className="bg-blue-50">
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={newItem.item}
//                       onChange={(e) => setNewItem({ ...newItem, item: e.target.value })}
//                       list="items-list"
//                       placeholder="Type or select item"
//                       className="w-full p-1 border rounded-lg"
//                     />
//                     <datalist id="items-list">
//                       <option value="Parts" />
//                       <option value="Labour" />
//                       <option value="Hardware" />
//                       <option value="Steel" />
//                     </datalist>
//                   </td>

//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={newItem.category}
//                       onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
//                       className="w-full p-1 border rounded-lg"
//                     />
//                   </td>

//                   <td className="p-2">
//                     <select
//                       value={newItem.condition}
//                       onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
//                       className="w-full p-1 border rounded-lg"
//                     >
//                       <option>OK</option>
//                       <option>Repair Needed</option>
//                       <option>Replace</option>
//                       <option>Damage</option>
//                     </select>
//                   </td>

//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={newItem.cost}
//                       onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
//                       className="w-24 p-1 border rounded-lg"
//                     />
//                   </td>

//                   <td className="p-2">{calculateTotal(newItem)}</td>

//                   <td className="p-2 text-right space-x-1">
//                     <Button variant="ghost" onClick={saveNewRow}>
//                       <Save className="h-4 w-4 text-green-600" />
//                     </Button>
//                     <Button variant="ghost" onClick={() => setNewItem(null)}>
//                       <X className="h-4 w-4 text-gray-600" />
//                     </Button>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* 👉 Empty state */}
//           {items.length === 0 && !newItem && (
//             <div className="text-center p-4 text-gray-500">No inspection items.</div>
//           )}
//         </div>

//         {/* Add Item Button */}
//         <div className="mt-4">
//           <Button variant="secondary" onClick={addRow} disabled={!!newItem}>
//             <PlusCircle className="h-4 w-4 mr-2" /> Add Item
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default InspectionStep;





// 1 dummy code
// import { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";

// const InspectionStep = () => {
//   const [details, setDetails] = useState({
//     vehicleNo: "",
//     ownerName: "",
//     inspectionDate: "",
//     branch: "",
//   });

//   const [items, setItems] = useState(() => {
//     try {
//       const saved = localStorage.getItem("inspectionItems");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   const [categories, setCategories] = useState(() => {
//     try {
//       const saved = localStorage.getItem("categories");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   // listen for updates (same-tab custom event + cross-tab storage)
//   useEffect(() => {
//     const loadCats = () => {
//       try {
//         const saved = localStorage.getItem("categories");
//         setCategories(saved ? JSON.parse(saved) : []);
//       } catch {
//         setCategories([]);
//       }
//     };

//     loadCats();
//     const onCats = () => loadCats();
//     const onStorage = (e) => { if (e.key === "categories") loadCats(); };

//     window.addEventListener("categoriesUpdated", onCats);
//     window.addEventListener("storage", onStorage);
//     return () => {
//       window.removeEventListener("categoriesUpdated", onCats);
//       window.removeEventListener("storage", onStorage);
//     };
//   }, []);

//   const [editingIndex, setEditingIndex] = useState(null);
//   const [newItem, setNewItem] = useState(null);

//   const multipliers = {
//     Parts: 1.5,
//     Labour: 2,
//     Hardware: 2,
//     Steel: 1.5,
//   };

//   useEffect(() => {
//     try {
//       localStorage.setItem("inspectionItems", JSON.stringify(items));
//     } catch {}
//   }, [items]);

//   const handleDetailChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });
//   const saveDetails = () => { console.log("Vehicle details:", details); alert("Vehicle details saved!"); };

//   const addRow = () => setNewItem({ item: "", category: "", condition: "OK", cost: "0" });

//   const saveNewRow = () => {
//     if (!newItem || !newItem.item?.toString().trim()) { alert("Please enter item name."); return; }
//     setItems([...items, newItem]);
//     setNewItem(null);
//   };

//   const editRow = (index) => setEditingIndex(index);
//   const saveEditRow = (index) => {
//     const it = items[index];
//     if (!it || !it.item?.toString().trim()) { alert("Item cannot be empty."); return; }
//     setEditingIndex(null);
//   };

//   const deleteRow = (index) => setItems(items.filter((_, i) => i !== index));

//   const calculateTotal = (item) => {
//     const cost = parseFloat(item?.cost) || 0;
//     const multiplier = multipliers[item?.item] || 1;
//     return (cost * multiplier).toFixed(2);
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Vehicle Inspection</h3>

//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div><label>Vehicle No:</label><input type="text" name="vehicleNo" value={details.vehicleNo} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" /></div>
//           <div><label>Owner Name:</label><input type="text" name="ownerName" value={details.ownerName} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" /></div>
//           <div><label>Inspection Date:</label><input type="date" name="inspectionDate" value={details.inspectionDate} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" /></div>
//           <div><label>Branch:</label><input type="text" name="branch" value={details.branch} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" /></div>
//         </div>

//         <div className="flex justify-end mt-4"><Button onClick={saveDetails}><Save className="h-4 w-4 mr-2" /> Save Details</Button></div>
//       </Card>

//       <Card title="Inspection Items">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-left"><tr><th className="p-2">Item</th><th className="p-2">Category</th><th className="p-2">Condition</th><th className="p-2">Cost (₹)</th><th className="p-2">Total (₹)</th><th className="p-2 text-right">Actions</th></tr></thead>
//             <tbody>
//               {items.map((it, index) => editingIndex === index ? (
//                 <tr key={index} className="bg-blue-50">
//                   <td className="p-2">
//                     <input type="text" value={it.item} onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], item: e.target.value }; setItems(copy); }} list="items-list" placeholder="Type or select item" className="w-full p-1 border rounded-lg" />
//                   </td>
//                   <td className="p-2">
//                     <input type="text" value={it.category} onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], category: e.target.value }; setItems(copy); }} className="w-full p-1 border rounded-lg" />
//                   </td>
//                   <td className="p-2">
//                     <select value={it.condition} onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], condition: e.target.value }; setItems(copy); }} className="w-full p-1 border rounded-lg">
//                       <option>OK</option><option>Repair Needed</option><option>Replace</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input type="number" value={it.cost} onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], cost: e.target.value }; setItems(copy); }} className="w-24 p-1 border rounded-lg" />
//                   </td>
//                   <td className="p-2">{calculateTotal(it)}</td>
//                   <td className="p-2 text-right space-x-1">
//                     <Button variant="ghost" onClick={() => saveEditRow(index)}><Save className="h-4 w-4 text-green-600" /></Button>
//                     <Button variant="ghost" onClick={() => setEditingIndex(null)}><X className="h-4 w-4 text-gray-600" /></Button>
//                   </td>
//                 </tr>
//               ) : (
//                 <tr key={index}>
//                   <td className="p-2">{it.item}</td>
//                   <td className="p-2">{it.category}</td>
//                   <td className="p-2">{it.condition}</td>
//                   <td className="p-2">{it.cost}</td>
//                   <td className="p-2">{calculateTotal(it)}</td>
//                   <td className="p-2 text-right space-x-1">
//                     <Button variant="ghost" onClick={() => editRow(index)}><Edit className="h-4 w-4 text-blue-600" /></Button>
//                     <Button variant="ghost" onClick={() => deleteRow(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
//                   </td>
//                 </tr>
//               ))}

//               {newItem && (
//                 <tr className="bg-blue-50">
//                   <td className="p-2">
//                     <input type="text" value={newItem.item} onChange={(e) => setNewItem({ ...newItem, item: e.target.value })} list="items-list" placeholder="Type or select item" className="w-full p-1 border rounded-lg" />
//                   </td>
//                   <td className="p-2">
//                     <input type="text" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} list="categories-list" className="w-full p-1 border rounded-lg" />
//                   </td>
//                   <td className="p-2">
//                     <select value={newItem.condition} onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })} className="w-full p-1 border rounded-lg">
//                       <option>OK</option><option>Repair Needed</option><option>Replace</option><option>Damage</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input type="number" value={newItem.cost} onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })} className="w-24 p-1 border rounded-lg" />
//                   </td>
//                   <td className="p-2">{calculateTotal(newItem)}</td>
//                   <td className="p-2 text-right space-x-1">
//                     <Button variant="ghost" onClick={saveNewRow}><Save className="h-4 w-4 text-green-600" /></Button>
//                     <Button variant="ghost" onClick={() => setNewItem(null)}><X className="h-4 w-4 text-gray-600" /></Button>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {items.length === 0 && !newItem && <div className="text-center p-4 text-gray-500">No inspection items.</div>}
//         </div>

//         <div className="mt-4">
//           <Button variant="secondary" onClick={addRow} disabled={!!newItem}><PlusCircle className="h-4 w-4 mr-2" /> Add Item</Button>
//         </div>
//       </Card>

//       <datalist id="items-list">
//         {categories.map((cat, i) => <option key={i} value={cat.name} />)}
//       </datalist>
//     </div>
//   );
// };

// export default InspectionStep;


// code 1
// import { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";

// const InspectionStep = () => {
//   // Vehicle details
//   const [details, setDetails] = useState({
//     vehicleNo: "",
//     ownerName: "",
//     inspectionDate: "",
//     branch: "",
//   });

//   // Inspection items
//   const [items, setItems] = useState(() => {
//     try {
//       const saved = localStorage.getItem("inspectionItems");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   // Categories (loaded from localStorage "categories"); used to populate Item datalist
//   const [categories, setCategories] = useState(() => {
//     try {
//       const saved = localStorage.getItem("categories");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   // Keep categories in sync (same-tab custom event + cross-tab storage event)
//   useEffect(() => {
//     const loadCats = () => {
//       try {
//         const saved = localStorage.getItem("categories");
//         setCategories(saved ? JSON.parse(saved) : []);
//       } catch {
//         setCategories([]);
//       }
//     };

//     loadCats();
//     const onCats = () => loadCats();
//     const onStorage = (e) => { if (e.key === "categories") loadCats(); };

//     window.addEventListener("categoriesUpdated", onCats);
//     window.addEventListener("storage", onStorage);
//     return () => {
//       window.removeEventListener("categoriesUpdated", onCats);
//       window.removeEventListener("storage", onStorage);
//     };
//   }, []);

//   // editing/new row state
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [newItem, setNewItem] = useState(null);

//   // multipliers mapping (apply based on category primarily)
//   const multipliers = {
//     Parts: 1.5,
//     Labour: 2,
//     Hardware: 2,
//     Steel: 1.5,
//   };

//   // persist items
//   useEffect(() => {
//     try {
//       localStorage.setItem("inspectionItems", JSON.stringify(items));
//     } catch {}
//   }, [items]);

//   const handleDetailChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });
//   const saveDetails = () => { console.log("Vehicle details:", details); alert("Vehicle details saved!"); };

//   const addRow = () => setNewItem({ item: "", category: "", condition: "OK", cost: "0" });

//   const saveNewRow = () => {
//     if (!newItem || !newItem.item?.toString().trim()) { alert("Please enter item name."); return; }
//     // normalize cost to string/number as you prefer; keeping as string to preserve existing UI behavior
//     setItems([...items, newItem]);
//     setNewItem(null);
//   };

//   const editRow = (index) => setEditingIndex(index);
//   const saveEditRow = (index) => {
//     const it = items[index];
//     if (!it || !it.item?.toString().trim()) { alert("Item cannot be empty."); return; }
//     setEditingIndex(null);
//   };

//   const deleteRow = (index) => setItems(items.filter((_, i) => i !== index));

//   // Use category first for multiplier lookup; fallback to item text (backwards-compat)
//   const calculateTotal = (item) => {
//     const cost = parseFloat(item?.cost) || 0;
//     const multiplier = multipliers[item?.category] || multipliers[item?.item] || 1;
//     return (cost * multiplier).toFixed(2);
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Vehicle Inspection</h3>

//       {/* Vehicle Details */}
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <label>Vehicle No:</label>
//             <input type="text" name="vehicleNo" value={details.vehicleNo} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>

//           <div>
//             <label>Owner Name:</label>
//             <input type="text" name="ownerName" value={details.ownerName} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>

//           <div>
//             <label>Inspection Date:</label>
//             <input type="date" name="inspectionDate" value={details.inspectionDate} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>

//           <div>
//             <label>Branch:</label>
//             <input type="text" name="branch" value={details.branch} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>
//         </div>

//         <div className="flex justify-end mt-4">
//           <Button onClick={saveDetails}><Save className="h-4 w-4 mr-2" /> Save Details</Button>
//         </div>
//       </Card>

//       {/* Inspection Items */}
//       <Card title="Inspection Items">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-2">Item</th>
//                 <th className="p-2">Category</th>
//                 <th className="p-2">Condition</th>
//                 <th className="p-2">Cost (₹)</th>
//                 <th className="p-2">Total (₹)</th>
//                 <th className="p-2 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {items.map((it, index) =>
//                 editingIndex === index ? (
//                   <tr key={index} className="bg-blue-50">
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={it.item}
//                         onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], item: e.target.value }; setItems(copy); }}
//                         list="items-list" // items-list populated from categories (as requested)
//                         placeholder="Type or select item"
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={it.category}
//                         onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], category: e.target.value }; setItems(copy); }}
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>

//                     <td className="p-2">
//                       <select value={it.condition} onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], condition: e.target.value }; setItems(copy); }} className="w-full p-1 border rounded-lg">
//                         <option>OK</option>
//                         <option>Repair Needed</option>
//                         <option>Replace</option>
//                       </select>
//                     </td>

//                     <td className="p-2">
//                       <input type="number" value={it.cost} onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], cost: e.target.value }; setItems(copy); }} className="w-24 p-1 border rounded-lg" />
//                     </td>

//                     <td className="p-2">{calculateTotal(it)}</td>

//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" onClick={() => saveEditRow(index)}><Save className="h-4 w-4 text-green-600" /></Button>
//                       <Button variant="ghost" onClick={() => setEditingIndex(null)}><X className="h-4 w-4 text-gray-600" /></Button>
//                     </td>
//                   </tr>
//                 ) : (
//                   <tr key={index}>
//                     <td className="p-2">{it.item}</td>
//                     <td className="p-2">{it.category}</td>
//                     <td className="p-2">{it.condition}</td>
//                     <td className="p-2">{it.cost}</td>
//                     <td className="p-2">{calculateTotal(it)}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" onClick={() => editRow(index)}><Edit className="h-4 w-4 text-blue-600" /></Button>
//                       <Button variant="ghost" onClick={() => deleteRow(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
//                     </td>
//                   </tr>
//                 )
//               )}

//               {newItem && (
//                 <tr className="bg-blue-50">
//                   <td className="p-2">
//                     <input type="text" value={newItem.item} onChange={(e) => setNewItem({ ...newItem, item: e.target.value })} list="items-list" placeholder="Type or select item" className="w-full p-1 border rounded-lg" />
//                   </td>

//                   <td className="p-2">
//                     <input type="text" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="w-full p-1 border rounded-lg" />
//                   </td>

//                   <td className="p-2">
//                     <select value={newItem.condition} onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })} className="w-full p-1 border rounded-lg">
//                       <option>OK</option>
//                       <option>Repair Needed</option>
//                       <option>Replace</option>
//                       <option>Damage</option>
//                     </select>
//                   </td>

//                   <td className="p-2">
//                     <input type="number" value={newItem.cost} onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })} className="w-24 p-1 border rounded-lg" />
//                   </td>

//                   <td className="p-2">{calculateTotal(newItem)}</td>

//                   <td className="p-2 text-right space-x-1">
//                     <Button variant="ghost" onClick={saveNewRow}><Save className="h-4 w-4 text-green-600" /></Button>
//                     <Button variant="ghost" onClick={() => setNewItem(null)}><X className="h-4 w-4 text-gray-600" /></Button>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {items.length === 0 && !newItem && <div className="text-center p-4 text-gray-500">No inspection items.</div>}
//         </div>

//         <div className="mt-4">
//           <Button variant="secondary" onClick={addRow} disabled={!!newItem}><PlusCircle className="h-4 w-4 mr-2" /> Add Item</Button>
//         </div>
//       </Card>

//       {/* Item suggestions come from categories */}
//       <datalist id="items-list">
//         {categories.map((cat, i) => <option key={i} value={cat.name} />)}
//       </datalist>
//     </div>
//   );
// };

// export default InspectionStep;


// code 2
// import { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";

// const InspectionStep = () => {
//   // Vehicle details
//   const [details, setDetails] = useState({
//     vehicleNo: "",
//     ownerName: "",
//     inspectionDate: "",
//     branch: "",
//   });

//   // Inspection items
//   const [items, setItems] = useState(() => {
//     try {
//       const saved = localStorage.getItem("inspectionItems");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   // Categories (loaded from localStorage "categories")
//   const [categories, setCategories] = useState(() => {
//     try {
//       const saved = localStorage.getItem("categories");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   // Keep categories synced
//   useEffect(() => {
//     const loadCats = () => {
//       try {
//         const saved = localStorage.getItem("categories");
//         setCategories(saved ? JSON.parse(saved) : []);
//       } catch {
//         setCategories([]);
//       }
//     };
//     loadCats();
//     const onCats = () => loadCats();
//     const onStorage = (e) => { if (e.key === "categories") loadCats(); };
//     window.addEventListener("categoriesUpdated", onCats);
//     window.addEventListener("storage", onStorage);
//     return () => {
//       window.removeEventListener("categoriesUpdated", onCats);
//       window.removeEventListener("storage", onStorage);
//     };
//   }, []);

//   // editing/new row state
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [newItem, setNewItem] = useState(null);

//   // multipliers mapping (apply based on category)
//   const multipliers = {
//     Hardware: 2,
//     Steel: 1.5,
//     Labour: 2,
//     Parts: 1.5,
//   };

//   // persist items
//   useEffect(() => {
//     try {
//       localStorage.setItem("inspectionItems", JSON.stringify(items));
//     } catch {}
//   }, [items]);

//   const handleDetailChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });
//   const saveDetails = () => { alert("Vehicle details saved!"); };

//   const addRow = () => setNewItem({ item: "", category: "", condition: "OK", cost: "0" });

//   const saveNewRow = () => {
//     if (!newItem || !newItem.item?.toString().trim()) {
//       alert("Please enter item name.");
//       return;
//     }
//     setItems([...items, newItem]);
//     setNewItem(null);
//   };

//   const editRow = (index) => setEditingIndex(index);
//   const saveEditRow = (index) => {
//     const it = items[index];
//     if (!it || !it.item?.toString().trim()) {
//       alert("Item cannot be empty.");
//       return;
//     }
//     setEditingIndex(null);
//   };

//   const deleteRow = (index) => setItems(items.filter((_, i) => i !== index));

//   // calculate total with multiplier
//   const calculateTotal = (item) => {
//     const cost = parseFloat(item?.cost) || 0;
//     const cat = item?.category?.toString().trim();
//     const multiplier = multipliers[cat] || 1; // default 1x for manual categories
//     return (cost * multiplier).toFixed(2);
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Vehicle Inspection</h3>

//       {/* Vehicle Details */}
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <label>Vehicle No:</label>
//             <input type="text" name="vehicleNo" value={details.vehicleNo} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>
//           <div>
//             <label>Owner Name:</label>
//             <input type="text" name="ownerName" value={details.ownerName} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>
//           <div>
//             <label>Inspection Date:</label>
//             <input type="date" name="inspectionDate" value={details.inspectionDate} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>
//           <div>
//             <label>Branch:</label>
//             <input type="text" name="branch" value={details.branch} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>
//         </div>
//         <div className="flex justify-end mt-4">
//           <Button onClick={saveDetails}><Save className="h-4 w-4 mr-2" /> Save Details</Button>
//         </div>
//       </Card>

//       {/* Inspection Items */}
//       <Card title="Inspection Items">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-2">Item</th>
//                 <th className="p-2">Category</th>
//                 <th className="p-2">Condition</th>
//                 <th className="p-2">Cost (₹)</th>
//                 <th className="p-2">Total (₹)</th>
//                 <th className="p-2 text-right">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {items.map((it, index) =>
//                 editingIndex === index ? (
//                   <tr key={index} className="bg-blue-50">
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={it.item}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index] = { ...copy[index], item: e.target.value };
//                           setItems(copy);
//                         }}
//                         list="items-list"
//                         placeholder="Type or select item"
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={it.category}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index] = { ...copy[index], category: e.target.value };
//                           setItems(copy);
//                         }}
//                         list="category-list"
//                         placeholder="Type or select category"
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <select
//                         value={it.condition}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index] = { ...copy[index], condition: e.target.value };
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       >
//                         <option>OK</option>
//                         <option>Repair Needed</option>
//                         <option>Replace</option>
//                         <option>Damage</option>
//                       </select>
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={it.cost}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[index] = { ...copy[index], cost: e.target.value };
//                           setItems(copy);
//                         }}
//                         className="w-24 p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">{calculateTotal(it)}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" onClick={() => saveEditRow(index)}><Save className="h-4 w-4 text-green-600" /></Button>
//                       <Button variant="ghost" onClick={() => setEditingIndex(null)}><X className="h-4 w-4 text-gray-600" /></Button>
//                     </td>
//                   </tr>
//                 ) : (
//                   <tr key={index}>
//                     <td className="p-2">{it.item}</td>
//                     <td className="p-2">{it.category}</td>
//                     <td className="p-2">{it.condition}</td>
//                     <td className="p-2">{it.cost}</td>
//                     <td className="p-2">{calculateTotal(it)}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" onClick={() => editRow(index)}><Edit className="h-4 w-4 text-blue-600" /></Button>
//                       <Button variant="ghost" onClick={() => deleteRow(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
//                     </td>
//                   </tr>
//                 )
//               )}

//               {newItem && (
//                 <tr className="bg-blue-50">
//                   <td className="p-2">
//                     <input type="text" value={newItem.item} onChange={(e) => setNewItem({ ...newItem, item: e.target.value })} list="items-list" placeholder="Type or select item" className="w-full p-1 border rounded-lg" />
//                   </td>
//                   <td className="p-2">
//                     <input type="text" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} list="category-list" placeholder="Type or select category" className="w-full p-1 border rounded-lg" />
//                   </td>
//                   <td className="p-2">
//                     <select value={newItem.condition} onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })} className="w-full p-1 border rounded-lg">
//                       <option>OK</option>
//                       <option>Repair Needed</option>
//                       <option>Replace</option>
//                       <option>Damage</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input type="number" value={newItem.cost} onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })} className="w-24 p-1 border rounded-lg" />
//                   </td>
//                   <td className="p-2">{calculateTotal(newItem)}</td>
//                   <td className="p-2 text-right space-x-1">
//                     <Button variant="ghost" onClick={saveNewRow}><Save className="h-4 w-4 text-green-600" /></Button>
//                     <Button variant="ghost" onClick={() => setNewItem(null)}><X className="h-4 w-4 text-gray-600" /></Button>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {items.length === 0 && !newItem && <div className="text-center p-4 text-gray-500">No inspection items.</div>}
//         </div>

//         <div className="mt-4">
//           <Button variant="secondary" onClick={addRow} disabled={!!newItem}><PlusCircle className="h-4 w-4 mr-2" /> Add Item</Button>
//         </div>
//       </Card>

//       {/* datalist options for auto-suggest */}
//       <datalist id="items-list">
//         {categories.map((cat, i) => <option key={i} value={cat.name} />)}
//       </datalist>

//       <datalist id="category-list">
//         {Object.keys(multipliers).map((name, i) => <option key={i} value={name} />)}
//       </datalist>
//     </div>
//   );
// };

// export default InspectionStep;


// unfaire
// import { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit, Save, X } from "lucide-react";

// const InspectionStep = () => {
//   // Vehicle details
//   const [details, setDetails] = useState({
//     vehicleNo: "",
//     ownerName: "",
//     inspectionDate: "",
//     branch: "",
//   });

//   // Inspection items
//   const [items, setItems] = useState(() => {
//     try {
//       const saved = localStorage.getItem("inspectionItems");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   // Categories from Category Manager (localStorage)
//   const [categories, setCategories] = useState(() => {
//     try {
//       const saved = localStorage.getItem("categories");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   // Sync categories dynamically
//   useEffect(() => {
//     const loadCats = () => {
//       try {
//         const saved = localStorage.getItem("categories");
//         setCategories(saved ? JSON.parse(saved) : []);
//       } catch {
//         setCategories([]);
//       }
//     };
//     loadCats();

//     const onCats = () => loadCats();
//     const onStorage = (e) => { if (e.key === "categories") loadCats(); };

//     window.addEventListener("categoriesUpdated", onCats);
//     window.addEventListener("storage", onStorage);

//     return () => {
//       window.removeEventListener("categoriesUpdated", onCats);
//       window.removeEventListener("storage", onStorage);
//     };
//   }, []);

//   // Editing / new row state
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [newItem, setNewItem] = useState(null);

//   // Multipliers only for specific categories
//   const multipliers = {
//     Hardware: 2,
//     Steel: 1.5,
//     Labour: 2,
//     Parts: 1.5,
//   };

//   // Save items to localStorage
//   useEffect(() => {
//     try {
//       localStorage.setItem("inspectionItems", JSON.stringify(items));
//     } catch {}
//   }, [items]);

//   // Vehicle details handlers
//   const handleDetailChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });
//   const saveDetails = () => { alert("Vehicle details saved!"); };

//   // Add / edit / delete row
//   const addRow = () => setNewItem({ item: "", category: "", condition: "OK", cost: "0" });

//   const saveNewRow = () => {
//     if (!newItem || !newItem.item?.trim()) { alert("Enter item name."); return; }
//     setItems([...items, newItem]);
//     setNewItem(null);
//   };

//   const editRow = (index) => setEditingIndex(index);

//   const saveEditRow = (index) => {
//     const it = items[index];
//     if (!it || !it.item?.trim()) { alert("Item cannot be empty."); return; }
//     setEditingIndex(null);
//   };

//   const deleteRow = (index) => setItems(items.filter((_, i) => i !== index));

//   // Calculate total with multiplier only for specific categories
//   const calculateTotal = (item) => {
//     const cost = parseFloat(item?.cost) || 0;
//     const cat = item?.category?.trim();
//     const multiplier = multipliers[cat] || 1; // default 1x for other/manual categories
//     return (cost * multiplier).toFixed(2);
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Vehicle Inspection</h3>

//       {/* Vehicle Details */}
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//           <div>
//             <label>Vehicle No:</label>
//             <input type="text" name="vehicleNo" value={details.vehicleNo} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>
//           <div>
//             <label>Owner Name:</label>
//             <input type="text" name="ownerName" value={details.ownerName} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>
//           <div>
//             <label>Inspection Date:</label>
//             <input type="date" name="inspectionDate" value={details.inspectionDate} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>
//           <div>
//             <label>Branch:</label>
//             <input type="text" name="branch" value={details.branch} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
//           </div>
//         </div>
//         <div className="flex justify-end mt-4">
//           <Button onClick={saveDetails}><Save className="h-4 w-4 mr-2" /> Save Details</Button>
//         </div>
//       </Card>

//       {/* Inspection Items */}
//       <Card title="Inspection Items">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-2">Item</th>
//                 <th className="p-2">Category</th>
//                 <th className="p-2">Condition</th>
//                 <th className="p-2">Cost (₹)</th>
//                    <th className="p-2">Total (₹)</th>
                   
             
                
//                 <th className="p-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((it, index) =>
//                 editingIndex === index ? (
//                   <tr key={index} className="bg-blue-50">
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={it.item}
//                         onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], item: e.target.value }; 
//                         setItems(copy); }}
//                         list="items-list"
//                         placeholder="Type or select item"
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={it.category}
//                         onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], category: e.target.value }; 
//                         setItems(copy); }}
//                         list="items-list"
//                         placeholder="Type or select category"
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>


//                     <td className="p-2">
//                       <select value={it.condition} onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], condition: e.target.value }; setItems(copy); }} className="w-full p-1 border rounded-lg">
//                         <option>OK</option>
//                         <option>Repair Needed</option>
//                         <option>Replace</option>
//                         <option>Damage</option>
//                       </select>
//                     </td>
//                     <td className="p-2">
//                       <input type="number"
//                        value={it.cost}
//                         onChange={(e) => 
//                         { const copy = [...items]; copy[index] = { ...copy[index], cost: e.target.value };
//                          setItems(copy); }} 
//                          className="w-24 p-1 border rounded-lg" />
//                     </td>

    
                        


                    

                            





//                     <td className="p-2">{calculateTotal(it)}</td>

//                     <td className="p-2 text-right space-x-1">

//                            <Button variant="ghost" onClick={() => saveEditRow(index)}><Save className="h-4 w-4 text-green-600" /></Button>

//                       <Button variant="ghost" onClick={() => setEditingIndex(null)}><X className="h-4 w-4 text-gray-600" /></Button>

//                     </td>
//                   </tr>
//                 ) : (
//                   <tr key={index}>
//                     <td className="p-2">{it.item}</td>
//                     <td className="p-2">{it.category}</td>
//                     <td className="p-2">{it.condition}</td>
//                     <td className="p-2">{it.cost}</td>
//                     <td className="p-2">{calculateTotal(it)}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" onClick={() => editRow(index)}><Edit className="h-4 w-4 text-blue-600" /></Button>
//                       <Button variant="ghost" onClick={() => deleteRow(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
//                     </td>
//                   </tr>
//                 )
//               )}

//               {newItem && (
//                 <tr className="bg-blue-50">
//                   <td className="p-2">
//                     <input type="text" value={newItem.item} onChange={(e) => setNewItem({ ...newItem, item: e.target.value })} list="items-list" placeholder="Type or select item" className="w-full p-1 border rounded-lg" />
//                   </td>
//                   <td className="p-2">
//                     <input type="text" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} list="items-list" placeholder="Type or select category" className="w-full p-1 border rounded-lg" />
//                   </td>
//                   <td className="p-2">
//                     <select value={newItem.condition} onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })} className="w-full p-1 border rounded-lg">
//                       <option>OK</option>
//                       <option>Repair Needed</option>
//                       <option>Replace</option>
//                       <option>Damage</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input type="number" value={newItem.cost} onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })} className="w-24 p-1 border rounded-lg" />
//                   </td>





                     

//                   <td className="p-2">{calculateTotal(newItem)}</td>
//                   <td className="p-2 text-right space-x-1">
//                     <Button variant="ghost" onClick={saveNewRow}><Save className="h-4 w-4 text-green-600" /></Button>
//                     <Button variant="ghost" onClick={() => setNewItem(null)}><X className="h-4 w-4 text-gray-600" /></Button>
//                   </td>



                      



//                 </tr>
//               )}




//             </tbody>
//           </table>

//           {items.length === 0 && !newItem && <div className="text-center p-4 text-gray-500">No inspection items.</div>}
//         </div>

//         <div className="mt-4">
//           <Button variant="secondary" onClick={addRow} disabled={!!newItem}><PlusCircle className="h-4 w-4 mr-2" /> Add Item</Button>
//         </div>
//       </Card>

//       {/* Datalist for suggestions only from Category Manager */}
//       <datalist id="items-list">
//         {categories.map((cat, i) => <option key={i} value={cat.name} />)}
//       </datalist>
//     </div>
//   );
// };

// export default InspectionStep;



import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PlusCircle, Trash2, CreditCard as Edit, Save, X } from "lucide-react";

const InspectionStep = () => {
  // Vehicle details
  const [details, setDetails] = useState({
    vehicleNo: "",
    ownerName: "",
    inspectionDate: "",
    branch: "",
  });

  // Inspection items
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("inspectionItems");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Categories from Category Manager (localStorage)
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("categories");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync categories dynamically
  useEffect(() => {
    const loadCats = () => {
      try {
        const saved = localStorage.getItem("categories");
        setCategories(saved ? JSON.parse(saved) : []);
      } catch {
        setCategories([]);
      }
    };
    loadCats();

    const onCats = () => loadCats();
    const onStorage = (e) => { if (e.key === "categories") loadCats(); };

    window.addEventListener("categoriesUpdated", onCats);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("categoriesUpdated", onCats);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Editing / new row state
  const [editingIndex, setEditingIndex] = useState(null);
  const [newItem, setNewItem] = useState(null);

  // Default multipliers
  const multipliers = {
    Hardware: 2,
    Steel: 1.5,
    Labour: 2,
    Parts: 1.5,
  };

  // Save items to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("inspectionItems", JSON.stringify(items));
    } catch {}
  }, [items]);

  // Vehicle details handlers
  const handleDetailChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });
  const saveDetails = () => { alert("Vehicle details saved!"); };

  // Add / edit / delete row
  const addRow = () => setNewItem({ item: "", category: "", condition: "OK", cost: "0", multiplier: 1 });

  const saveNewRow = () => {
    if (!newItem || !newItem.item?.trim()) { alert("Enter item name."); return; }
    setItems([...items, newItem]);
    setNewItem(null);
  };

  const editRow = (index) => setEditingIndex(index);

  const saveEditRow = (index) => {
    const it = items[index];
    if (!it || !it.item?.trim()) { alert("Item cannot be empty."); return; }
    setEditingIndex(null);
  };

  const deleteRow = (index) => setItems(items.filter((_, i) => i !== index));

  // Calculate total with multiplier (manual or default)
  const calculateTotal = (item) => {
    const cost = parseFloat(item?.cost) || 0;
    const multiplier = parseFloat(item?.multiplier) || multipliers[item?.category?.trim()] || 1;
    return (cost * multiplier).toFixed(2);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Vehicle Inspection</h3>

      {/* Vehicle Details */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label>Vehicle No:</label>
            <input type="text" name="vehicleNo" value={details.vehicleNo} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
          <div>
            <label>Owner Name:</label>
            <input type="text" name="ownerName" value={details.ownerName} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
          <div>
            <label>Inspection Date:</label>
            <input type="date" name="inspectionDate" value={details.inspectionDate} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
          <div>
            <label>Branch:</label>
            <input type="text" name="branch" value={details.branch} onChange={handleDetailChange} className="w-full mt-1 p-2 border rounded-lg" />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={saveDetails}><Save className="h-4 w-4 mr-2" /> Save Details</Button>
        </div>
      </Card>

      {/* Inspection Items */}
      <Card title="Inspection Items">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-2">Item</th>
                <th className="p-2">Category</th>
                <th className="p-2">Condition</th>
                <th className="p-2">Cost (₹)</th>
                <th className="p-2">Multiplier</th>
                <th className="p-2">Total (₹)</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, index) =>
                editingIndex === index ? (
                  <tr key={index} className="bg-blue-50">
                    <td className="p-2">
                      <input
                        type="text"
                        value={it.item}
                        onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], item: e.target.value }; setItems(copy); }}
                        list="items-list"
                        placeholder="Type or select item"
                        className="w-full p-1 border rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={it.category}
                        onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], category: e.target.value }; setItems(copy); }}
                        list="items-list"
                        placeholder="Type or select category"
                        className="w-full p-1 border rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <select value={it.condition} onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], condition: e.target.value }; setItems(copy); }} className="w-full p-1 border rounded-lg">
                        <option>OK</option>
                        <option>Repair Needed</option>
                        <option>Replace</option>
                        <option>Damage</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input type="number"
                        value={it.cost}
                        onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], cost: e.target.value }; setItems(copy); }}
                        className="w-24 p-1 border rounded-lg"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={it.multiplier ?? multipliers[it.category] ?? 1}
                        onChange={(e) => { const copy = [...items]; copy[index] = { ...copy[index], multiplier: parseFloat(e.target.value) || 1 }; setItems(copy); }}
                        className="w-24 p-1 border rounded-lg"
                        placeholder="Multiplier"
                      />
                    </td>
                    <td className="p-2">{calculateTotal(it)}</td>
                    <td className="p-2 text-right space-x-1">
                      <Button variant="ghost" onClick={() => saveEditRow(index)}><Save className="h-4 w-4 text-green-600" /></Button>
                      <Button variant="ghost" onClick={() => setEditingIndex(null)}><X className="h-4 w-4 text-gray-600" /></Button>
                    </td>
                  </tr>
                ) : (
                  <tr key={index}>
                    <td className="p-2">{it.item}</td>
                    <td className="p-2">{it.category}</td>
                    <td className="p-2">{it.condition}</td>
                    <td className="p-2">{it.cost}</td>
                    <td className="p-2">{it.multiplier ?? multipliers[it.category] ?? 1}</td>
                    <td className="p-2">{calculateTotal(it)}</td>
                    <td className="p-2 text-right space-x-1">
                      <Button variant="ghost" onClick={() => editRow(index)}><Edit className="h-4 w-4 text-blue-600" /></Button>
                      <Button variant="ghost" onClick={() => deleteRow(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </td>
                  </tr>
                )
              )}

              {newItem && (
                <tr className="bg-blue-50">
                  <td className="p-2">
                    <input type="text" value={newItem.item} onChange={(e) => setNewItem({ ...newItem, item: e.target.value })} list="items-list" placeholder="Type or select item" className="w-full p-1 border rounded-lg" />
                  </td>
                  <td className="p-2">
                    <input type="text" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} list="items-list" placeholder="Type or select category" className="w-full p-1 border rounded-lg" />
                  </td>
                  <td className="p-2">
                    <select value={newItem.condition} onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })} className="w-full p-1 border rounded-lg">
                      <option>OK</option>
                      <option>Repair Needed</option>
                      <option>Replace</option>
                      <option>Damage</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input type="number" value={newItem.cost} onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })} className="w-24 p-1 border rounded-lg" />
                  </td>
                  <td className="p-2">
                    <input type="number" value={newItem.multiplier ?? multipliers[newItem.category] ?? 1} onChange={(e) => setNewItem({ ...newItem, multiplier: parseFloat(e.target.value) || 1 })} className="w-24 p-1 border rounded-lg" placeholder="Multiplier" />
                  </td>
                  <td className="p-2">{calculateTotal(newItem)}</td>
                  <td className="p-2 text-right space-x-1">
                    <Button variant="ghost" onClick={saveNewRow}><Save className="h-4 w-4 text-green-600" /></Button>
                    <Button variant="ghost" onClick={() => setNewItem(null)}><X className="h-4 w-4 text-gray-600" /></Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {items.length === 0 && !newItem && <div className="text-center p-4 text-gray-500">No inspection items.</div>}
        </div>

        <div className="mt-4">
          <Button variant="secondary" onClick={addRow} disabled={!!newItem}><PlusCircle className="h-4 w-4 mr-2" /> Add Item</Button>
        </div>
      </Card>

      {/* Datalist for suggestions only from Category Manager */}
      <datalist id="items-list">
        {categories.map((cat, i) => <option key={i} value={cat.name} />)}
      </datalist>
    </div>
  );
};

export default InspectionStep;
