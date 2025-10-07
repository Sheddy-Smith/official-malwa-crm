// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import useJobsStore from "@/store/jobsStore";
// import useLabourStore from "@/store/labourStore";
// import useVendorStore from "@/store/vendorStore";
// import { PlusCircle } from "lucide-react";

// const JobSheetStep = ({ jobId }) => {
//     const job = useJobsStore(state => state.jobs[jobId]);
//     const { labours } = useLabourStore();
//     const { vendors } = useVendorStore();

//     if (!job) return <div>Loading Job...</div>;

//     const items = job.estimate.items;

//     return (
//         <div className="space-y-4">
//             <h3 className="text-xl font-bold text-brand-dark dark:text-dark-text">Job Sheet</h3>
//             <Card title="Tasks from Estimate">
//                  <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                         <thead className="bg-gray-50 dark:bg-gray-700 text-left">
//                             <tr>
//                                 {['#', 'Description', 'Work By', 'Work Done Notes'].map(h => <th key={h} className="p-2">{h}</th>)}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {items.map((item, index) => (
//                                 <tr key={item.id} className="border-b dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800/50">
//                                     <td className="p-2">{index + 1}</td>
//                                     <td className="p-2 font-medium">{item.description}</td>
//                                     <td className="p-2">
//                                         <select className="w-full p-1 bg-transparent border rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-brand-red">
//                                             <option value="">Assign to...</option>
//                                             <optgroup label="In-house Labour">
//                                                 {labours.map(l => <option key={l.id} value={`labour_${l.id}`}>{l.name}</option>)}
//                                             </optgroup>
//                                             <optgroup label="Vendors">
//                                                 {vendors.map(v => <option key={v.id} value={`vendor_${v.id}`}>{v.name}</option>)}
//                                             </optgroup>
//                                         </select>
//                                     </td>
//                                     <td className="p-2">
//                                         <input type="text" placeholder="Enter notes..." className="w-full p-1 bg-transparent border rounded-lg dark:border-gray-600 focus:ring-2 focus:ring-brand-red"/>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </Card>
//             <Card title="Extra Work">
//                 <p className="text-sm text-gray-500 dark:text-dark-text-secondary">
//                     Use this section to add any work or parts that were not included in the original estimate. Costs will be calculated with multipliers and posted to ledgers.
//                 </p>
//                 <div className="mt-4">
//                     <Button variant="secondary"><PlusCircle className="h-4 w-4 mr-2"/> Add Extra Work</Button>
//                 </div>
//             </Card>
//              <div className="flex justify-end pt-4">
//                 <Button>Finalize JobSheet & Post to Ledgers</Button>
//             </div>
//         </div>
//     );
// };

// export default JobSheetStep;



// import React, { useState } from "react";

// const JobSheetStep = () => {
  
//  return (
//     <div className="space-y-4 p-4">
//       <h3 className="text-xl font-bold">Job Sheet</h3>

//       {/* Tasks from Estimate */}
//       <div className="border rounded-lg p-3 shadow">
//         <h4 className="font-semibold mb-2">Tasks from Estimate</h4>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-100 text-left">
//              <tr>
//         <th>Description</th>
//          <th>Work By</th>
//           <th>Work Done Notes</th>
//            <th>1</th>
//       </tr>
//             </thead>
//             <tbody>
            
//             </tbody>
//           </table>
//         </div>
//       </div>

// {/* Extra Work Section */}
//       <div className="border rounded-lg p-3 shadow">
//         <h4 className="font-semibold mb-2">Extra Work</h4>
//         <p className="text-sm text-gray-500">
//           Use this section to add any work or parts not included in the
//           estimate.
//         </p>
//         <div className="mt-3">
//           <button className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded">
//             ➕ Add Extra Work
//           </button>
//         </div>
//       </div>

//       {/* Finalize Button */}
//       <div className="flex justify-end pt-4">
//         <button className="bg-blue-600 text-white px-4 py-2 rounded">
//           Finalize JobSheet & Post to Ledgers
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JobSheetStep;


