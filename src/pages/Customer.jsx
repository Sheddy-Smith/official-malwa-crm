import { useState } from 'react';
import TabbedPage from '@/components/TabbedPage';
import LeadsTab from './customer/LeadsTab';
import ContactsTab from './customer/ContactsTab';
import LedgerTab from './customer/LedgerTab';
import Button from '@/components/ui/Button';
import { PlusCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import useCustomerStore from '@/store/customerStore';
import { toast } from 'sonner';

const CustomerForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', address: '', gstin: '' });
    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!formData.name || !formData.phone) return toast.error("Name and Phone are required.");
        onSave(formData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label>Name</label><input type="text" name="name" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>
            <div><label>Phone</label><input type="text" name="phone" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>
            <div><label>Address</label><input type="text" name="address" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
            <div><label>GSTIN (Optional)</label><input type="text" name="gstin" onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
            <div className="flex justify-end space-x-2"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
    );
};

const tabs = [
  { id: 'contacts', label: 'Contacts', component: ContactsTab },
  { id: 'leads', label: 'Leads', component: LeadsTab },
  { id: 'ledger', label: 'Customer Ledger', component: LedgerTab },
];

const Customer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addCustomer } = useCustomerStore();

    const handleSave = (data) => {
        addCustomer(data);
        toast.success("New customer added successfully!");
        setIsModalOpen(false);
    };
    const headerActions = (
        <Button onClick={() => setIsModalOpen(true)}><PlusCircle className="h-4 w-4 mr-2" />Add Customer</Button>
    );

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Customer">
                <CustomerForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            <TabbedPage tabs={tabs} title="Customer Management" headerActions={headerActions} />
        </>
    );
};
export default Customer;
