// import { useEffect } from 'react';
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import useJobsStore from '@/store/jobsStore';
// import { toast } from 'sonner';
// import { AlertTriangle } from 'lucide-react';
// import EstimateNewBodyTable from '@/components/jobs/EstimateNewBodyTable';

// const EstimateStep = ({ jobId }) => {
//     const { jobs, generateEstimateFromInspection, approveEstimate } = useJobsStore();
//     const job = jobs[jobId];

//     useEffect(() => {
//         if (jobId && job.inspection.items.length > 0 && job.estimate.items.length === 0) {
//             generateEstimateFromInspection(jobId);
//         }
//     }, [jobId, job, generateEstimateFromInspection]);
    
//     if (!job) return <div>Loading...</div>;

//     const handleApprove = () => { 
//         approveEstimate(jobId);
//         toast.success("Estimate approved!"); 
//     };

//     return (
//         <div className="space-y-4 text-brand-dark dark:text-dark-text">
//             <div className="flex justify-between items-center">
//                 <h3 className="text-xl font-bold">Estimate</h3>
//             </div>
//             {job.estimate.approvalNeeded && (
//                 <div className="p-4 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-xl flex items-center justify-between transition-opacity duration-300">
//                     <div className="flex items-center"><AlertTriangle className="h-5 w-5 mr-3"/><p className="text-sm font-medium">Admin Approval Required for discount  5%.</p></div>
//                     <Button onClick={handleApprove}>Approve</Button>
//                 </div>
//             )}
            
//             <EstimateNewBodyTable jobId={jobId} />
//         </div>
//     );
// };
// export default EstimateStep;

// import { useEffect, useState } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { Trash2, Edit, Save } from "lucide-react";
// import jsPDF from "jspdf";

// const EstimateStep = () => {
//   const [items, setItems] = useState([]);
//   const [editingIndex, setEditingIndex] = useState(null);
//   const [discount, setDiscount] = useState(0);

//   // Load inspection items from localStorage
//   useEffect(() => {
//     const savedItems = localStorage.getItem("inspectionItems");
//     if (savedItems) {
//       setItems(JSON.parse(savedItems));
//     }
//   }, []);

//   const multipliers = {
//     Parts: 1.5,
//     Labour: 2,
//     Hardware: 2,
//     Steel: 1.5,
//   };

//   // Calculate total per item
//   const calculateTotal = (item) => {
//     const cost = parseFloat(item.cost) || 0;
//     const multiplier = multipliers[item.item] || 1;
//     return cost * multiplier;
//   };

//   const grandTotal = items.reduce((acc, item) => acc + calculateTotal(item), 0);
//   const discountedTotal = grandTotal - parseFloat(discount || 0);

//   // Edit item
//   const editItem = (index) => setEditingIndex(index);
//   const saveItem = (index) => setEditingIndex(null);
//   const deleteItem = (index) => setItems(items.filter((_, i) => i !== index));

//   // Save PDF
//   const savePDF = () => {
//     const doc = new jsPDF();
//     doc.text("Estimate", 10, 10);
//     let y = 20;
//     items.forEach((item, idx) => {
//       doc.text(
//         `${idx + 1}. ${item.item} | ${item.category} | ${item.condition} | ₹${item.cost} | Total: ₹${calculateTotal(item).toFixed(2)}`,
//         10,
//         y
//       );
//       y += 10;
//     });
//     doc.text(`Discount: ₹${discount}`, 10, y + 5);
//     doc.text(`Grand Total: ₹${discountedTotal.toFixed(2)}`, 10, y + 15);
//     doc.save("Estimate.pdf");
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Estimate</h3>

//       <Card>
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-2">Category</th>
//                 <th className="p-2">Item</th>
//                 <th className="p-2">Condition</th>
//                 <th className="p-2">Cost (₹)</th>
//                 <th className="p-2">Total (₹)</th>
//                 <th className="p-2 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, idx) =>
//                 editingIndex === idx ? (
//                   <tr key={idx} className="bg-blue-50">
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.category}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[idx].category = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-full p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">
//                       <input
//                         type="text"
//                         value={item.item}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[idx].item = e.target.value;
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
//                           copy[idx].condition = e.target.value;
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
//                         value={item.cost}
//                         onChange={(e) => {
//                           const copy = [...items];
//                           copy[idx].cost = e.target.value;
//                           setItems(copy);
//                         }}
//                         className="w-24 p-1 border rounded-lg"
//                       />
//                     </td>
//                     <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" onClick={() => saveItem(idx)}>
//                         <Save className="h-4 w-4 text-green-600" />
//                       </Button>
//                     </td>
//                   </tr>
//                 ) : (
//                   <tr key={idx}>
//                     <td className="p-2">{item.category}</td>
//                     <td className="p-2">{item.item}</td>
//                     <td className="p-2">{item.condition}</td>
//                     <td className="p-2">{item.cost}</td>
//                     <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                     <td className="p-2 text-right space-x-1">
//                       <Button variant="ghost" onClick={() => editItem(idx)}>
//                         <Edit className="h-4 w-4 text-blue-600" />
//                       </Button>
//                       <Button variant="ghost" onClick={() => deleteItem(idx)}>
//                         <Trash2 className="h-4 w-4 text-red-500" />
//                       </Button>
//                     </td>
//                   </tr>
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-4 flex items-center space-x-4">
//           <div>
//             <label>Discount (₹): </label>
//             <input
//               type="number"
//               value={discount}
//               onChange={(e) => setDiscount(e.target.value)}
//               className="w-24 p-1 border rounded-lg"
//             />
//           </div>
//           <div className="font-bold">Grand Total: ₹{discountedTotal.toFixed(2)}</div>
//         </div>