// import React, { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { Trash2, Edit, Trash } from "lucide-react";

// const JobSheetStep = () => {
//   const [items, setItems] = useState([]);
//   const [jobData, setJobData] = useState([]);
//   const [open,setopen] = useState(false);
//   const [row , setrow] =useState([
//   { category: "Parts", item: "Brake", condition: "OK", cost: 100, total: 150 },
//     { category: "Labour", item: "Paint", condition: "Repair", cost: 200, total: 400 },
//   ])

//   useEffect(() => {
//     // Vehicle Inspection ke items localStorage se load karo
//     const savedItems = localStorage.getItem("inspectionItems");
//     if (savedItems) {
//       const parsed = JSON.parse(savedItems);
//       // Initial JobSheet data (Work By aur Notes empty)
//       const initialJob = parsed.map((item) => ({
//         ...item,
//         workBy: "Labour", // default
//         notes: "",
//       }));
//       setItems(parsed);
//       setJobData(initialJob);
//     }
//   }, []);

//   const handleChangeWorkBy = (index, value) => {
//     const updated = [...jobData];
//     updated[index].workBy = value;
//     setJobData(updated);
//   };

//   const handleChangeNotes = (index, value) => {
//     const updated = [...jobData];
//     updated[index].notes = value;
//     setJobData(updated);
//   };

//   const deleteRow = (index) => {
//     const updatedItems = jobData.filter((_, i) => i !== index);
//     setJobData(updatedItems);
//   };

//   return (
//     <div className="space-y-4 p-4">
//       <h3 className="text-xl font-bold">Job Sheet</h3>

//       <Card>
//         <h4 className="font-semibold mb-2">Tasks from Estimate</h4>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm border">
//             <thead className="bg-gray-100 text-left">
//               <tr>
//                 <th className="p-2 border">Category</th>
//                 <th className="p-2 border">Item</th>
//                 <th className="p-2 border">Condition</th>
//                 <th className="p-2 border">Cost (₹)</th>
//                 <th className="p-2 border">Total (₹)</th>
//                 <th className="p-2 border">Work By</th>
//                 <th className="p-2 border">Notes</th>
//                 <th className="p-2 border text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {jobData.length === 0 && (
//                 <tr>
//                   <td colSpan={8} className="p-4 text-center text-gray-500">
//                     No tasks available.
//                   </td>
//                 </tr>
//               )}

//               {jobData.map((item, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="p-2">{item.category}</td>
//                   <td className="p-2">{item.item}</td>
//                   <td className="p-2">{item.condition}</td>
//                   <td className="p-2">{item.cost}</td>
//                   <td className="p-2">
//                     {((parseFloat(item.cost) || 0) * (item.item === "Parts" ? 1.5 : item.item === "Labour" ? 2 : item.item === "Hardware" ? 2 : item.item === "Steel" ? 1.5 : 1)).toFixed(2)}
//                   </td>
//                   <td className="p-2">
//                     <select
//                       value={item.workBy}
//                       onChange={(e) => handleChangeWorkBy(index, e.target.value)}
//                       className="p-1 border rounded w-full"
//                     >
//                       <option value="Labour">Labour</option>
//                       <option value="Vendor">Vendor</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={item.notes}
//                       onChange={(e) => handleChangeNotes(index, e.target.value)}
//                       placeholder="Work done notes"
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2 text-right">
//                     <Button variant="ghost" onClick={() => deleteRow(index)}>
//                       <Trash2 className="h-4 w-4 text-red-500" />
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>


//       {/* Extra Work Section */}
//       <Card> 
//         {/* heading */}
//         <div className="flex gap-[40rem]">
//         <h4 className="font-semibold mb-2">Extra Work</h4>
//       <Button  onClick={()=>(setopen(true))}  variant="secondary">➕ Add Extra Work</Button>
// </div>


