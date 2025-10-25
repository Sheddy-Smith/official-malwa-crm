
// import { useState } from 'react';
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { Save, Printer, FileText } from "lucide-react";

// // Simple Modal
// const GenerateInvoiceModal = ({ isOpen, onClose }) => {
//   const [isNewParty, setIsNewParty] = useState(false);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
//         <h3 className="text-lg font-bold mb-4">Generate Invoice</h3>

//         <div className="mb-4">
//           <button onClick={() => setIsNewParty(false)} className={`px-3 py-1 mr-2 rounded ${!isNewParty ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Select Existing</button>
//           <button onClick={() => setIsNewParty(true)} className={`px-3 py-1 rounded ${isNewParty ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Add New</button>
//         </div>

//         {isNewParty ? (
//           <div className="border p-4 rounded mb-4">
//             <p>Add New Party Form Here</p>
//           </div>
//         ) : (
//           <select className="w-full border p-2 rounded mb-4">
//             <option>Select a customer...</option>
//             <option>Customer 1</option>
//             <option>Customer 2</option>
//           </select>
//         )}

//         <select className="w-full border p-2 rounded mb-4">
//           <option>Advance Payment</option>
//           <option>Full Payment</option>
//           <option>Partial Payment</option>
//         </select>

//         <div className="flex justify-end">
//           <Button onClick={onClose}>Save & Generate</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ChalanStep = () => {
//   const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

//   return (
//     <>
//       <GenerateInvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} />

//       <div className="space-y-4">
//         <h3 className="text-xl font-bold">Chalan</h3>

//         <Card>
//           <p>The challan is generated after the JobSheet is finalized. The table of items here is non-editable.</p>

//           <div className="flex flex-wrap gap-4 mt-4">
//             <Button variant="secondary"><Save className="h-4 w-4 mr-2"/> Save Challan</Button>
//             <Button onClick={() => setIsInvoiceModalOpen(true)}><FileText className="h-4 w-4 mr-2"/> Generate Invoice</Button>
//             <Button variant="secondary"><Printer className="h-4 w-4 mr-2"/> Print Challan</Button>
//           </div>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default ChalanStep;


// import { useState } from 'react';
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { Save, Printer, FileText } from "lucide-react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// // Simple Modal
// const GenerateInvoiceModal = ({ isOpen, onClose }) => {
//   const [isNewParty, setIsNewParty] = useState(false);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
//         <h3 className="text-lg font-bold mb-4">Generate Invoice</h3>

//         <div className="mb-4">
//           <button onClick={() => setIsNewParty(false)} className={`px-3 py-1 mr-2 rounded ${!isNewParty ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Select Existing</button>
//           <button onClick={() => setIsNewParty(true)} className={`px-3 py-1 rounded ${isNewParty ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Add New</button>
//         </div>

//         {isNewParty ? (
//           <div className="border p-4 rounded mb-4">
//             <p>Add New Party Form Here</p>
//           </div>
//         ) : (
//           <select className="w-full border p-2 rounded mb-4">
//             <option>Select a customer...</option>
//             <option>Customer 1</option>
//             <option>Customer 2</option>
//           </select>
//         )}

//         <select className="w-full border p-2 rounded mb-4">
//           <option>Advance Payment</option>
//           <option>Full Payment</option>
//           <option>Partial Payment</option>
//         </select>

//         <div className="flex justify-end">
//           <Button onClick={onClose}>Save & Generate</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ChalanStep = () => {
//   const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

//   // Job Sheet ka data fetch karo
//   const estimateItems = JSON.parse(localStorage.getItem("inspectionItems") || "[]");
//   const extraWork = JSON.parse(localStorage.getItem("extraWork") || "[]");

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

//   const subTotalEstimate = estimateItems.reduce((acc, item) => acc + calculateTotal(item), 0);
//   const subTotalExtra = extraWork.reduce((acc, item) => acc + calculateTotal(item), 0);
//   const grandTotal = subTotalEstimate + subTotalExtra;

