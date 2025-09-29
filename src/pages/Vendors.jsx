import { useState } from 'react';
import TabbedPage from '@/components/TabbedPage';
import VendorDetailsTab from './vendors/VendorDetailsTab';
import useVendorStore from '@/store/vendorStore';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import Card from '@/components/ui/Card';

const VendorForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', address: '', gstin: '', category: '' });
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) return toast.error("Name and Phone are required.");
        onSave(formData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label>Name</label><input type="text" name="name" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>
            <div><label>Phone</label><input type="text" name="phone" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>
            <div><label>Category/Skill</label><input type="text" name="category" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" placeholder="e.g. Parts Dealer, Painting"/></div>
            <div><label>Address</label><input type="text" name="address" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
            <div><label>GSTIN</label><input type="text" name="gstin" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
            <div className="flex justify-end space-x-2"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
    );
};


const VendorLedgerTab = () => (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold dark:text-dark-text">Vendor Ledger</h3>
            <Button variant="secondary"><PlusCircle className="h-4 w-4 mr-2" />Add Entry</Button>
        </div>
        <p className="dark:text-dark-text-secondary text-sm">This table will show a history of transactions (work orders, payments) for each vendor, automatically posted from the JobSheet.</p>
    </Card>
);

const tabs = [
  { id: 'details', label: 'Vendor Details', component: VendorDetailsTab },
  { id: 'ledger', label: 'Vendor Ledger', component: VendorLedgerTab },
];

const Vendors = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addVendor } = useVendorStore();

    const handleSave = (vendorData) => {
        addVendor(vendorData);
        toast.success("New vendor added!");
        setIsModalOpen(false);
    };

    const headerActions = (
        <Button onClick={() => setIsModalOpen(true)}><PlusCircle className="h-4 w-4 mr-2" />Add Vendor</Button>
    );

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Vendor">
                <VendorForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            <TabbedPage tabs={tabs} title="Vendor Management" headerActions={headerActions} />
        </>
    );
};
export default Vendors;