// { open&& <div >
//   <table className="w-full mt-[10px]">
//   <thead className="border-2  ">
// <tr  >
//   <th className="border p-2 ">category</th>
//   <th className="border p-2 ">item</th>
//   <th className="border p-2 " >Condition</th>
//   <th className="border p-2 ">Cost(₹)</th>
//   <th className="border p-2 ">Total(₹)</th>
//   <th className="border p-2 ">Work by</th>
//   <th className="border p-2 ">Notes</th>
//   <th className="border p-2 ">Actions</th>
// </tr>
// </thead>
// <tbody>
  
//   { <tr className=" outline-none " >
//     <td className="border border-collapse ">   <input className=" w-full  border-none " placeholder="Category" type="text" />  </td>
//     <td className="border border-collapse  ">  <input className=" w-full border-none "  placeholder="item"    type="text" />  </td>
//     <td className="border border-collapse  ">  <input className=" w-full border-none "  placeholder="condition"    type="text" />  </td>
//     <td className="border border-collapse  ">  <input className=" w-full border-none  " placeholder="cost(₹)"     type="text" />  </td>
//     <td className="border border-collapse  ">  <input className=" w-full border-none  " placeholder="Total(₹)"     type="text" />  </td>
//     <td className="border border-collapse   "> <select className="rounded-lg"><option>vendor</option><option>Labour</option></select></td>
//     <td className="border border-collapse  ">  <input className=" w-full border-none   " type="text" />  </td>
//     <td className="border border-collapse  "> <button  > <Trash2 className="ml-[15px]  text-red-500 w-[48px] h-[30px] p-[7px] rounded-lg hover:bg-blue-100 "/></button></td>
//   </tr>}

// </tbody>

// </table>
// </div>
// }
// </Card>

//              {/* Finalize JobSheet */}
//       <div className="flex justify-end pt-4">
//         <Button className="bg-blue-600 text-white">Finalize JobSheet & Post to Ledgers</Button>
//       </div>
//     </div>
//   );
// };

// export default JobSheetStep;




//   import {  Trash2 } from "lucide-react";
//   import React, { useState, useEffect } from "react";

//   // Helper function for total calculation
//   const multipliers = {
//     Parts: 1.5,
//     Labour: 2,
//     Hardware: 2,
//     Steel: 1.5,
//   };

// const calculateTotal = (item) => {
//     const cost = parseFloat(item.cost) || 0;
//     const multiplier = multipliers[item.item] || 1;
//     return (cost * multiplier).toFixed(2);
//   };


//   const JobSheetStep = () => {
//     // Load Estimate items from localStorage
//     const [estimateItems, setEstimateItems] = useState(() => {
//       const saved = localStorage.getItem("inspectionItems");
//       return saved ? JSON.parse(saved) : [];
//     });

//     // Extra Work items
//     const [extraWork, setExtraWork] = useState([]);

//     // Add new extra work row
//     const addExtraWork = () => {
//       setExtraWork([
//         ...extraWork,
//         {
//           category: "",
//           item: "",
//           condition: "OK",
//           cost: 0,
//           workBy: "Labour",
//           notes: "",
//         },
//       ]);
//     };

//     // Update Extra Work field
//     const handleExtraWorkChange = (index, field, value) => {
//       const updated = [...extraWork];
//       updated[index][field] = value;
//       setExtraWork(updated);
//     };

//     // Delete Extra Work row
//     const deleteExtraWork = (index) => {
//       const updated = extraWork.filter((_, i) => i !== index);
//       setExtraWork(updated);
//     };

//     return (
//       <div className="space-y-6 p-4">
//         <h3 className="text-xl font-bold">Job Sheet</h3>