//   // PDF download
//   const handleSavePDF = () => {
//     const input = document.getElementById("challan-body");
//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("challan.pdf");
//     });
//   };

//   // Print
//   const handlePrint = () => {
//     const printContent = document.getElementById("challan-body");
//     const WinPrint = window.open("", "", "width=900,height=650");
//     WinPrint.document.write(`<html><head><title>Challan</title></head><body>${printContent.innerHTML}</body></html>`);
//     WinPrint.document.close();
//     WinPrint.focus();
//     WinPrint.print();
//     WinPrint.close();
//   };

//   return (
//     <>
//       <GenerateInvoiceModal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)} />

//       <div className="space-y-4">
//         <h3 className="text-xl font-bold">Challan</h3>

//         <Card>
//           <div id="challan-body">
//             <h4 className="font-semibold mb-2">Tasks from Job Sheet</h4>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="p-2 border">Category</th>
//                     <th className="p-2 border">Item</th>
//                     <th className="p-2 border">Condition</th>
//                     <th className="p-2 border">Cost (₹)</th>
//                     <th className="p-2 border">Total (₹)</th>
//                     <th className="p-2 border">Work By</th>
//                     <th className="p-2 border">Notes</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {estimateItems.map((item, idx) => (
//                     <tr key={`est-${idx}`} className="border-b">
//                       <td className="p-2">{item.category}</td>
//                       <td className="p-2">{item.item}</td>
//                       <td className="p-2">{item.condition}</td>
//                       <td className="p-2">{item.cost}</td>
//                       <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                       <td className="p-2">Labour</td>
//                       <td className="p-2"></td>
//                     </tr>
//                   ))}

//                   {extraWork.map((item, idx) => (
//                     <tr key={`extra-${idx}`} className="border-b">
//                       <td className="p-2">{item.category}</td>
//                       <td className="p-2">{item.item}</td>
//                       <td className="p-2">{item.condition}</td>
//                       <td className="p-2">{item.cost}</td>
//                       <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                       <td className="p-2">{item.workBy}</td>
//                       <td className="p-2">{item.notes}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <div className="mt-4 text-right font-semibold">
//                 <div>Subtotal (Estimate): ₹{subTotalEstimate.toFixed(2)}</div>
//                 <div>Subtotal (Extra Work): ₹{subTotalExtra.toFixed(2)}</div>
//                 <div className="text-lg font-bold">Grand Total: ₹{grandTotal.toFixed(2)}</div>
//               </div>
//             </div>
//           </div>

// <div className="flex flex-wrap gap-4 mt-4">
//             <Button variant="secondary" onClick={handleSavePDF}><Save className="h-4 w-4 mr-2"/> Save Challan</Button>
//             <Button onClick={() => setIsInvoiceModalOpen(true)}><FileText className="h-4 w-4 mr-2"/> Generate Invoice</Button>
//             <Button variant="secondary" onClick={handlePrint}><Printer className="h-4 w-4 mr-2"/> Print Challan</Button>
//           </div>
        
//         </Card>
//       </div>
//     </>
//   );
// };

// export default ChalanStep;


// total calculation wrong
// import { useState } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { Save, Printer, FileText } from "lucide-react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// // Simple Modal
// const GenerateInvoiceModal = ({ isOpen, onClose }) => {
//   const [isNewParty, setIsNewParty] = useState(false);






//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
//         <h3 className="text-lg font-bold mb-4">Generate Invoice</h3>

//         <div className="mb-4">
//           <button
//             onClick={() => setIsNewParty(false)}
//             className={`px-3 py-1 mr-2 rounded ${
//               !isNewParty ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//           >
//             Select Existing
//           </button>
//           <button
//             onClick={() => setIsNewParty(true)}
//             className={`px-3 py-1 rounded ${
//               isNewParty ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//           >
//             Add New
//           </button>
//         </div>

