import TabbedPage from '@/components/TabbedPage';
import UserManagementTab from './settings/UserManagementTab';

const Placeholder = ({ title }) => <div className="dark:text-dark-text"><h3 className="text-lg font-bold">{title}</h3><p className="mt-2 text-gray-600 dark:text-dark-text-secondary">Content for {title} will go here.</p></div>;

const tabs = [
    { id: 'users', label: 'User Management', component: UserManagementTab },
    { id: 'profile', label: 'My Profile', component: () => <Placeholder title="My Profile" /> },
    { id: 'branches', label: 'Branches', component: () => <Placeholder title="Branch Management" /> },
];

const Settings = () => {
    return (
        <TabbedPage tabs={tabs} title="Settings" />
    );
};
export default Settings;