//         {/* Tasks from Estimate */}
//         <div className="border rounded-lg p-4 shadow">
//           <h4 className="font-semibold mb-2">Tasks from Estimate</h4>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border">Category</th>
//                   <th className="p-2 border">Item</th>
//                   <th className="p-2 border">Condition</th>
//                   <th className="p-2 border">Cost (₹)</th>
//                   <th className="p-2 border">Total (₹)</th>
//                   <th className="p-2 border">Work By</th>
//                   <th className="p-2 border">Work Done Notes</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {estimateItems.length === 0 && (
//                   <tr>
//                     <td colSpan={7} className="text-center p-4 text-gray-500">
//                       No items in Estimate.
//                     </td>
//                   </tr>
//                 )}
//                 {estimateItems.map((item, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="p-2">{item.category}</td>
//                     <td className="p-2">{item.item}</td>
//                     <td className="p-2">{item.condition}</td>
//                     <td className="p-2">{item.cost}</td>
//                     <td className="p-2">{calculateTotal(item)}</td>
//                     <td className="p-2">
//                       <select className="p-1 border rounded w-full">
//                         <option value="Labour">Labour</option>
//                         <option value="Vendor">Vendor</option>
//                       </select>
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         placeholder="Notes..."
//                         className="w-full p-1 border rounded"
//                       />
//                     </td>
//                   </tr>
//                 ))}
        
//               </tbody>
//             </table>
                    
//                 </div>
//         </div>

//         {/* Extra Work Section */}
//         <div className="border rounded-lg p-4 shadow">
//           <div className="flex justify-between items-center mb-2">
//             <h4 className="font-semibold">Extra Work</h4>
//             <button
//               onClick={addExtraWork}
//               className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
//             >
//               ➕ Add Extra Work
//             </button>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border">Category</th>
//                   <th className="p-2 border">Item</th>
//                   <th className="p-2 border">Condition</th>
//                   <th className="p-2 border">Cost (₹)</th>
//                   <th className="p-2 border">Total (₹)</th>
//                   <th className="p-2 border">Work By</th>
//                   <th className="p-2 border">Work Done Notes</th>
//                   <th className="p-2 border">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {extraWork.length === 0 && (
//                   <tr>
//                     <td colSpan={8} className="text-center p-4 text-gray-500">
//                       No extra work added.
//                     </td>
//                   </tr>
//                 )}
//                 {extraWork.map((item, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.category}
//                         onChange={(e) =>
//                           handleExtraWorkChange(index, "category", e.target.value)
//                         }
//                         className="w-full p-1 border rounded"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.item}
//                         onChange={(e) =>
//                           handleExtraWorkChange(index, "item", e.target.value)
//                         }
//                         className="w-full p-1 border rounded"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.condition}
//                         onChange={(e) =>
//                           handleExtraWorkChange(index, "condition", e.target.value)
//                         }
//                         className="w-full p-1 border rounded"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="number"
//                         value={item.cost}
//                         onChange={(e) =>
//                           handleExtraWorkChange(index, "cost", e.target.value)
//                         }
//                         className="w-24 p-1 border rounded"
//                       />
//                     </td>
//                     <td className="p-2">{calculateTotal(item)}</td>
//                     <td className="p-2">
//                       <select
//                         value={item.workBy}
//                         onChange={(e) =>
//                           handleExtraWorkChange(index, "workBy", e.target.value)
//                         }
//                         className="p-1 border rounded w-full text-sm"
//                       >
//                         <option value="Labour">Labour</option>
//                         <option value="Vendor">Vendor</option>
//                       </select>
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.notes}
//                         onChange={(e) =>
//                           handleExtraWorkChange(index, "notes", e.target.value)
//                         }
//                         placeholder="Work done notes"
//                         className="w-full p-1 border rounded"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <button
//                         onClick={() => deleteExtraWork(index)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                     <Trash2 className="p-[3px] ml-[10px] "/>
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Finalize Button */}
//         <div className="flex justify-end pt-4">
//           <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//             Finalize JobSheet & Post to Ledgers
//           </button>
//         </div>
//       </div>
//     );
//   };

//   export default JobSheetStep;


// runing code but not save extra work 
// import { Trash2 } from "lucide-react";
// import React, { useState } from "react";