//         <div className="mt-4 space-x-2">
//           <Button onClick={() => alert("Estimate Saved!")}>Save</Button>
//           <Button onClick={savePDF}>Save PDF</Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default EstimateStep;



// import { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { Trash2, Edit, Save } from "lucide-react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const EstimateStep = () => {
//   // Load inspection items from localStorage
//   const [items, setItems] = useState(() => {
//     const saved = localStorage.getItem("inspectionItems");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [discount, setDiscount] = useState(0);

//   // Calculate total for each item
//   const multipliers = {
//     Parts: 1.5,
//     Labour: 2,
//     Hardware: 2,
//     Steel: 1.5,
//   };

//   const calculateTotal = (item) => {
//     const cost = parseFloat(item.cost) || 0;
//     const multiplier = multipliers[item.item] || 1;
//     return cost * multiplier;
//   };

//   const subTotal = items.reduce((acc, item) => acc + calculateTotal(item), 0);
//   const totalAfterDiscount = subTotal - discount;

//   // Save PDF
//   const handleSavePDF = () => {
//     const input = document.getElementById("estimate-body");
//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");

//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("estimate.pdf");
//     });
//   };

//   // Print page
//   const handlePrint = () => {
//     const printContent = document.getElementById("estimate-body");
//     const WinPrint = window.open("", "", "width=900,height=650");
//     WinPrint.document.write(`<html><head><title>Estimate</title></head><body>${printContent.innerHTML}</body></html>`);
//     WinPrint.document.close();
//     WinPrint.focus();
//     WinPrint.print();
//     WinPrint.close();
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Estimate</h3>

//       <Card>
//         <div id="estimate-body" className="overflow-x-auto">
//           <table className="w-full text-sm border">
//             <thead className="bg-gray-50 text-left">
//               <tr>
//                 <th className="p-2 border">Category</th>
//                 <th className="p-2 border">Item</th>
//                 <th className="p-2 border">Condition</th>
//                 <th className="p-2 border">Cost (₹)</th>
//                 <th className="p-2 border">Total (₹)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.length === 0 && (
//                 <tr>
//                   <td colSpan={5} className="p-4 text-center text-gray-500">
//                     No inspection items.
//                   </td>
//                 </tr>
//               )}
//               {items.map((item, index) => (
//                 <tr key={index} className="border-b">
//                   <td className="p-2 border">{item.category}</td>
//                   <td className="p-2 border">{item.item}</td>
//                   <td className="p-2 border">{item.condition}</td>
//                   <td className="p-2 border">{item.cost}</td>
//                   <td className="p-2 border">{calculateTotal(item).toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Summary */}
//           <div className="mt-4 text-right">
//             <div className="mb-2">Subtotal: ₹{subTotal.toFixed(2)}</div>
//             <div className="mb-2">
//               Discount: 
//               <input
//                 type="number"
//                 value={discount}
//                 onChange={(e) => setDiscount(parseFloat(e.target.value) )}
//                 className="ml-2 w-20 p-1 border rounded"
//               />
//             </div>
//             <div className="font-bold">Total: ₹{totalAfterDiscount.toFixed(2)}</div>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex space-x-2 mt-4 justify-end">
//           <Button onClick={handleSavePDF} className="bg-green-500 text-white">
//             Save PDF
//           </Button>
//           <Button onClick={handlePrint} className="bg-blue-500 text-white">
//             Print
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default EstimateStep;



import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const EstimateStep = () => {
  // LocalStorage se inspection items load karo
  const [items] = useState(() => {
    const saved = localStorage.getItem("inspectionItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [discount, setDiscount] = useState(0);

  // Multipliers (har item ke liye fix)
  const multipliers = {
    Parts: 1.5,
    Labour: 2,
    Hardware: 2,
    Steel: 1.5,
  };

  // Har item ka total nikalne ka function
  const calculateTotal = (item) => {
    const cost = parseFloat(item.cost) || 0;
    const multiplier = multipliers[item.item] || 1;
    return cost * multiplier;
  };

  // Subtotal aur Discount ke baad total
  const subTotal = items.reduce((acc, item) => acc + calculateTotal(item), 0);
  const totalAfterDiscount = subTotal - discount;

  // PDF Save karne ka function
  const handleSavePDF = () => {
    const input = document.getElementById("estimate-body");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("estimate.pdf");
    });
  };

  // Print karne ka function
  const handlePrint = () => {
    const printContent = document.getElementById("estimate-body");
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(`<html><head><title>Estimate</title></head><body>${printContent.innerHTML}</body></html>`);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Estimate</h3>

      {/* Estimate Table + Summary */}
      <div id="estimate-body" className="overflow-x-auto border p-4 rounded">
        <table className="w-full text-sm border">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Condition</th>
              <th className="p-2 border">Cost (₹)</th>
              <th className="p-2 border">Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No inspection items.
                </td>
              </tr>
            )}
            {items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 border">{item.category}</td>
                <td className="p-2 border">{item.item}</td>
                <td className="p-2 border">{item.condition}</td>
                <td className="p-2 border">{item.cost}</td>
                <td className="p-2 border">{calculateTotal(item).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="mt-4 text-right">
          <div className="mb-2">Subtotal: ₹{subTotal.toFixed(2)}</div>
          <div className="mb-2">
            Discount:
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value))}
              className="ml-2 w-20 p-1 border rounded"
            />
          </div>
          <div className="font-bold">Total: ₹{totalAfterDiscount.toFixed(2)}</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-2 mt-4 justify-end">
        <button onClick={handleSavePDF} className="bg-green-500 text-white px-4 py-2 rounded">
          Save PDF
        </button>
        <button onClick={handlePrint} className="bg-blue-500 text-white px-4 py-2 rounded">
          Print
        </button>
      </div>

    </div>
  );
};

export default EstimateStep;



























