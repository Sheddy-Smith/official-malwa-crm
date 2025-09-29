import { useState } from 'react';
import useLabourStore from '@/store/labourStore';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';

const LabourForm = ({ labour, onSave, onCancel }) => {
    const [formData, setFormData] = useState(labour || { name: '', phone: '', rate: '', skill: 'Welder' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.rate) return toast.error("Name and Rate are required.");
        onSave(formData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>
            <div><label>Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
            <div><label>Skill/Trade</label><input type="text" name="skill" value={formData.skill} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" /></div>
            <div><label>Rate (₹ per day/hr)</label><input type="number" name="rate" value={formData.rate} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>
            <div className="flex justify-end space-x-2"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit">Save</Button></div>
        </form>
    );
};

const LabourDetailsTab = () => {
    const { labours, updateLabour, deleteLabour } = useLabourStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLabour, setEditingLabour] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [labourToDelete, setLabourToDelete] = useState(null);

    const handleEdit = (labour) => {
        setEditingLabour(labour);
        setIsModalOpen(true);
    };
    const handleSave = (data) => {
        updateLabour({ ...editingLabour, ...data });
        toast.success("Labour details updated!");
        setIsModalOpen(false);
    };
    const handleDelete = (labour) => {
        setLabourToDelete(labour);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        deleteLabour(labourToDelete.id);
        toast.success("Labour record deleted.");
        setIsDeleteModalOpen(false);
    }

    return (
        <div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Labour Details">
                <LabourForm labour={editingLabour} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Labour"
                message={`Are you sure you want to delete ${labourToDelete?.name}?`}
            />
            <div className="overflow-x-auto">
                <table className="w-full text-sm dark:text-dark-text-secondary">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                        <tr><th className="p-2">Name</th><th className="p-2">Phone</th><th className="p-2">Skill/Role</th><th className="p-2">Rate</th><th className="p-2 text-right">Actions</th></tr>
                    </thead>
                    <tbody>
                        {labours.length > 0 ? labours.map(l => (
                            <tr key={l.id} className="border-b dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800/50">
                                <td className="p-2 font-medium dark:text-dark-text">{l.name}</td><td className="p-2">{l.phone}</td><td className="p-2">{l.skill}</td><td className="p-2">{l.rate}</td>
                                <td className="p-2 text-right space-x-1">
                                    <Button variant="ghost" className="p-1 h-auto" onClick={() => handleEdit(l)}><Edit className="h-4 w-4 text-blue-600"/></Button>
                                    <Button variant="ghost" className="p-1 h-auto" onClick={() => handleDelete(l)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-500 dark:text-dark-text-secondary">No labour records found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default LabourDetailsTab;