// // Helper function for total calculation
// const multipliers = {
//   Parts: 1.5,
//   Labour: 2,
//   Hardware: 2,
//   Steel: 1.5,
// };

// const calculateTotal = (item) => {
//   const cost = parseFloat(item.cost) || 0;
//   const multiplier = multipliers[item.item] || 1;
//   return cost * multiplier;
// };

// const JobSheetStep = () => {
//   // Load Estimate items from localStorage
//   const [estimateItems] = useState(() => {
//     const saved = localStorage.getItem("inspectionItems");
//     return saved ? JSON.parse(saved) : [];
//   });

//   // Extra Work items
//   const [extraWork, setExtraWork] = useState([]);

//   // Add new extra work row
//   const addExtraWork = () => {
//     setExtraWork([
//       ...extraWork,
//       {
//         category: "",
//         item: "",
//         condition: "OK",
//         cost: 0,
//         workBy: "Labour",
//         notes: "",
//       },
//     ]);
//   };

//   // Update Extra Work field
//   const handleExtraWorkChange = (index, field, value) => {
//     const updated = [...extraWork];
//     updated[index][field] = value;
//     setExtraWork(updated);
//   };

//   // Delete Extra Work row
//   const deleteExtraWork = (index) => {
//     const updated = extraWork.filter((_, i) => i !== index);
//     setExtraWork(updated);
//   };

//   // Subtotals
//   const estimateSubTotal = estimateItems.reduce(
//     (acc, item) => acc + calculateTotal(item),
//     0
//   );
//   const extraWorkSubTotal = extraWork.reduce(
//     (acc, item) => acc + calculateTotal(item),
//     0
//   );
//   const grandTotal = estimateSubTotal + extraWorkSubTotal;

//   return (
//     <div className="space-y-6 p-4">
//       <h3 className="text-xl font-bold">Job Sheet</h3>

//       {/* Tasks from Estimate */}
//       <div className="border rounded-lg p-4 shadow">
//         <h4 className="font-semibold mb-2">Tasks from Estimate</h4>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">Category</th>
//                 <th className="p-2 border">Item</th>
//                 <th className="p-2 border">Condition</th>
//                 <th className="p-2 border">Cost (₹)</th>
//                 <th className="p-2 border">Total (₹)</th>
//                 <th className="p-2 border">Work By</th>
//                 <th className="p-2 border">Work Done Notes</th>
//               </tr>
//             </thead>
//             <tbody>
//               {estimateItems.length === 0 && (
//                 <tr>
//                   <td colSpan={7} className="text-center p-4 text-gray-500">
//                     No items in Estimate.
//                   </td>
//                 </tr>
//               )}
//               {estimateItems.map((item, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="p-2">{item.category}</td>
//                   <td className="p-2">{item.item}</td>
//                   <td className="p-2">{item.condition}</td>
//                   <td className="p-2">{item.cost}</td>
//                   <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                   <td className="p-2">
//                     <select className="p-1 border rounded w-full">
//                       <option value="Labour">Labour</option>
//                       <option value="Vendor">Vendor</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       placeholder="Notes..."
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Subtotal for Estimate */}
//         <div className="mt-3 text-right font-semibold">
//           Subtotal (Estimate): ₹{estimateSubTotal.toFixed(2)}
//         </div>
//       </div>