//         {isNewParty ? (
//           <div className="border p-4 rounded mb-4">
//             <p>Add New Party Form Here</p>
//           </div>
//         ) : (
//           <select className="w-full border p-2 rounded mb-4">
//             <option>Select a customer...</option>
//             <option>Customer 1</option>
//             <option>Customer 2</option>
//           </select>
//         )}

//         <select className="w-full border p-2 rounded mb-4">
//           <option>Advance Payment</option>
//           <option>Full Payment</option>
//           <option>Partial Payment</option>
//         </select>

//         <div className="flex justify-end">
//           <Button onClick={onClose}>Save & Generate</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ChalanStep = () => {
//   const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

//   // Job Sheet data (Notes + WorkBy included)
//   const jobSheetEstimate =
//     JSON.parse(localStorage.getItem("jobSheetEstimate") || "[]");
//   const extraWork = JSON.parse(localStorage.getItem("extraWork") || "[]");
//   // discount hai ye
// const discount = localStorage.getItem("estimateDiscount") || 0;

//   const multipliers = {
//     Parts: 1.5,
//     Labour: 2,
//     Hardware: 2,
//     Steel: 1.5,
//   };

//   const calculateTotal = (item) => {
//     const cost = parseFloat(item.cost) || 0;
//     const multiplier = multipliers[item.category?.trim()] || 1;
//     return cost * multiplier;
//   };

//   const subTotalEstimate = jobSheetEstimate.reduce(
//     (acc, item) => acc + calculateTotal(item),
//     0
//   );
//   const subTotalExtra = extraWork.reduce(
//     (acc, item) => acc + calculateTotal(item),
//     0
//   );
//   const grandTotal = subTotalEstimate + subTotalExtra;

//   // PDF download
//   const handleSavePDF = () => {
//     const input = document.getElementById("challan-body");
//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("challan.pdf");
//     });
//   };

//   // Print
//   const handlePrint = () => {
//     const printContent = document.getElementById("challan-body");
//     const WinPrint = window.open("", "", "width=900,height=650");
//     WinPrint.document.write(
//       `<html><head><title>Challan</title></head><body>${printContent.innerHTML}</body></html>`
//     );
//     WinPrint.document.close();
//     WinPrint.focus();
//     WinPrint.print();
//     WinPrint.close();
//   };

//   return (
//     <>
//       <GenerateInvoiceModal
//         isOpen={isInvoiceModalOpen}
//         onClose={() => setIsInvoiceModalOpen(false)}
//       />

//       <div className="space-y-4">
//         <h3 className="text-xl font-bold">Challan</h3>

//         <Card>
//           <div id="challan-body">
//             <h4 className="font-semibold mb-2">Tasks from Job Sheet</h4>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="p-2 border">Category</th>
//                     <th className="p-2 border">Item</th>
//                     <th className="p-2 border">Condition</th>
//                     <th className="p-2 border">Cost (₹)</th>
//                     <th className="p-2 border">Total (₹)</th>
//                     <th className="p-2 border">Work By</th>
//                     <th className="p-2 border">Notes</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {jobSheetEstimate.map((item, idx) => (
//                     <tr key={`est-${idx}`} className="border-b">
//                       <td className="p-2">{item.category}</td>
//                       <td className="p-2">{item.item}</td>
//                       <td className="p-2">{item.condition}</td>
//                       <td className="p-2">{item.cost}</td>
//                       <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                       <td className="p-2">{item.workBy || "Labour"}</td>
//                       <td className="p-2">{item.notes || ""}</td>
//                     </tr>
//                   ))}

