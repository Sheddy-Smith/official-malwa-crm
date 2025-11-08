import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { User, Mail, Lock, Building2, Shield } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { dbOperations } from "@/lib/db";
import { toast } from "sonner";

const MyProfileTab = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          branch:branches(name)
        `)
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const { data: authUser } = await supabase.auth.getUser();

        const newProfile = {
          id: user.id,
          name: authUser?.user?.user_metadata?.name || authUser?.user?.email?.split('@')[0] || "User",
          email: authUser?.user?.email || user.email || "",
          role: "Accountant",
          status: "Active",
          permissions: {
            dashboard: "full",
            jobs: "full",
            customer: "full",
            vendors: "full",
            labour: "full",
            supplier: "full",
            inventory: "full",
            accounts: "full",
            summary: "view",
            settings: "none"
          }
        };

        const { error: insertError } = await supabase
          .from("profiles")
          .insert([newProfile]);

        if (insertError) throw insertError;

        setProfile({ ...newProfile, branch: null });
        toast.success("Profile created successfully");
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditForm({
      name: profile?.name || "",
      email: profile?.email || ""
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          name: editForm.name,
          email: editForm.email,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      toast.success("Profile updated successfully");
      setIsEditModalOpen(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: currentPassword
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success("Password changed successfully");
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password");
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card title="My Profile">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Full Name
                </label>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {profile.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email Address
                </label>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Role
                </label>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {profile.role}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Branch
                </label>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {profile.branch?.name || "Not assigned"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-5 w-5 mt-1 flex items-center justify-center">
                <div className={`h-3 w-3 rounded-full ${profile.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </label>
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                  {profile.status}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
            <Button onClick={handleEditProfile}>
              Edit Profile
            </Button>
            <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Full Name *
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Email Address *
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Current Password *
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              New Password *
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Confirm New Password *
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsPasswordModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyProfileTab;
