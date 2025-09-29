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



import React, { useState } from "react";

const JobSheetStep = () => {
  // Dummy job data (as a beginner, no store/state management)
  const job = {
    estimate: {
      items: [
        { id: 1, description: "Engine Oil Change" },
        { id: 2, description: "Brake Pad Replacement" },
        { id: 3, description: "Wheel Alignment" },
      ],
    },
  };

  // Dummy labours & vendors
//   const labours = [
//     { id: 1, name: "Raju" },
//     { id: 2, name: "Aman" },
//   ];
//   const vendors = [
//     { id: 1, name: "Vendor A" },
//     { id: 2, name: "Vendor B" },
//   ];

  // Handle notes state for each item
//   const [notes, setNotes] = useState({});

  // Agar job data na ho
//   if (!job) return <div>Loading Job...</div>;

  const items = job.estimate.items;

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-xl font-bold">Job Sheet</h3>

      {/* Tasks from Estimate */}
      <div className="border rounded-lg p-3 shadow">
        <h4 className="font-semibold mb-2">Tasks from Estimate</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                {["#", "Description", "Work By", "Work Done Notes"].map((h) => (
                  <th key={h} className="p-2">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b even:bg-gray-50"
                >
                  {/* Sr No */}
                  {/* <td className="p-2">{index + 1}</td> */}

                  {/* Description */}
                  {/* <td className="p-2 font-medium">{item.description}</td> */}

                  {/* Select work by */}
                  {/* <td className="p-2">
                    <select className="w-full p-1 border rounded">
                      <option value="">Assign to...</option>
                      <optgroup label="In-house Labour">
                        {labours.map((l) => (
                          <option key={l.id} value={`labour_${l.id}`}>
                            {l.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Vendors">
                        {vendors.map((v) => (
                          <option key={v.id} value={`vendor_${v.id}`}>
                            {v.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </td> */}

                  {/* Work Done Notes */}
                  {/* <td className="p-2">
                    <input
                      type="text"
                      placeholder="Enter notes..."
                      className="w-full p-1 border rounded"
                      value={notes[item.id] || ""}
                      onChange={(e) =>
                        setNotes({ ...notes, [item.id]: e.target.value })
                      }
                    />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extra Work Section */}
      <div className="border rounded-lg p-3 shadow">
        <h4 className="font-semibold mb-2">Extra Work</h4>
        <p className="text-sm text-gray-500">
          Use this section to add any work or parts not included in the
          estimate.
        </p>
        <div className="mt-3">
          <button className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded">
            ➕ Add Extra Work
          </button>
        </div>
      </div>

      {/* Finalize Button */}
      <div className="flex justify-end pt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Finalize JobSheet & Post to Ledgers
        </button>
      </div>
    </div>
  );
};

export default JobSheetStep;
