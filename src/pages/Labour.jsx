// import { useState } from 'react';
// import TabbedPage from '@/components/TabbedPage';
// import LabourDetailsTab from './labour/LabourDetailsTab';
// import useLabourStore from '@/store/labourStore';
// import Button from '@/components/ui/Button';
// import Modal from '@/components/ui/Modal';
// import { toast } from 'sonner';
// import { PlusCircle } from 'lucide-react';
// import Card from '@/components/ui/Card';

// const LabourForm = ({ onSave, onCancel }) => {
//     const [formData, setFormData] = useState({ name: '', phone: '', rate: '', skill: 'Welder' });
//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!formData.name || !formData.rate) return toast.error("Name and Rate are required.");
//         onSave(formData);
//     };
//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div><label>Name</label><input type="text" name="name" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>
//             <div><label>Phone</label><input type="text" name="phone" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
//             <div><label>Skill/Trade</label><input type="text" name="skill" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
//             <div><label>Rate (₹ per day/hr)</label><input type="number" name="rate" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>
//             <div className="flex justify-end space-x-2"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit">Save</Button></div>
//         </form>
//     );
// };

// const LabourLedgerTab = () => (
//     <Card>
//         <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-bold dark:text-dark-text">Labour Ledger</h3>
//             <Button variant="secondary"><PlusCircle className="h-4 w-4 mr-2" />Add Entry</Button>
//         </div>
//         <p className="dark:text-dark-text-secondary text-sm">This table will show a history of work and payments for each labour resource, automatically posted from the JobSheet.</p>
//     </Card>
// );

// const tabs = [
//     { id: 'details', label: 'Labour Details', component: LabourDetailsTab },
//     { id: 'ledger', label: 'Labour Ledger', component: LabourLedgerTab },
// ];

// const Labour = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const { addLabour } = useLabourStore();
//     const handleSave = (data) => {
//         addLabour(data);
//         toast.success("New labour record added!");
//         setIsModalOpen(false);
//     };
//     const headerActions = (
//         <Button onClick={() => setIsModalOpen(true)}><PlusCircle className="h-4 w-4 mr-2" />Add Labour</Button>
//     );

//     return (
//         <>
//             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Labour">
//                 <LabourForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
//             </Modal>
//             <TabbedPage tabs={tabs} title="Labour Management" headerActions={headerActions} />
//         </>
//     );
// };
// export default Labour;




import TabbedPage from "../components/TabbedPage";
import LabourDetailsTab from "./labour/LabourDetailsTab"
import LabourLedgerTab from "./labour/LabourLedgerTab";

const tabs = [
  {
    id: "LabourDetailsTab",
    label: "Labour Details", 
    component:LabourDetailsTab,
  },
  {
    id: "LabourLedgerTab",
    label: "Labour Ledger", 
    component:LabourLedgerTab,
  },
 
   






  // baaki tabs yaha add kar sakta hai Invoice, Challan, GSTLedger...
];

const Accounts = () => {
  return (
    <TabbedPage 
      tabs={tabs} 
      title="Labour Management" 
    />
  );
};

export default Accounts;