//                   {extraWork.map((item, idx) => (
//                     <tr key={`extra-${idx}`} className="border-b">
//                       <td className="p-2">{item.category}</td>
//                       <td className="p-2">{item.item}</td>
//                       <td className="p-2">{item.condition}</td>
//                       <td className="p-2">{item.cost}</td>
//                       <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                       <td className="p-2">{item.workBy}</td>
//                       <td className="p-2">{item.notes}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <div className="mt-4 text-right font-semibold">
//                 <div>Subtotal (Estimate): ₹{subTotalEstimate.toFixed(2)}</div>

//                 <div>Subtotal (Extra Work): ₹{subTotalExtra.toFixed(2)}</div>

//                   <div>Estimate Discount: ₹{discount}</div>


//                 {/* <div className="text-lg font-bold">
//                  Grand Total: ₹{grandTotal.toFixed(2)}
//                 </div> */}

//  <div className="font-bold">Grand  Total: ₹{(grandTotal - discount).toFixed(2)}</div>


//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-4 mt-4">
//             <Button variant="secondary" onClick={handleSavePDF}>
//               <Save className="h-4 w-4 mr-2" /> Save Challan
//             </Button>
//             <Button onClick={() => setIsInvoiceModalOpen(true)}>
//               <FileText className="h-4 w-4 mr-2" /> Generate Invoice
//             </Button>
//             <Button variant="secondary" onClick={handlePrint}>
//               <Printer className="h-4 w-4 mr-2" /> Print Challan
//             </Button>
//           </div>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default ChalanStep;



// import { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { Save, Printer, FileText } from "lucide-react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// // Simple Modal
// const GenerateInvoiceModal = ({ isOpen, onClose }) => {
//   const [isNewParty, setIsNewParty] = useState(false);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
//         <h3 className="text-lg font-bold mb-4">Generate Invoice</h3>

//         <div className="mb-4">
//           <button
//             onClick={() => setIsNewParty(false)}
//             className={`px-3 py-1 mr-2 rounded ${
//               !isNewParty ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//           >
//             Select Existing
//           </button>
//           <button
//             onClick={() => setIsNewParty(true)}
//             className={`px-3 py-1 rounded ${
//               isNewParty ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//           >
//             Add New
//           </button>
//         </div>

//         {isNewParty ? (
//           <div className="border p-4 rounded mb-4">
//             <p>Add New Party Form Here</p>
//           </div>
//         ) : (
//           <select className="w-full border p-2 rounded mb-4">
//             <option>Select a customer...</option>
//             <option>Customer 1</option>
//             <option>Customer 2</option>
//           </select>
//         )}

//         <select className="w-full border p-2 rounded mb-4">
//           <option>Advance Payment</option>
//           <option>Full Payment</option>
//           <option>Partial Payment</option>
//         </select>

//         <div className="flex justify-end">
//           <Button onClick={onClose}>Save & Generate</Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ChalanStep = () => {
//   const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

//   // 🔹 Data directly from Vehicle Inspection (Inspection Items)
//   const [inspectionItems, setInspectionItems] = useState(() => {
//     const saved = localStorage.getItem("inspectionItems");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [extraWork, setExtraWork] = useState(() => {
//     const saved = localStorage.getItem("extraWork");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const discount = parseFloat(localStorage.getItem("estimateDiscount")) || 0;

//   // Multipliers come from inspectionItems or extraWork
//   const calculateTotal = (item) => {
//     const cost = parseFloat(item.cost) || 0;
//     const multiplier = parseFloat(item.multiplier) || 1; // static from inspection/extra work
//     return cost * multiplier;
//   };

//   const subTotalInspection = inspectionItems.reduce(
//     (acc, item) => acc + calculateTotal(item),
//     0
//   );
//   const subTotalExtra = extraWork.reduce(
//     (acc, item) => acc + calculateTotal(item),
//     0
//   );
//   const grandTotal = subTotalInspection + subTotalExtra;

//   // PDF download
//   const handleSavePDF = () => {
//     const input = document.getElementById("challan-body");
//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("challan.pdf");
//     });
//   };

