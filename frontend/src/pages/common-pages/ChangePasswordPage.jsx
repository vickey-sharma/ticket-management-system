import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SecondaryButton from "../../components/ui/SecondaryButton";
import { useState } from "react";
import { changePassword } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import PageCard from "../../components/auth/PageCard";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";


export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
 

   const { user, loading: authLoading } = useAuth();
   

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword && !formData.newPassword && !formData.confirmPassword) {
  toast.error("All fields are required.");
  return;
}

if (!formData.currentPassword) {
  toast.error("Current password is required.");
  return;
}

if (!formData.newPassword) {
  toast.error("New password is required.");
  return;
}

if (!formData.confirmPassword) {
  toast.error("Confirm new password is required.");
  return;
}

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New and Confirm new password do not match.");
      return;
    }

    if (formData.currentPassword === formData.newPassword && formData.currentPassword.length !== 0) {
      toast.error("New password cannot be the same as the current password.");
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword({
         oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.newPassword,
      });


      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // const user = JSON.parse(localStorage.getItem("user"));

toast.success(response.message || "Password updated successfully!");

setTimeout(() => {
  if (user?.role === "admin") {
    navigate("/admin/dashboard");
  } else {
    // client (or any other role)
    navigate("/client/dashboard");
  }
}, 1000);


    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-0">
            {/* <Sidebar role={user.role} /> */}
      
      <PageCard className="mt-0">
        <div className="flex flex-col items-center mx-20 my-5 mt-0">
           
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <LockKeyhole className="w-8 h-8 text-[#56BD05]" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Change Password
          </h1>

          <p className="text-slate-500 mt-2 text-left">
            Update your account password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
         

         
<InputField
  label="Current Password"
  type={showCurrentPassword ? "text" : "password"}
  value={formData.currentPassword}
  placeholder="Enter current password"
  onChange={(e) =>
    setFormData({
      ...formData,
      currentPassword: e.target.value,
    })
  }
  rightElement={
    <button
      type="button"
      onClick={() => setShowCurrentPassword((prev) => !prev)}
      className="text-gray-500 hover:text-gray-700"
    >
      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  }
/>

<InputField
  label="New Password"
  type={showNewPassword ? "text" : "password"}
  value={formData.newPassword}
  placeholder="Enter new password"
  onChange={(e) =>
    setFormData({
      ...formData,
      newPassword: e.target.value,
    })
  }
  rightElement={
    <button
      type="button"
      onClick={() => setShowNewPassword((prev) => !prev)}
      className="text-gray-500 hover:text-gray-700"
    >
      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  }
/>

<InputField
  label="Confirm New Password"
  type={showConfirmPassword ? "text" : "password"}
  value={formData.confirmPassword}
  placeholder="Confirm new password"
  onChange={(e) =>
    setFormData({
      ...formData,
      confirmPassword: e.target.value,
    })
  }
  rightElement={
    <button
      type="button"
      onClick={() => setShowConfirmPassword((prev) => !prev)}
      className="text-gray-500 hover:text-gray-700"
    >
      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  }
/>
       

          <div className="flex flex-row items-center gap-3">
            <SecondaryButton
              text="Cancel"
              onClick={() => navigate(-1)}
              className="mt-5"
            />

            <PrimaryButton className="mt-4"
              text="Update Password"
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      </PageCard>
    </div>
  );
}