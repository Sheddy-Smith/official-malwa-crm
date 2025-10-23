// import Card from '@/components/ui/Card';
// import Button from '@/components/ui/Button';
// import { PlusCircle } from 'lucide-react';

// const CategoryManager = () => {

//   return (
//      // Manage categories
//     <Card>
//         <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-bold dark:text-dark-text">Manage Categories</h3>
//             <Button   variant="secondary"><PlusCircle className="h-4 w-4 mr-2" />Add Category</Button>
//         </div>
//         <p className="dark:text-dark-text-secondary text-sm">Here you can add, edit, or delete stock categories like Hardware, Steel, Paints, etc.</p>
//     </Card>
//   )
// }

// export default CategoryManager

//WORKING CHAT GPT /owner-code-run
// import React, { useState } from "react";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { PlusCircle, Trash2, Edit } from "lucide-react";

// // Ye ek functional component hai jiska naam CategoryManager hai.
// // Isme tum props pass kar rahe ho:
// const CategoryManager = ({ categories, setCategories }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   // const [categories, setCategories] = useState([
//   //   "Hardware",
//   //   "Steel",
//   //   "Paints",
//   // ]);
//   const [newCategory, setNewCategory] = useState("");
//   const [editIndex, setEditIndex] = useState(null);

//   // Add or update category
//   const handleSave = () => {
//     // khaali category add/edit nahi ho sakti.
//     if (!newCategory.trim()) return;

//     if (editIndex !== null) {
//       // Update existing
//       const updated = [...categories];
//       updated[editIndex] = newCategory;
//       setCategories(updated);
//       setEditIndex(null);
//     } else {
//       // Add new
//       setCategories([...categories, newCategory]);

//     }

//     setNewCategory("");
//     setIsOpen(false);
//   };

//   // Delete category
//   const handleDelete = (index) => {
//     setCategories(categories.filter((_, i) => i !== index));
//   };

//   // Edit category
//   const handleEdit = (index) => {
//     setNewCategory(categories[index]);
//     setEditIndex(index);
//     setIsOpen(true);
//   };

//   return (
//     <Card>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-bold dark:text-dark-text">Manage Categories</h3>
//         <Button variant="secondary" onClick={() => setIsOpen(true)}>
//           <PlusCircle className="h-4 w-4 mr-2" /> Add Category
//         </Button>
//       </div>
//       {/* <p className="dark:text-dark-text-secondary text-sm mb-4">
//         Here you can add, edit, or delete stock categories like Hardware, Steel, Paints, etc.
//       </p> */}

//       {/* Category List */}
//       <ul className="space-y-2">
//         {categories.map((cat, index) => (
//           <li
//             key={index}
//             className="flex justify-between items-center p-2 border rounded-md dark:border-gray-700"
//           >
//             <span className="dark:text-dark-text">{cat}</span>
//             <div className="flex gap-2">
//               <Button
//                 size="sm"
//                 variant="secondary"
//                 onClick={() => handleEdit(index)}
//               >
//                 <Edit className="h-4 w-4" />
//               </Button>
//               <Button
//                 size="sm"
//                 variant="destructive"
//                 onClick={() => handleDelete(index)}
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* Modal */}
//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white dark:bg-dark-bg p-6 rounded-2xl shadow-lg w-[400px]">
//             <h2 className="text-xl font-semibold mb-4 dark:text-dark-text">
//               {editIndex !== null ? "Edit Category" : "Add Category"}
//             </h2>
//             <input
//               type="text"
//               placeholder="Enter category name"
//               value={newCategory}
//               onChange={(e) => setNewCategory(e.target.value)}
//               className="w-full p-2 border rounded mb-4 dark:bg-dark-input dark:text-dark-text"
//             />
//             <div className="flex justify-end gap-2">
//               <Button variant="secondary" onClick={() => setIsOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSave}>
//                 {editIndex !== null ? "Update" : "Save"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </Card>
//   );
// };

// export default CategoryManager;

// experiment code  1 !! sucessfull
// import React, { useState } from "react";
// import Card from '@/components/ui/Card';
// import Button from '@/components/ui/Button';
// import { PlusCircle } from 'lucide-react';

// const CategoryManager = ({ categories, setCategories }) => {

// const [newCategory, setNewCategory] = useState("");
//   const [editIndex, setEditIndex] = useState(null);
//   const [editName, setEditName] = useState("");

//   // Add category
//   const handleAdd = () => {
//     if (!newCategory.trim()) return;
//     setCategories([...categories, { name: newCategory }]);
//     setNewCategory("");
//   };

//   // Delete category
//   const handleDelete = (index) => {
//     const updated = categories.filter((_, i) => i !== index);
//     setCategories(updated);
//   };