//   // Print
//   const handlePrint = () => {
//     const printContent = document.getElementById("challan-body");
//     const WinPrint = window.open("", "", "width=900,height=650");
//     WinPrint.document.write(
//       `<html><head><title>Challan</title></head><body>${printContent.innerHTML}</body></html>`
//     );
//     WinPrint.document.close();
//     WinPrint.focus();
//     WinPrint.print();
//     WinPrint.close();
//   };

//   return (
//     <>
//       <GenerateInvoiceModal
//         isOpen={isInvoiceModalOpen}
//         onClose={() => setIsInvoiceModalOpen(false)}
//       />

//       <div className="space-y-4">
//         <h3 className="text-xl font-bold">Challan</h3>

//         <Card>
//           <div id="challan-body">
//             <h4 className="font-semibold mb-2">Tasks from Vehicle Inspection</h4>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm border">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="p-2 border">Category</th>
//                     <th className="p-2 border">Item</th>
//                     <th className="p-2 border">Condition</th>
//                     <th className="p-2 border">Cost (₹)</th>
//                     <th className="p-2 border">Multiplier</th>
//                     <th className="p-2 border">Total (₹)</th>
//                     <th className="p-2 border">Work By</th>
//                     <th className="p-2 border">Notes</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {inspectionItems.map((item, idx) => (
//                     <tr key={`insp-${idx}`} className="border-b">
//                       <td className="p-2">{item.category}</td>
//                       <td className="p-2">{item.item}</td>
//                       <td className="p-2">{item.condition}</td>
//                       <td className="p-2">{item.cost}</td>
//                       <td className="p-2">{item.multiplier}</td>
//                       <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                       <td className="p-2">{item.workBy || "Labour"}</td>
//                       <td className="p-2">{item.notes || ""}</td>
//                     </tr>
//                   ))}

//                   {extraWork.map((item, idx) => (
//                     <tr key={`extra-${idx}`} className="border-b">
//                       <td className="p-2">{item.category}</td>
//                       <td className="p-2">{item.item}</td>
//                       <td className="p-2">{item.condition}</td>
//                       <td className="p-2">{item.cost}</td>
//                       <td className="p-2">{item.multiplier}</td>
//                       <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                       <td className="p-2">{item.workBy || "Labour"}</td>
//                       <td className="p-2">{item.notes || ""}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <div className="mt-4 text-right font-semibold">
//                 <div>Subtotal (Inspection): ₹{subTotalInspection.toFixed(2)}</div>
//                 <div>Subtotal (Extra Work): ₹{subTotalExtra.toFixed(2)}</div>
//                 <div>Estimate Discount: ₹{discount.toFixed(2)}</div>
//                 <div className="font-bold">
//                   Grand Total: ₹{(grandTotal - discount).toFixed(2)}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-4 mt-4">
//             <Button variant="secondary" onClick={handleSavePDF}>
//               <Save className="h-4 w-4 mr-2" /> Save Challan
//             </Button>
//             <Button onClick={() => setIsInvoiceModalOpen(true)}>
//               <FileText className="h-4 w-4 mr-2" /> Generate Invoice
//             </Button>
//             <Button variant="secondary" onClick={handlePrint}>
//               <Printer className="h-4 w-4 mr-2" /> Print Challan
//             </Button>
//           </div>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default ChalanStep;






// import { useState } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { Save, Printer, FileText } from "lucide-react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const ChalanStep = () => {
//   // Job Sheet data
//   const jobSheetEstimate = JSON.parse(localStorage.getItem("jobSheetEstimate") || "[]");
//   const extraWork = JSON.parse(localStorage.getItem("extraWork") || "[]");
//   const discount = parseFloat(localStorage.getItem("estimateDiscount")) || 0;

//   // Total Calculation (Multiplier static from Job Sheet/Extra Work)
//   const calculateTotal = (item) => {
//     const cost = parseFloat(item.cost) || 0;
//     const multiplier = parseFloat(item.multiplier) || 1;
//     return cost * multiplier;
//   };