//       {/* Extra Work Section */}
//       <div className="border rounded-lg p-4 shadow">
//         <div className="flex justify-between items-center mb-2">
//           <h4 className="font-semibold">Extra Work</h4>
//           <button
//             onClick={addExtraWork}
//             className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
//           >
//             ➕ Add Extra Work
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm border">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="p-2 border">Category</th>
//                 <th className="p-2 border">Item</th>
//                 <th className="p-2 border">Condition</th>
//                 <th className="p-2 border">Cost (₹)</th>
//                 <th className="p-2 border">Total (₹)</th>
//                 <th className="p-2 border">Work By</th>
//                 <th className="p-2 border">Work Done Notes</th>
//                 <th className="p-2 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {extraWork.length === 0 && (
//                 <tr>
//                   <td colSpan={8} className="text-center p-4 text-gray-500">
//                     No extra work added.
//                   </td>
//                 </tr>
//               )}
//               {extraWork.map((item, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={item.category}
//                       onChange={(e) =>
//                         handleExtraWorkChange(index, "category", e.target.value)
//                       }
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={item.item}
//                       onChange={(e) =>
//                         handleExtraWorkChange(index, "item", e.target.value)
//                       }
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={item.condition}
//                       onChange={(e) =>
//                         handleExtraWorkChange(index, "condition", e.target.value)
//                       }
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="number"
//                       value={item.cost}
//                       onChange={(e) =>
//                         handleExtraWorkChange(index, "cost", e.target.value)
//                       }
//                       className="w-24 p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                   <td className="p-2">
//                     <select
//                       value={item.workBy}
//                       onChange={(e) =>
//                         handleExtraWorkChange(index, "workBy", e.target.value)
//                       }
//                       className="p-1 border rounded w-full text-sm"
//                     >
//                       <option value="Labour">Labour</option>
//                       <option value="Vendor">Vendor</option>
//                     </select>
//                   </td>
//                   <td className="p-2">
//                     <input
//                       type="text"
//                       value={item.notes}
//                       onChange={(e) =>
//                         handleExtraWorkChange(index, "notes", e.target.value)
//                       }
//                       placeholder="Work done notes"
//                       className="w-full p-1 border rounded"
//                     />
//                   </td>
//                   <td className="p-2">
//                     <button
//                       onClick={() => deleteExtraWork(index)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <Trash2 className="p-[3px] ml-[10px]" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Subtotal for Extra Work */}
//         <div className="mt-3 text-right font-semibold">
//           Subtotal (Extra Work): ₹{extraWorkSubTotal.toFixed(2)}
//         </div>
//       </div>

//       {/* Grand Total */}
//       <div className="text-right font-bold text-lg">
//         Grand Total: ₹{grandTotal.toFixed(2)}
//       </div>

//       {/* Finalize Button */}
//       <div className="flex justify-end pt-4">
//         <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//           Finalize JobSheet & Post to Ledgers
//         </button>
//       </div>
//     </div>
//   );
// };

// export default JobSheetStep;




