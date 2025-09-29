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
import React, { useState } from "react";
import Button from "@/components/ui/Button"; // ✅ Tumhara Button component
import { PlusCircle, Edit, Trash2, Save, X } from "lucide-react"; // ✅ Icons

const StockMovements = () => {
  // 🔹 Ledger data
  const [ledger, setLedger] = useState([]);

  // 🔹 Input states
  const [item, setItem] = useState("");
  const [type, setType] = useState("IN");
  const [qty, setQty] = useState("");
  const [linkedTo, setLinkedTo] = useState("");

  // 🔹 Edit mode states
  const [editId, setEditId] = useState(null);
  const [editItem, setEditItem] = useState("");
  const [editType, setEditType] = useState("IN");
  const [editQty, setEditQty] = useState("");
  const [editLinkedTo, setEditLinkedTo] = useState("");

  // ➕ Add entry
  const handleAddEntry = () => {
    if (!item || !qty || !linkedTo) return;

    const newEntry = {
      id: Date.now(),
      item,
      type,
      qty,
      linkedTo,
      date: new Date().toLocaleString(),
    };

    setLedger([...ledger, newEntry]);

    // Inputs reset
    setItem("");
    setQty("");
    setLinkedTo("");
  };

  // 📝 Start Edit
  const handleEdit = (entry) => {
    setEditId(entry.id);
    setEditItem(entry.item);
    setEditType(entry.type);
    setEditQty(entry.qty);
    setEditLinkedTo(entry.linkedTo);
  };

  // 💾 Save Edit
  const handleSave = () => {
    const updated = ledger.map((entry) =>
      entry.id === editId
        ? {
            ...entry,
            item: editItem,
            type: editType,
            qty: editQty,
            linkedTo: editLinkedTo,
          }
        : entry
    );
    setLedger(updated);
    setEditId(null); // Edit mode off
  };

  // ❌ Delete entry
  const handleDelete = (id) => {
    const updated = ledger.filter((entry) => entry.id !== id);
    setLedger(updated);
  };

  return (
    <div className="p-6">
      {/* Heading */}
      <h2 className="text-xl font-bold mb-4">📒 Stock Ledger</h2>

      {/* Form Inputs */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Item Name"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="border p-2 flex-1"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2"
        >
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="border p-2 w-24"
        />

        <input
          type="text"
          placeholder="Linked To (Job/Purchase)"
          value={linkedTo}
          onChange={(e) => setLinkedTo(e.target.value)}
          className="border p-2 flex-1"
        />

        <Button onClick={handleAddEntry} className="bg-blue-500 text-white">
          <PlusCircle className="h-4 w-4 mr-2" /> Add
        </Button>
      </div>

      {/* Ledger Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">S.No</th>
            <th className="border p-2">Item</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Linked To</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ledger.map((entry, index) => (
            <tr key={entry.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">
                {editId === entry.id ? (
                  <input
                    type="text"
                    value={editItem}
                    onChange={(e) => setEditItem(e.target.value)}
                    className="border p-1"
                  />
                ) : (
                  entry.item
                )}
              </td>
              <td className="border p-2">
                {editId === entry.id ? (
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="border p-1"
                  >
                    <option value="IN">IN</option>
                    <option value="OUT">OUT</option>
                  </select>
                ) : (
                  <span
                    className={`font-bold ${
                      entry.type === "IN" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {entry.type}
                  </span>
                )}
              </td>
              <td className="border p-2">
                {editId === entry.id ? (
                  <input
                    type="number"
                    value={editQty}
                    onChange={(e) => setEditQty(e.target.value)}
                    className="border p-1 w-20"
                  />
                ) : (
                  entry.qty
                )}
              </td>
              <td className="border p-2">
                {editId === entry.id ? (
                  <input
                    type="text"
                    value={editLinkedTo}
                    onChange={(e) => setEditLinkedTo(e.target.value)}
                    className="border p-1"
                  />
                ) : (
                  entry.linkedTo
                )}
              </td>
              <td className="border p-2">{entry.date}</td>
              <td className="border p-2 flex gap-2">
                {editId === entry.id ? (
                  <>
                    <Button
                      onClick={handleSave}
                      className="bg-green-500 text-white"
                    >
                      <Save className="h-4 w-4 mr-1" /> 
                      {/* Save */}
                    </Button>
                    <Button
                      onClick={() => setEditId(null)}
                      className="bg-gray-400 text-white"
                    >
                      <X className="h-4 w-4 mr-1" /> 
                      {/* Cancel */}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => handleEdit(entry)}
                      className="bg-yellow-500 text-white"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(entry.id)}
                      className="bg-red-500 text-white"
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockMovements;