//   const subTotalEstimate = jobSheetEstimate.reduce(
//     (acc, item) => acc + calculateTotal(item),
//     0
//   );

//   const subTotalExtra = extraWork.reduce(
//     (acc, item) => acc + calculateTotal(item),
//     0
//   );

//   const grandTotal = subTotalEstimate + subTotalExtra;
//   const finalTotal = grandTotal - discount;

//   // PDF download
//   const handleSavePDF = () => {
//     const input = document.getElementById("challan-body");
//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("challan.pdf");
//     });
//   };

//   // Print
//   const handlePrint = () => {
//     const printContent = document.getElementById("challan-body");
//     const WinPrint = window.open("", "", "width=900,height=650");
//     WinPrint.document.write(
//       `<html><head><title>Challan</title></head><body>${printContent.innerHTML}</body></html>`
//     );
//     WinPrint.document.close();
//     WinPrint.focus();
//     WinPrint.print();
//     WinPrint.close();
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Challan</h3>

//       <Card>
//         <div id="challan-body">
//           <h4 className="font-semibold mb-2">Tasks from Job Sheet</h4>
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
//                   <th className="p-2 border">Notes</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {jobSheetEstimate.map((item, idx) => (
//                   <tr key={`est-${idx}`} className="border-b">
//                     <td className="p-2">{item.category}</td>
//                     <td className="p-2">{item.item}</td>
//                     <td className="p-2">{item.condition}</td>
//                     <td className="p-2">{item.cost}</td>
//                     <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                     <td className="p-2">{item.workBy || "Labour"}</td>
//                     <td className="p-2">{item.notes || ""}</td>
//                   </tr>
//                 ))}

//                 {extraWork.map((item, idx) => (
//                   <tr key={`extra-${idx}`} className="border-b">
//                     <td className="p-2">{item.category}</td>
//                     <td className="p-2">{item.item}</td>
//                     <td className="p-2">{item.condition}</td>
//                     <td className="p-2">{item.cost}</td>
//                     <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                     <td className="p-2">{item.workBy || "Labour"}</td>
//                     <td className="p-2">{item.notes || ""}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="mt-4 text-right font-semibold">
//               <div>Subtotal (Estimate): ₹{subTotalEstimate.toFixed(2)}</div>
//               <div>Subtotal (Extra Work): ₹{subTotalExtra.toFixed(2)}</div>
//               <div>Estimate Discount: ₹{discount.toFixed(2)}</div>
//               <div className="font-bold text-lg">Grand Total: ₹{finalTotal.toFixed(2)}</div>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-4 mt-4">
//           <Button variant="secondary" onClick={handleSavePDF}>
//             <Save className="h-4 w-4 mr-2" /> Save Challan
//           </Button>
//           <Button variant="secondary" onClick={handlePrint}>
//             <Printer className="h-4 w-4 mr-2" /> Print Challan
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default ChalanStep;



// conmplete almost
// import { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { Save, Printer } from "lucide-react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const ChalanStep = () => {
//   // Job Sheet data (Estimate + Extra Work)
//   const [jobSheetEstimate, setJobSheetEstimate] = useState([]);
//   const [extraWork, setExtraWork] = useState([]);
//   const [discount, setDiscount] = useState(0);

//   // Load Job Sheet and Extra Work from localStorage
//   useEffect(() => {
//     const estimateData = JSON.parse(localStorage.getItem("jobSheetEstimate") || "[]");
//     const extraData = JSON.parse(localStorage.getItem("extraWork") || "[]");
//     const disc = parseFloat(localStorage.getItem("estimateDiscount")) || 0;

//     setJobSheetEstimate(estimateData);
//     setExtraWork(extraData);
//     setDiscount(disc);
//   }, []);

