import { useState, useEffect } from "react";
import TabbedPage from "@/components/TabbedPage";
import UserManagementTab from "./settings/UserManagementTab";
import MyProfileTab from "./settings/MyProfileTab";
import BranchesTab from "./settings/BranchesTab";
import AdminPasswordModal from "@/components/AdminPasswordModal";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const tabs = [
  { id: "users", label: "User Management", component: UserManagementTab, adminOnly: true },
  { id: "profile", label: "My Profile", component: MyProfileTab },
  { id: "branches", label: "Branches", component: BranchesTab, adminOnly: true }
];

const Settings = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
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

      setUserRole(data?.role);

      if (data?.role === "Director") {
        setShowPasswordModal(true);
      } else {
        setIsVerified(true);
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      navigate("/dashboard");
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

  return <TabbedPage tabs={filteredTabs} title="Settings" />;
};

export default Settings;
