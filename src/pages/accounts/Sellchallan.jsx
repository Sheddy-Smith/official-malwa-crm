import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Trash } from "lucide-react";

const SellChallan = () => {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // LocalStorage se data load karna
  const [challans, setChallans] = useState(() => {
    const saved = localStorage.getItem("Sellchallans");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            challanNo: "CH-001",
            date: "2025-09-13",
            source: "Indore Supplier",
            item: "Cement Bags",
            qty: 100,
            price: 350,
            total: 35000,
            payment: "Pending",
          },
        ];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("Sellchallans", JSON.stringify(challans));
  }, [challans]);

  // Form state
  const [challanNo, setChallanNo] = useState("");
  const [date, setDate] = useState("");
  const [source, setSource] = useState("");
  const [item, setItem] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState("Pending");

  // Reset form
  const resetForm = () => {
    setChallanNo("");
    setDate("");
    setSource("");
    setItem("");
    setQty("");
    setPrice("");
    setPayment("Pending");
    setEditingId(null);
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const total = Number(qty) * Number(price);

    if (editingId) {
      const updated = challans.map((c) =>
        c.id === editingId
          ? {
              id: editingId,
              challanNo,
              date,
              source,
              item,
              qty: Number(qty),
              price: Number(price),
              total,
              payment,
            }
          : c
      );
      setChallans(updated);
    } else {
      const newChallan = {
        id: challans.length + 1,
        challanNo,
        date,
        source,
        item,
        qty: Number(qty),
        price: Number(price),
        total,
        payment,
      };
      setChallans([...challans, newChallan]);
    }

    resetForm();
    setOpen(false);
  };

  // Edit
  const handleEdit = (c) => {
    setEditingId(c.id);
    setChallanNo(c.challanNo);
    setDate(c.date);
    setSource(c.source);
    setItem(c.item);
    setQty(c.qty);
    setPrice(c.price);
    setPayment(c.payment);
    setOpen(true);
  };

  // Delete
  const handleDelete = (id) => {
    const filtered = challans.filter((c) => c.id !== id);
    setChallans(filtered);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Challan Records</h2>
        <p><u>job se challan save hoga to Sell-Challan me show hoga</u></p>
        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white flex px-6 py-2 gap-2 font-bold rounded hover:bg-blue-700"
        >
          <PlusCircle /> Add Challan
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Challan No</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Source</th>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">Edit</th>
              <th className="p-2 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {challans.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 text-center">
                <td className="p-2 border">{c.id}</td>
                <td className="p-2 border">{c.challanNo}</td>
                <td className="p-2 border">{c.date}</td>
                <td className="p-2 border">{c.source}</td>
                <td className="p-2 border">{c.item}</td>
                <td className="p-2 border">{c.qty}</td>
                <td className="p-2 border">{c.price}₹</td>
                <td className="p-2 border">{c.total}₹</td>
                <td className="p-2 border">{c.payment}</td>
                <td className="p-2 border">
                  <button onClick={() => handleEdit(c)}>
                    <Edit className="text-yellow-500" />
                  </button>
                </td>
                <td className="p-2 border">
                  <button onClick={() => handleDelete(c.id)}>
                    <Trash className="text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {editingId ? "Edit Challan" : "Add Challan"}
              </h3>
              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="text-red-500 font-semibold"
              >
                X
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                value={challanNo}
                onChange={(e) => setChallanNo(e.target.value)}
                placeholder="Challan No"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Source"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="Item Name"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="Quantity"
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="w-full border p-2 rounded"
                required
              />
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {editingId ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellChallan;



// import React from "react";
// import { useState } from "react";

// const Challan = () => {
//   const [isopen ,setisopen] = useState(false)
//   const [formData, setfromData] = useState({
//   id: "",
//   challanNo: "",
//   date: "",
//   source: "",
//   item: "",
//   qty: "",
//   price: "",
//   total: "",
//   payment: ""
//   })




//   return (

//     <div className="p-6">
//       <div className="flex justify-between">
//       <h1 className="font-bold text-2xl mb-4">Challan Details</h1>
//       <button onClick={()=>setisopen(true)} className="font-semibold text-xl mb-4 bg-blue-400 text-white rounded-xl px-2 ">Add List</button>
//       </div>

// <table>
//   <thead>
//     <tr>
//       <th>ID</th>
//       <th>Challan No</th>
//       <th>Date</th>
//       <th>Source</th>
//       <th>Item</th>
//       <th>Qty</th>
//       <th>Price</th>
//       <th>Total</th>
//       <th>Payment</th>
//     </tr>
//   </thead>
//   <tbody>
//     {challanList.map((row, index) => (
//       <tr key={index}>
//         <td>{row.id}</td>
//         <td>{row.challanNo}</td>
//         <td>{row.date}</td>
//         <td>{row.source}</td>
//         <td>{row.item}</td>
//         <td>{row.qty}</td>
//         <td>{row.price}</td>
//         <td>{row.total}</td>
//         <td>{row.payment}</td>
//       </tr>
//     ))}
//   </tbody>
// </table>




// {(isopen &&
//  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="pt-[80px]">
//       <form className="grid grid-cols-2 gap-4 bg-white shadow-md rounded-lg p-6">
        
//         {/* ID */}
//         <div>
//           <label className="block mb-1 font-medium">ID</label>
//           <input type="text" className="border p-2 w-full rounded-md" placeholder="Enter ID" />
//         </div>

//         {/* Challan No */}
//         <div>
//           <label className="block mb-1 font-medium">Challan No</label>
//           <input type="text" className="border p-2 w-full rounded-md" placeholder="Enter Challan No" />
//         </div>

//         {/* Date */}
//         <div>
//           <label className="block mb-1 font-medium">Date</label>
//           <input type="date" className="border p-2 w-full rounded-md" />
//         </div>

//         {/* Source */}
//         <div>
//           <label className="block mb-1 font-medium">Source</label>
//           <input type="text" className="border p-2 w-full rounded-md" placeholder="Enter Source" />
//         </div>

//         {/* Item */}
//         <div>
//           <label className="block mb-1 font-medium">Item</label>
//           <input type="text" className="border p-2 w-full rounded-md" placeholder="Enter Item" />
//         </div>

//         {/* Quantity */}
//         <div>
//           <label className="block mb-1 font-medium">Qty</label>
//           <input type="number" className="border p-2 w-full rounded-md" placeholder="Enter Quantity" />
//         </div>

//         {/* Price */}
//         <div>
//           <label className="block mb-1 font-medium">Price</label>
//           <input type="number" className="border p-2 w-full rounded-md" placeholder="Enter Price" />
//         </div>

//         {/* Total */}
//         <div>
//           <label className="block mb-1 font-medium">Total</label>
//           <input type="number" className="border p-2 w-full rounded-md" placeholder="Auto or Enter Total" />
//         </div>

//         {/* Payment */}
//         <div className="col-span-2">
//           <label className="block mb-1 font-medium">Payment Status</label>
//           <select className="border p-2 w-full rounded-md">
//             <option>Paid</option>
//             <option>Unpaid</option>
//             <option>Partial</option>
//           </select>
//         </div>

//         {/* Submit */}
//         <div className="col-span-2 text-center ">
//           <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md">
//             Submit Challan
//           </button>
//         </div>
//   <button onClick={()=>setisopen(false)} className="bg-blue-300 mt-[10px] rounded-xl px-2 font-semibold">Close</button>
//       </form>
//          </div>
//      </div>

//     )}
    
//     </div>
 
//   );
// };
             
// export default Challan;