//   // Total Calculation (Multiplier static from Job Sheet)
//   const calculateTotal = (item) => {
//     const cost = parseFloat(item.cost) || 0;
//     const multiplier = parseFloat(item.multiplier) || 1;
//     return cost * multiplier;
//   };

//   const subTotalEstimate = jobSheetEstimate.reduce(
//     (acc, item) => acc + calculateTotal(item),
//     0
//   );

//   const subTotalExtra = extraWork.reduce(
//     (acc, item) => acc + calculateTotal(item),
//     0
//   );

//   const grandTotal = subTotalEstimate + subTotalExtra;
//   const finalTotal = grandTotal - discount;

//   // PDF download
//   const handleSavePDF = () => {
//     const input = document.getElementById("challan-body");
//     html2canvas(input, { scale: 2 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("challan.pdf");
//     });
//   };

//   // Print
//   const handlePrint = () => {
//     const printContent = document.getElementById("challan-body");
//     const WinPrint = window.open("", "", "width=900,height=650");
//     WinPrint.document.write(
//       `<html><head><title>Challan</title></head><body>${printContent.innerHTML}</body></html>`
//     );
//     WinPrint.document.close();
//     WinPrint.focus();
//     WinPrint.print();
//     WinPrint.close();
//   };

//   return (
//     <div className="space-y-4">
//       <h3 className="text-xl font-bold">Challan</h3>

//       <Card>
//         <div id="challan-body">
//           <h4 className="font-semibold mb-2">Tasks from Job Sheet</h4>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm border">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="p-2 border">Category</th>
//                   <th className="p-2 border">Item</th>
//                   <th className="p-2 border">Condition</th>
//                   <th className="p-2 border">Cost (₹)</th>
//                   <th className="p-2 border">Multiplier</th>
//                   <th className="p-2 border">Total (₹)</th>
//                   <th className="p-2 border">Work By</th>
//                   <th className="p-2 border">Notes</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {jobSheetEstimate.map((item, idx) => (
//                   <tr key={`est-${idx}`} className="border-b">
//                     <td className="p-2">{item.category}</td>
//                     <td className="p-2">{item.item}</td>
//                     <td className="p-2">{item.condition}</td>
//                     <td className="p-2">{item.cost}</td>
//                     <td className="p-2">{parseFloat(item.multiplier).toFixed(2)}</td>
//                     <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                     <td className="p-2">{item.workBy || "Labour"}</td>
//                     <td className="p-2">{item.notes || ""}</td>
//                   </tr>
//                 ))}

//                 {extraWork.map((item, idx) => (
//                   <tr key={`extra-${idx}`} className="border-b">
//                     <td className="p-2">{item.category}</td>
//                     <td className="p-2">{item.item}</td>
//                     <td className="p-2">{item.condition}</td>
//                     <td className="p-2">{item.cost}</td>
//                     <td className="p-2">{parseFloat(item.multiplier).toFixed(2)}</td>
//                     <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
//                     <td className="p-2">{item.workBy || "Labour"}</td>
//                     <td className="p-2">{item.notes || ""}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             <div className="mt-4 text-right font-semibold">
//               <div>Subtotal (Estimate): ₹{subTotalEstimate.toFixed(2)}</div>
//               <div>Subtotal (Extra Work): ₹{subTotalExtra.toFixed(2)}</div>
//               <div>Estimate Discount: ₹{discount.toFixed(2)}</div>
//               <div className="font-bold text-lg">Grand Total: ₹{finalTotal.toFixed(2)}</div>
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-4 mt-4">
//           <Button variant="secondary" onClick={handleSavePDF}>
//             <Save className="h-4 w-4 mr-2" /> Save Challan
//           </Button>
//           <Button variant="secondary" onClick={handlePrint}>
//             <Printer className="h-4 w-4 mr-2" /> Print Challan
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default ChalanStep;