//   // Start edit
//   const handleEdit = (index, name) => {
//     setEditIndex(index);
//     setEditName(name);
//   };

//   // Save edit
//   const handleSave = () => {
//     const updated = categories.map((cat, i) =>
//       i === editIndex ? { name: editName } : cat
//     );
//     setCategories(updated);
//     setEditIndex(null);
//     setEditName("");
//   };

//   return (
//      // Manage categories
//     <Card>
//        <div className="p-4 border rounded">
//       <h2 className="text-xl font-bold mb-4">Category Manager</h2>

//       {/* Add input */}
//       <div className="flex mb-4 gap-2">
//         <input
//           type="text"
//           value={newCategory}
//           onChange={(e) => setNewCategory(e.target.value)}
//           placeholder="Enter new category"
//           className="border p-2 flex-1"
//           list="category-list"
//         />
//         <datalist id="category-list">
//           {categories.map((cat, i) => (
//             <option key={i} value={cat.name} />
//           ))}
//         </datalist>
//         <button
//           onClick={handleAdd}
//           className="bg-blue-500 text-white px-4"
//         >
//           Add
//         </button>
//       </div>

//       {/* Category Table */}
//       <table className="w-full border-collapse border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border p-2">S.No</th>
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {categories.map((cat, index) => (
//             <tr key={index}>
//               <td className="border p-2">{index + 1}</td>
//               <td className="border p-2">
//                 {editIndex === index ? (
//                   <input
//                     type="text"
//                     value={editName}
//                     onChange={(e) => setEditName(e.target.value)}
//                     list="category-list"
//                     className="border p-1"
//                   />
//                 ) : (
//                   cat.name
//                 )}
//               </td>
//               <td className="border p-2 flex gap-2">
//                 {editIndex === index ? (
//                   <button
//                     onClick={handleSave}
//                     className="bg-green-500 text-white px-2"
//                   >
//                     Save
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleEdit(index, cat.name)}
//                     className="bg-yellow-500 text-white px-2"
//                   >
//                     Edit
//                   </button>
//                 )}
//                 <button
//                   onClick={() => handleDelete(index)}
//                   className="bg-red-500 text-white px-2"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>

//     </Card>
//   )
// }

// export default CategoryManager

// Experiment code :-

// import React, { useState } from "react";
// import Card from '@/components/ui/Card';

// const CategoryManager = ({ categories, setCategories }) => {
//   const [newCategory, setNewCategory] = useState("");
//   const [editIndex, setEditIndex] = useState(null);
//   const [editName, setEditName] = useState("");

//   // Add category
//   const handleAdd = () => {
//     if (!newCategory.trim()) return;

//     // ✅ Prevent duplicate categories
//     if (categories.some(cat => cat.name.toLowerCase() === newCategory.toLowerCase())) {
//       alert("Category already exists!");
//       return;
//     }

//     const updated = [...categories, { name: newCategory }];
//     setCategories(updated);
//     setNewCategory("");
//   };

//   // Delete category
//   const handleDelete = (index) => {
//     const updated = categories.filter((_, i) => i !== index);
//     setCategories(updated);
//   };

//   // Start edit
//   const handleEdit = (index, name) => {
//     setEditIndex(index);
//     setEditName(name);
//   };

//   // Save edit
//   const handleSave = () => {
//     if (!editName.trim()) return;

//     const updated = categories.map((cat, i) =>
//       i === editIndex ? { name: editName } : cat
//     );
//     setCategories(updated);
//     setEditIndex(null);
//     setEditName("");
//   };

//   return (
//     <Card>
//       <div className="p-4 border rounded">
//         <h2 className="text-xl font-bold mb-4">Category Manager</h2>

//         {/* Add input */}
//         <div className="flex mb-4 gap-2">
//           <input
//             type="text"
//             value={newCategory}
//             onChange={(e) => setNewCategory(e.target.value)}
//             placeholder="Enter new category"
//             className="border p-2 flex-1"
//           />
//           <button
//             onClick={handleAdd}
//             className="bg-blue-500 text-white px-4"
//           >
//             Add
//           </button>
//         </div>

//         {/* Category Table */}
//         <table className="w-full border-collapse border">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">S.No</th>
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.map((cat, index) => (
//               <tr key={index}>
//                 <td className="border p-2">{index + 1}</td>
//                 <td className="border p-2">
//                   {editIndex === index ? (
//                     <input
//                       type="text"
//                       value={editName}
//                       onChange={(e) => setEditName(e.target.value)}
//                       className="border p-1"
//                     />
//                   ) : (
//                     cat.name
//                   )}
//                 </td>
//                 <td className="border p-2 flex gap-2">
//                   {editIndex === index ? (
//                     <button
//                       onClick={handleSave}
//                       className="bg-green-500 text-white px-2"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleEdit(index, cat.name)}
//                       className="bg-yellow-500 text-white px-2"
//                     >
//                       Edit
//                     </button>
//                   )}
//                   <button
//                     onClick={() => handleDelete(index)}
//                     className="bg-red-500 text-white px-2"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// };

// export default CategoryManager;





// Experiment Final code  and perfect code :-
// import React, { useState } from "react";
// import Card from "@/components/ui/Card";

// const CategoryManager = ({ categories, setCategories }) => {
//   const [newCategory, setNewCategory] = useState("");
//   const [editIndex, setEditIndex] = useState(null);
//   const [editName, setEditName] = useState("");

//   // Add category
//   const handleAdd = () => {
//     if (!newCategory.trim()) return;

//     // Prevent duplicate categories
//     if (
//       categories.some(
//         (cat) => cat.name.toLowerCase() === newCategory.toLowerCase()
//       )
//     ) {
//       alert("Category already exists!");
//       return;
//     }

//     // Add new category as object {name: "category"}
//     setCategories([...categories, { name: newCategory }]);
//     localStorage.setItem("categories", JSON.stringify([...categories, { name: newCategory }]));
//     setNewCategory("");
//   };

//   // Delete category
//   const handleDelete = (index) => {
//     const updated = categories.filter((_, i) => i !== index);
//     setCategories(updated);
//   };

//   // Start edit
//   const handleEdit = (index, name) => {
//     setEditIndex(index);
//     setEditName(name);
//   };

//   // Save edit
//   const handleSave = () => {
//     if (!editName.trim()) return;

//     const updated = categories.map((cat, i) =>
//       i === editIndex ? { name: editName } : cat
//     );
//     setCategories(updated);
//     setEditIndex(null);
//     setEditName("");
//   };

//   return (
//     <Card>
//       <div className="p-4 border rounded">
//         <h2 className="text-xl font-bold mb-4">Category Manager</h2>

//         {/* Add input */}
//         <div className="flex mb-4 gap-2">
//           <input
//             type="text"
//             value={newCategory}
//             onChange={(e) => setNewCategory(e.target.value)}
//             placeholder="Enter new category"
//             className="border p-2 flex-1"
//           />
//           <button onClick={handleAdd} className="bg-blue-500 text-white px-4">
//             Add
//           </button>
//         </div>

//         {/* Category Table */}
//         <table className="w-full border-collapse border">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">S.No</th>
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.map((cat, index) => (
//               <tr key={index}>
//                 <td className="border p-2">{index + 1}</td>
//                 <td className="border p-2">
//                   {editIndex === index ? (
//                     <input
//                       type="text"
//                       value={editName}
//                       onChange={(e) => setEditName(e.target.value)}
//                       className="border p-1"
//                     />
//                   ) : (
//                     cat.name
//                   )}
//                 </td>
//                 <td className="border p-2 flex gap-2">
//                   {editIndex === index ? (
//                     <button
//                       onClick={handleSave}
//                       className="bg-green-500 text-white px-2"
//                     >
//                       Save
//                     </button>
//                   ) : (
//                     <button
//                       onClick={() => handleEdit(index, cat.name)}
//                       className="bg-yellow-500 text-white px-2"
//                     >
//                       Edit
//                     </button>
//                   )}
//                   <button
//                     onClick={() => handleDelete(index)}
//                     className="bg-red-500 text-white px-2"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// };

// export default CategoryManager;







// 1 dummy code 
// import React, { useState, useEffect } from "react";
// import Card from "@/components/ui/Card";

// const CategoryManager = ({ categories: propCategories, setCategories: propSetCategories }) => {
//   const [categories, setCategories] = useState(() => {
//     if (propCategories && Array.isArray(propCategories)) return propCategories;
//     try {
//       const saved = localStorage.getItem("categories");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   const [newCategory, setNewCategory] = useState("");
//   const [editIndex, setEditIndex] = useState(null);
//   const [editName, setEditName] = useState("");

//   useEffect(() => {
//     if (typeof propSetCategories === "function") propSetCategories(categories);
//   }, [categories, propSetCategories]);

//   // persist + notify same-tab
//   useEffect(() => {
//     try {
//       localStorage.setItem("categories", JSON.stringify(categories));
//       window.dispatchEvent(new Event("categoriesUpdated"));
//     } catch {
//       // ignore
//     }
//   }, [categories]);

//   const handleAdd = () => {
//     if (!newCategory.trim()) return;
//     const exists = categories.some((c) => c?.name?.toString().toLowerCase() === newCategory.toLowerCase());
//     if (exists) {
//       alert("Category already exists!");
//       return;
//     }
//     setCategories([...categories, { name: newCategory }]);
//     setNewCategory("");
//   };

//   const handleDelete = (index) => {
//     const updated = categories.filter((_, i) => i !== index);
//     setCategories(updated);
//   };

//   const handleEdit = (index, name) => {
//     setEditIndex(index);
//     setEditName(name);
//   };

//   const handleSave = () => {
//     if (!editName.trim()) return;
//     const updated = categories.map((cat, i) => (i === editIndex ? { name: editName } : cat));
//     setCategories(updated);
//     setEditIndex(null);
//     setEditName("");
//   };

//   return (
//     <Card>
//       <div className="p-4 border rounded">
//         <h2 className="text-xl font-bold mb-4">Category Manager</h2>

//         <div className="flex mb-4 gap-2">
//           <input
//             type="text"
//             value={newCategory}
//             onChange={(e) => setNewCategory(e.target.value)}
//             placeholder="Enter new category"
//             className="border p-2 flex-1"
//           />
//           <button onClick={handleAdd} className="bg-blue-500 text-white px-4">
//             Add
//           </button>
//         </div>

//         <table className="w-full border-collapse border">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">S.No</th>
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categories.map((cat, index) => (
//               <tr key={index}>
//                 <td className="border p-2">{index + 1}</td>
//                 <td className="border p-2">
//                   {editIndex === index ? (
//                     <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="border p-1" />
//                   ) : (
//                     cat.name
//                   )}
//                 </td>
//                 <td className="border p-2 flex gap-2">
//                   {editIndex === index ? (
//                     <button onClick={handleSave} className="bg-green-500 text-white px-2">Save</button>
//                   ) : (
//                     <button onClick={() => handleEdit(index, cat.name)} className="bg-yellow-500 text-white px-2">Edit</button>
//                   )}
//                   <button onClick={() => handleDelete(index)} className="bg-red-500 text-white px-2">Delete</button>
//                 </td>
//               </tr>
//             ))}

//             {categories.length === 0 && (
//               <tr>
//                 <td colSpan={3} className="text-center p-4 text-gray-500">No categories added.</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </Card>
//   );
// };

// export default CategoryManager;




import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";

const CategoryManager = ({ categories: propCategories, setCategories: propSetCategories }) => {
  const [categories, setCategories] = useState(() => {
    if (propCategories && Array.isArray(propCategories)) return propCategories;
    try {
      const saved = localStorage.getItem("categories");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newCategory, setNewCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (typeof propSetCategories === "function") propSetCategories(categories);
  }, [categories, propSetCategories]);

  // persist + notify same-tab listeners
  useEffect(() => {
    try {
      localStorage.setItem("categories", JSON.stringify(categories));
      // notify same-tab listeners immediately
      window.dispatchEvent(new Event("categoriesUpdated"));
    } catch {
      // ignore
    }
  }, [categories]);

  const handleAdd = () => {
    const name = (newCategory || "").toString().trim();
    if (!name) return;

    const exists = categories.some((c) => c?.name?.toString().toLowerCase() === name.toLowerCase());
    if (exists) {
      alert("Category already exists!");
      return;
    }

    setCategories([...categories, { name }]);
    setNewCategory("");
  };

  const handleDelete = (index) => {
    const updated = categories.filter((_, i) => i !== index);
    setCategories(updated);
  };

  const handleEdit = (index, name) => {
    setEditIndex(index);
    setEditName(name);
  };

  const handleSave = () => {
    const name = (editName || "").toString().trim();
    if (!name) return;
    const updated = categories.map((cat, i) => (i === editIndex ? { name } : cat));
    setCategories(updated);
    setEditIndex(null);
    setEditName("");
  };

  return (
    <Card>
      <div className="p-4 border rounded">
        <h2 className="text-xl font-bold mb-2">Category Manager</h2>
        <p className="text-sm font-bold mb-2 text-red-500">Add Your categories in First Capital Letter</p>

        <div className="flex mb-4 gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter new category"
            className="border p-2 flex-1"
          />
          <button onClick={handleAdd} className="bg-blue-500 text-white px-4">
            Add
          </button>
        </div>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">S.No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  {editIndex === index ? (
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="border p-1" />
                  ) : (
                    cat.name
                  )}
                </td>
                <td className="border p-2 flex gap-2">
                  {editIndex === index ? (
                    <button onClick={handleSave} className="bg-green-500 text-white px-2">Save</button>
                  ) : (
                    <button onClick={() => handleEdit(index, cat.name)} className="bg-yellow-500 text-white px-2">Edit</button>
                  )}
                  <button onClick={() => handleDelete(index)} className="bg-red-500 text-white px-2">Delete</button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-500">No categories added.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CategoryManager;
