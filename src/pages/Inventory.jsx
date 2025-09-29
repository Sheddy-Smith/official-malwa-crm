//   working code
// import TabbedPage from '@/components/TabbedPage';
// import StockTab from './inventory/StockTab';
// import StockMovementsTab from './inventory/StockMovements'
// import CategoryManagerTab from './inventory/CategoryManager';

// const tabs = [
//     { id: 'stock', label: 'Stock List', component: StockTab },
//     { id: 'movements', label: 'Stock Movements', component: StockMovementsTab },
//     { id: 'categories', label: 'Manage Categories', component: CategoryManagerTab },

// ];

// const Inventory = () => <TabbedPage tabs={tabs} title="Inventory Management"/>;
// export default Inventory;

// owner-code-run
// import React, { useState } from "react";
// import TabbedPage from "@/components/TabbedPage";
// import StockTab from "./inventory/StockTab";
// import StockMovementsTab from "./inventory/StockMovements";
// import CategoryManagerTab from "./inventory/CategoryManager";

// // Updated: tabs will receive categories props dynamically
// const Inventory = () => {
//   // old and working code
//   const [categories, setCategories] = useState(["Hardware", "Steel", "Paints"]);

// const tabs = [
//     { id: "stock", label: "Stock List", component: (props) => <StockTab {...props} /> },
//     { id: "movements", label: "Stock Movements", component: StockMovementsTab },
//     { id: "categories", label: "Manage Categories", component: (props) => <CategoryManagerTab {...props} /> },
//   ];

//   return (
//     <TabbedPage
//       tabs={tabs.map(tab => ({
//         ...tab,
//         component: (tabProps) => tab.component({ ...tabProps, categories, setCategories })
//       }))}
//       title="Inventory Management"
//     />
//   );
// };

// export default Inventory;

// Experiment code :-

// import React, { useState, useEffect } from "react";
// import TabbedPage from "@/components/TabbedPage";
// import StockTab from "./inventory/StockTab";
// import StockMovementsTab from "./inventory/StockMovements";
// import CategoryManagerTab from "./inventory/CategoryManager";

// const Inventory = () => {
//   const [categories, setCategories] = useState([]);

//   // ✅ Load categories from localStorage on first render
//   useEffect(() => {
//     const saved = localStorage.getItem("categories");
//     if (saved) {
//       setCategories(JSON.parse(saved));
//     } else {
//       // default categories
//       setCategories([{ name: "Hardware" }, { name: "Steel" }, { name: "Paints" }]);
//     }
//   }, []);

//   // ✅ Save categories to localStorage whenever they change
//   useEffect(() => {
//     if (categories.length > 0) {
//       localStorage.setItem("categories", JSON.stringify(categories));
//     } else {
//       localStorage.removeItem("categories");
//     }
//   }, [categories]);

//   const tabs = [
//     { id: "stock", label: "Stock List", component: (props) => <StockTab {...props} /> },
//     { id: "movements", label: "Stock Movements", component: StockMovementsTab },
//     { id: "categories", label: "Manage Categories", component: (props) => <CategoryManagerTab {...props} /> },
//   ];

//   return (
//     <TabbedPage
//       tabs={tabs.map(tab => ({
//         ...tab,
//         component: (tabProps) => tab.component({ ...tabProps, categories, setCategories })
//       }))}
//       title="Inventory Management"
//     />
//   );
// };

// export default Inventory;

// Experiment code final

import React, { useState, useEffect } from "react";
import TabbedPage from "@/components/TabbedPage";
import StockTab from "./inventory/StockTab";
import StockMovementsTab from "./inventory/StockMovements";
import CategoryManagerTab from "./inventory/CategoryManager";

const Inventory = () => {
  const [categories, setCategories] = useState([]);

  // Load categories from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("categories");
    if (saved) {
      setCategories(JSON.parse(saved)); // [{name: "Hardware"}, ...]
    } else {
      // default categories
      setCategories([
        { name: "Hardware" },
        { name: "Steel" },
        { name: "Paints" },
      ]);
    }
  }, []);


  const tabs = [
    {
      id: "stock",
      label: "Stock List",
      component: (props) => <StockTab {...props} />,
    },
    { id: "movements", label: "Stock Movements", component: StockMovementsTab },
    {
      id: "categories",
      label: "Manage Categories",
      component: (props) => <CategoryManagerTab {...props} />,
    },
  ];

  return (
    <TabbedPage
      tabs={tabs.map((tab) => ({
        ...tab,
        component: (tabProps) =>
          tab.component({ ...tabProps, categories, setCategories }),
      }))}
      title="Inventory Management"
    />
  );
};

export default Inventory;