import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Save, Printer, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ChalanStep = () => {
  const [jobSheetEstimate, setJobSheetEstimate] = useState([]);
  const [extraWork, setExtraWork] = useState([]);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const estimateData = JSON.parse(localStorage.getItem("jobSheetEstimate") || "[]");
    const extraData = JSON.parse(localStorage.getItem("extraWork") || "[]");
    const disc = parseFloat(localStorage.getItem("estimateDiscount")) || 0;

    setJobSheetEstimate(estimateData);
    setExtraWork(extraData);
    setDiscount(disc);
  }, []);

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

  const grandTotal = subTotalEstimate + subTotalExtra;
  const finalTotal = grandTotal - discount;

  // ✅ Delete entry from localStorage + UI
  const handleDelete = (type, index) => {
    if (type === "estimate") {
      const updated = jobSheetEstimate.filter((_, i) => i !== index);
      setJobSheetEstimate(updated);
      localStorage.setItem("jobSheetEstimate", JSON.stringify(updated));
    } else if (type === "extra") {
      const updated = extraWork.filter((_, i) => i !== index);
      setExtraWork(updated);
      localStorage.setItem("extraWork", JSON.stringify(updated));
    }
  };

  // ✅ Save as PDF
  const handleSavePDF = () => {
    const input = document.getElementById("challan-body");
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("challan.pdf");
    });
  };

  // ✅ Print
  const handlePrint = () => {
    const printContent = document.getElementById("challan-body");
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(
      `<html><head><title>Challan</title></head><body>${printContent.innerHTML}</body></html>`
    );
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Challan</h3>

      <Card>
        <div id="challan-body">
          <h4 className="font-semibold mb-2">Tasks from Job Sheet</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Item</th>
                  <th className="p-2 border">Condition</th>
                  <th className="p-2 border">Cost (₹)</th>
                  <th className="p-2 border">Multiplier</th>
                  <th className="p-2 border">Total (₹)</th>
                  <th className="p-2 border">Work By</th>
                  <th className="p-2 border">Notes</th>
                  <th className="p-2 border text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {/* Estimate Data */}
                {jobSheetEstimate.map((item, idx) => (
                  <tr key={`est-${idx}`} className="border-b">
                    <td className="p-2">{item.category}</td>
                    <td className="p-2">{item.item}</td>
                    <td className="p-2">{item.condition}</td>
                    <td className="p-2">{item.cost}</td>
                    <td className="p-2">{parseFloat(item.multiplier).toFixed(2)}</td>
                    <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
                    <td className="p-2">{item.workBy || "Labour"}</td>
                    <td className="p-2">{item.notes || ""}</td>
                    <td className="p-2 text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete("estimate", idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}

                {/* Extra Work Data */}
                {extraWork.map((item, idx) => (
                  <tr key={`extra-${idx}`} className="border-b">
                    <td className="p-2">{item.category}</td>
                    <td className="p-2">{item.item}</td>
                    <td className="p-2">{item.condition}</td>
                    <td className="p-2">{item.cost}</td>
                    <td className="p-2">{parseFloat(item.multiplier).toFixed(2)}</td>
                    <td className="p-2">{calculateTotal(item).toFixed(2)}</td>
                    <td className="p-2">{item.workBy || "Labour"}</td>
                    <td className="p-2">{item.notes || ""}</td>
                    <td className="p-2 text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete("extra", idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-right font-semibold">
              <div>Subtotal (Estimate): ₹{subTotalEstimate.toFixed(2)}</div>
              <div>Subtotal (Extra Work): ₹{subTotalExtra.toFixed(2)}</div>
              <div>Estimate Discount: ₹{discount.toFixed(2)}</div>
              <div className="font-bold text-lg">Grand Total: ₹{finalTotal.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <Button variant="secondary" onClick={handleSavePDF}>
            <Save className="h-4 w-4 mr-2" /> Save Challan
          </Button>
          <Button variant="secondary" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Print Challan
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ChalanStep;
