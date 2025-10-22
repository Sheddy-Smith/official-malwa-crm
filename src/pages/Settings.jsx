import { useState, useEffect } from "react";
import TabbedPage from "@/components/TabbedPage";
import UserManagementTab from "./settings/UserManagementTab";
import MyProfileTab from "./settings/MyProfileTab";
import BranchesTab from "./settings/BranchesTab";
import AdminPasswordModal from "@/components/AdminPasswordModal";
import useAuthStore from "@/store/authStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Users, UserCircle, Building2, Shield, Settings as SettingsIcon, Key } from "lucide-react";
import Button from "@/components/ui/Button";

const tabs = [
  { id: "users", label: "User Management", component: UserManagementTab, adminOnly: true },
  { id: "profile", label: "My Profile", component: MyProfileTab },
  { id: "branches", label: "Branches", component: BranchesTab, adminOnly: true }
];

const Settings = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserRole();
  }, [user]);

  const checkUserRole = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setUserRole("Accountant");
        setIsVerified(true);
      } else {
        setUserRole(data.role);

        if (data.role === "Director") {
          setShowPasswordModal(true);
        } else {
          setIsVerified(true);
        }
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      setUserRole("Accountant");
      setIsVerified(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSuccess = () => {
    setIsVerified(true);
    setShowPasswordModal(false);
  };

  const handlePasswordCancel = () => {
    navigate("/dashboard");
  };

  const filteredTabs = tabs.filter((tab) => {
    if (tab.adminOnly && userRole !== "Director") {
      return false;
    }
    return true;
  });

  const handleQuickAction = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  const quickActions = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {userRole === "Director" && (
        <button
          onClick={() => handleQuickAction("users")}
          className="flex items-center gap-4 p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl hover:shadow-lg transition-all duration-200 border border-red-200 dark:border-red-800 group"
        >
          <div className="flex-shrink-0 w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Manage Users</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Add, edit, and manage user accounts</p>
          </div>
        </button>
      )}

      <button
        onClick={() => handleQuickAction("profile")}
        className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl hover:shadow-lg transition-all duration-200 border border-blue-200 dark:border-blue-800 group"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <UserCircle className="h-6 w-6 text-white" />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">My Profile</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">View and edit your profile information</p>
        </div>
      </button>

      {userRole === "Director" && (
        <button
          onClick={() => handleQuickAction("branches")}
          className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl hover:shadow-lg transition-all duration-200 border border-green-200 dark:border-green-800 group"
        >
          <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Branch Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Manage company branches and locations</p>
          </div>
        </button>
      )}

      <button
        onClick={() => handleQuickAction("profile")}
        className="flex items-center gap-4 p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl hover:shadow-lg transition-all duration-200 border border-purple-200 dark:border-purple-800 group"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <Key className="h-6 w-6 text-white" />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Change Password</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Update your account password</p>
        </div>
      </button>

      <button
        onClick={() => handleQuickAction("profile")}
        className="flex items-center gap-4 p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl hover:shadow-lg transition-all duration-200 border border-orange-200 dark:border-orange-800 group"
      >
        <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <div className="text-left">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Security Settings</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your security preferences</p>
        </div>
      </button>

      {userRole === "Director" && (
        <button
          onClick={() => handleQuickAction("users")}
          className="flex items-center gap-4 p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl hover:shadow-lg transition-all duration-200 border border-indigo-200 dark:border-indigo-800 group"
        >
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">User Permissions</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Configure user access and permissions</p>
          </div>
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <AdminPasswordModal
        isOpen={showPasswordModal}
        onSuccess={handlePasswordSuccess}
        onCancel={handlePasswordCancel}
      />
    );
  }

  return <TabbedPage tabs={filteredTabs} title="Settings" contentBeforeTabs={quickActions} />;
};

export default Settings;
