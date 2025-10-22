// import Card from "@/components/ui/Card";
// import { Trash2Icon } from "lucide-react";

// const LedgerTab = () => (
//     <>
//     <Card>
//        <table className="border-2 w-full h-[70px]" >
//    <tr className="border-2">
//     <th className="border-2">Category</th>
//     <th className="border-2">Item</th>
//     <th className="border-2">Condition</th>
//     <th className="border-2">Cost (₹)</th>
//     <th className="border-2">Multiplier	</th>
//     <th className="border-2">Total (₹)</th>
//     <th className="border-2">Work By</th>
//     <th className="border-2">Notes</th>
//     <th className="border-2">Action</th>
// </tr>
//    <tbody>
// <tr className="border-2 text-center">
//     <td className="border-2">Parts</td>
//     <th className="border-2">tank</th>
//     <th className="border-2">ok</th>
//     <th className="border-2">100</th>
//     <th className="border-2">1</th>
//     <th className="border-2">100</th>
//     <th className="border-2">Labour</th>
//     <th className="border-2"> salman bhai   </th>
//     <th className="border-2">
//      <button className=" pointer-curson text-red-500">   <Trash2Icon /> </button> 
//           </th>
// </tr>
//    </tbody>


//        </table>



//     </Card>
//     </>
// );
// export default LedgerTab;


//  <p className="dark:text-dark-text-secondary text-sm">This table will automatically update after an Estimate, JobSheet, Challan, or Invoice is created, showing Date, Document Type, Number, Amount, Discount, and Payment Status.</p>






import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

const CustomerLedger = () => {
  const [ledgerRows, setLedgerRows] = useState([]);
  const [discount, setDiscount] = useState(0);

  // Load Challan data
  useEffect(() => {
    const estimateData = JSON.parse(localStorage.getItem("jobSheetEstimate") || "[]");
    const extraData = JSON.parse(localStorage.getItem("extraWork") || "[]");
    const disc = parseFloat(localStorage.getItem("estimateDiscount")) || 0;

    // Transform to ledger format
    const transformedRows = [
      ...estimateData.map((item) => ({
        ...item,
        total: (parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1)).toFixed(2),
      })),
      ...extraData.map((item) => ({
        ...item,
        total: (parseFloat(item.cost || 0) * parseFloat(item.multiplier || 1)).toFixed(2),
      })),
    ];

    setLedgerRows(transformedRows);
    setDiscount(disc);
    localStorage.setItem("customerLedger", JSON.stringify(transformedRows));
  }, []);

  // Delete row
  const handleDelete = (index) => {
    const updated = ledgerRows.filter((_, i) => i !== index);
    setLedgerRows(updated);
    localStorage.setItem("customerLedger", JSON.stringify(updated));
  };

  // Totals
  const subtotalEstimate = ledgerRows
    .filter((r) => r.jobSheetNo !== undefined || r.jobSheetNo !== null)
    .reduce((acc, item) => acc + parseFloat(item.total || 0), 0);

  const subtotalExtra = ledgerRows
    .filter((r) => r.jobSheetNo === undefined || r.jobSheetNo === null)
    .reduce((acc, item) => acc + parseFloat(item.total || 0), 0);

  const grandTotal = subtotalEstimate + subtotalExtra - discount;

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-xl font-bold mb-2">Customer Ledger</h3>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Category</th>
                <th className="border p-2">Item</th>
                <th className="border p-2">Condition</th>
                <th className="border p-2 text-right">Cost (₹)</th>
                <th className="border p-2 text-right">Multiplier</th>
                <th className="border p-2 text-right">Total (₹)</th>
                <th className="border p-2">Work By</th>
                <th className="border p-2">Notes</th>
                <th className="border p-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {ledgerRows.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center p-3 text-gray-500">
                    No Ledger Data Found
                  </td>
                </tr>
              ) : (
                ledgerRows.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border p-2">{row.category}</td>
                    <td className="border p-2">{row.item}</td>
                    <td className="border p-2">{row.condition || "OK"}</td>
                    <td className="border p-2 text-right">{parseFloat(row.cost).toFixed(2)}</td>
                    <td className="border p-2 text-right">{parseFloat(row.multiplier).toFixed(2)}</td>
                    <td className="border p-2 text-right">{parseFloat(row.total).toFixed(2)}</td>
                    <td className="border p-2">{row.workBy || "Labour"}</td>
                    <td className="border p-2">{row.notes || ""}</td>
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

        {/* Totals */}
        <div className="mt-4 text-right font-semibold space-y-1">
          <div>Subtotal (Estimate): ₹{subtotalEstimate.toFixed(2)}</div>
          <div>Subtotal (Extra Work): ₹{subtotalExtra.toFixed(2)}</div>
          <div>Estimate Discount: ₹{discount.toFixed(2)}</div>
          <div className="font-extrabold  text-lg">Grand Total: ₹{grandTotal.toFixed(2)}</div>
        </div>
      </Card>
    </div>
  );
};

export default CustomerLedger;
 