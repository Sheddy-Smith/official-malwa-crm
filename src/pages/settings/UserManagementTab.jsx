import { useState } from 'react';
import useUserManagementStore from '@/store/userManagementStore';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';
import { Edit, Trash2, PlusCircle, KeyRound } from 'lucide-react';

const UserForm = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState(user || { name: '', email: '', role: 'Project Manager', branch: 'Head Office' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.role) return toast.error("All fields are required.");
        onSave(formData);
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div><label>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>
            <div><label>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red" required /></div>
            <div><label>Role</label><select name="role" value={formData.role} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red"><option>Project Manager</option><option>Marketing Manager</option><option>Accountant</option><option>Branch Manager</option></select></div>
            <div><label>Branch</label><select name="branch" value={formData.branch} onChange={handleChange} className="w-full mt-1 p-2 border rounded-lg bg-transparent dark:border-gray-600 focus:ring-2 focus:ring-brand-red"><option>Head Office</option><option>Branch A</option><option>Branch B</option></select></div>
            <div className="pt-2"><Button variant="secondary" type="button" className="w-full justify-start"><KeyRound className="h-4 w-4 mr-2"/> Reset PIN</Button></div>
            <div className="flex justify-end space-x-2"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit">Save User</Button></div>
        </form>
    );
};

const UserManagementTab = () => {
    const { users, addUser, updateUser, deleteUser } = useUserManagementStore();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleAdd = () => {
        setEditingUser(null);
        setIsFormModalOpen(true);
    }

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsFormModalOpen(true);
    };
    const handleSave = (data) => {
        if (editingUser) {
            updateUser({ ...editingUser, ...data });
            toast.success("User updated!");
        } else {
            addUser(data);
            toast.success("New user added!");
        }
        setIsFormModalOpen(false);
    };

    const handleDelete = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };
    const confirmDelete = () => {
        deleteUser(userToDelete.id);
        toast.success(`User "${userToDelete.name}" deleted.`);
        setIsDeleteModalOpen(false);
    }

    return (
        <div>
            <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={editingUser ? "Edit User" : "Add New User"}>
                <UserForm user={editingUser} onSave={handleSave} onCancel={() => setIsFormModalOpen(false)} />
            </Modal>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete user ${userToDelete?.name}?`}
            />
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold dark:text-dark-text">Registered Users</h3>
                <Button onClick={handleAdd}><PlusCircle className="h-4 w-4 mr-2" />Add User</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm dark:text-dark-text-secondary">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-left">
                        <tr><th className="p-2">Name</th><th className="p-2">Role</th><th className="p-2">Branch</th><th className="p-2">Status</th><th className="p-2 text-right">Actions</th></tr>
                    </thead>
                    <tbody>
                         {users.length > 0 ? users.map(u => (
                            <tr key={u.id} className="border-b dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-800/50">
                                <td className="p-2 font-medium dark:text-dark-text">{u.name}</td>
                                <td className="p-2">{u.role}</td><td className="p-2">{u.branch}</td>
                                <td className="p-2"><span className={`px-2 py-1 text-xs font-medium rounded-full ${u.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{u.status}</span></td>
                                <td className="p-2 text-right space-x-1">
                                    <Button variant="ghost" className="p-1 h-auto" onClick={() => handleEdit(u)}><Edit className="h-4 w-4 text-blue-600"/></Button>
                                    <Button variant="ghost" className="p-1 h-auto" onClick={() => handleDelete(u)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-500 dark:text-dark-text-secondary">No users found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default UserManagementTab;