import { Save, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";





// Helper function for total calculation
const multipliers = {
  Parts: 1.5,
  Labour: 2,
  Hardware: 2,
  Steel: 1.5,
};

const calculateTotal = (item) => {
  const cost = parseFloat(item.cost) || 0;
  const multiplier = multipliers[item.item] || 1;
  return cost * multiplier;
};

const JobSheetStep = () => {
  // Load Estimate items from localStorage
  const [estimateItems] = useState(() => {
    const saved = localStorage.getItem("inspectionItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Extra Work items (load from localStorage if available)
  const [extraWork, setExtraWork] = useState(() => {
    const saved = localStorage.getItem("extraWork");
    return saved ? JSON.parse(saved) : [];
  });

  // Save extra work to localStorage when button clicked
  const saveExtraWork = () => {
    localStorage.setItem("extraWork", JSON.stringify(extraWork));
    alert("✅ Extra Work saved successfully!");
  
  };

  // Add new extra work row
  const addExtraWork = () => {
    setExtraWork([
      ...extraWork,
      {
        category: "",
        item: "",
        condition: "OK",
        cost: 0,
        workBy: "Labour",
        notes: "",
      },
    ]);
  };

  // Update Extra Work field
  const handleExtraWorkChange = (index, field, value) => {
    const updated = [...extraWork];
    updated[index][field] = value;
    setExtraWork(updated);
  };

  // Delete Extra Work row
  const deleteExtraWork = (index) => {
    const updated = extraWork.filter((_, i) => i !== index);
    setExtraWork(updated);

     // ✅ localStorage me bhi update kar do
  localStorage.setItem("extraWork", JSON.stringify(updated));
  };

  // Subtotals
  const estimateSubTotal = estimateItems.reduce(
    (acc, item) => acc + calculateTotal(item),
    0
  );
  const extraWorkSubTotal = extraWork.reduce(
    (acc, item) => acc + calculateTotal(item),
    0
  );
  const grandTotal = estimateSubTotal + extraWorkSubTotal;

  return (
    <div className="space-y-6 p-4">
      <h3 className="text-xl font-bold">Job Sheet</h3>

      {/* Tasks from Estimate */}
      <div className="border rounded-lg p-4 shadow">
        <h4 className="font-semibold mb-2">Tasks from Estimate</h4>
      
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Condition</th>
                <th className="p-2 border">Cost (₹)</th>
                <th className="p-2 border">Total (₹)</th>
                <th className="p-2 border">Work By</th>
                <th className="p-2 border">Work Done Notes</th>
              </tr>
            </thead>
            <tbody>
              {estimateItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-4 text-gray-500">
                    No items in Estimate.
                  </td>
                </tr>
              )}
              {estimateItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.item}</td>
                  <td className="p-2">{item.condition}</td>
                  <td className="p-2">{item.cost}</td>
                  <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
                  <td className="p-2">
                    <select className="p-1 border rounded w-full">
                      <option value="Labour">Labour</option>
                      <option value="Vendor">Vendor</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder="Notes..."
                      className="w-full p-1 border rounded"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subtotal for Estimate */}
        <div className="mt-3 text-right font-semibold">
          Subtotal (Estimate): ₹{estimateSubTotal.toFixed(2)}
        </div>
      </div>

      {/* Extra Work Section */}
      <div className="border rounded-lg p-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">Extra Work</h4>
          <div className="flex gap-2">
            <button
              onClick={addExtraWork}
              className="flex items-center gap-1 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              ➕ Add Extra Work
            </button>
            <button
              onClick={saveExtraWork}
              
            >
            <Save className=" bg-white text-green-500 rounded  text-xl "/>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Item</th>
                <th className="p-2 border">Condition</th>
                <th className="p-2 border">Cost (₹)</th>
                <th className="p-2 border">Total (₹)</th>
                <th className="p-2 border">Work By</th>
                <th className="p-2 border">Work Done Notes</th>
                <th className="p-2 border">Actions</th>
                
              </tr>
            </thead>
            <tbody>
              {extraWork.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-4 text-gray-500">
                    No extra work added.
                  </td>
                </tr>
              )}
              {extraWork.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) =>
                        handleExtraWorkChange(index, "category", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) =>
                        handleExtraWorkChange(index, "item", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.condition}
                      onChange={(e) =>
                        handleExtraWorkChange(index, "condition", e.target.value)
                      }
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.cost}
                      onChange={(e) =>
                        handleExtraWorkChange(index, "cost", e.target.value)
                      }
                      className="w-24 p-1 border rounded"
                    />
                  </td>
                  <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
                  <td className="p-2">
                    <select
                      value={item.workBy}
                      onChange={(e) =>
                        handleExtraWorkChange(index, "workBy", e.target.value)
                      }
                      className="p-1 border rounded w-full text-sm"
                    >
                      <option value="Labour">Labour</option>
                      <option value="Vendor">Vendor</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) =>
                        handleExtraWorkChange(index, "notes", e.target.value)
                      }
                      placeholder="Work done notes"
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => deleteExtraWork(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2  className="p-[3px] ml-[10px]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subtotal for Extra Work */}
        <div className="mt-3 text-right font-semibold">
          Subtotal (Extra Work): ₹{extraWorkSubTotal.toFixed(2)}
        </div>
      </div>

      {/* Grand Total */}
      <div className="text-right font-bold text-lg">
        Grand Total: ₹{grandTotal.toFixed(2)}
      </div>

      {/* Finalize Button */}
      <div className="flex justify-end pt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Finalize JobSheet & Post to Ledgers
        </button>
      </div>
    </div>
  );
};

export default JobSheetStep;
