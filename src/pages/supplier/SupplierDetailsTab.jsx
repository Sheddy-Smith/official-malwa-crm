import { useState } from 'react';
import useSupplierStore from '@/store/supplierStore';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';

const SupplierForm = ({ supplier, onSave, onCancel }) => {
    const [formData, setFormData] = useState(supplier || { name: '', phone: '', category: 'Hardware' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) return toast.error("Supplier name is required.");
        onSave(formData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>
            <div><label>Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
            <div><label>Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red"><option>Hardware</option><option>Steel</option><option>Paints</option><option>Parts</option></select></div>
            <div className="flex justify-end space-x-2"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
    );
};

const SupplierDetailsTab = () => {
    const { suppliers, updateSupplier, deleteSupplier } = useSupplierStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setIsModalOpen(true);
    };
    const handleSave = (data) => {
        updateSupplier({ ...editingSupplier, ...data });
        toast.success("Supplier updated!");
        setIsModalOpen(false);
    };
    const handleDelete = (supplier) => {
        setSupplierToDelete(supplier);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        deleteSupplier(supplierToDelete.id);
        toast.success("Supplier deleted.");
        setIsDeleteModalOpen(false);
    }

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Supplier">
                <SupplierForm supplier={editingSupplier} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Supplier"
                message={`Are you sure you want to delete ${supplierToDelete?.name}?`}
            />
            <div className="overflow-x-auto">
                <table className="w-full text-sm dark:text-dark-text-secondary">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                        <tr><th className="p-2">Name</th><th className="p-2">Phone</th><th className="p-2">Category</th><th className="p-2 text-right">Actions</th></tr>
                    </thead>
                    <tbody>
                        {suppliers.length > 0 ? suppliers.map(s => (
                            <tr key={s.id} className="border-b dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800/50">
                                <td className="p-2 font-medium dark:text-dark-text">{s.name}</td><td className="p-2">{s.phone}</td><td className="p-2">{s.category}</td>
                                <td className="p-2 text-right space-x-1">
                                    <Button variant="ghost" className="p-1 h-auto" onClick={() => handleEdit(s)}><Edit className="h-4 w-4 text-blue-600"/></Button>
                                    <Button variant="ghost" className="p-1 h-auto" onClick={() => handleDelete(s)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center p-8 text-gray-500 dark:text-dark-text-secondary">No suppliers found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default SupplierDetailsTab;
