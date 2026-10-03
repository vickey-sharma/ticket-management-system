
import { useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import PrimaryButton from "../../components/ui/PrimaryButton";
import SecondaryButton from "../../components/ui/SecondaryButton";

import { changeCurrentPassword } from "../../services/authService";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleCancel = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    setShowPassword({
      old: false,
      new: false,
      confirm: false,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const {
      oldPassword,
      newPassword,
      confirmNewPassword,
    } = formData;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword === oldPassword) {
      toast.error("New password cannot be same as old password");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Both passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await changeCurrentPassword({
        oldPassword,
        newPassword,
        confirmNewPassword,
      });

      handleCancel();

      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full justify-center py-3">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <section>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E5F4F1] text-[#0F766E]">
              <LockKeyhole size={21} />
            </div>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#073B3A]">
              Change Password
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Update your account password.
            </p>
          </div>
        </section>

        {/* Form Card */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <PasswordField
              label="Current Password"
              name="oldPassword"
              value={formData.oldPassword}
              visible={showPassword.old}
              onChange={handleChange}
              onToggle={() => togglePassword("old")}
            />

            <PasswordField
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              visible={showPassword.new}
              onChange={handleChange}
              onToggle={() => togglePassword("new")}
            />

            <PasswordField
              label="Confirm New Password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              visible={showPassword.confirm}
              onChange={handleChange}
              onToggle={() => togglePassword("confirm")}
            />

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <SecondaryButton
                type="button"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </SecondaryButton>

              <PrimaryButton
                type="submit"
                loading={loading}
              >
                Change Password
              </PrimaryButton>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  visible,
  onChange,
  onToggle,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="
            h-11 w-full rounded-xl border border-gray-200
            bg-gray-50 px-4 pr-11 text-sm text-gray-800
            outline-none transition
            placeholder:text-gray-400
            focus:border-[#0F766E]/40
            focus:bg-white
            focus:ring-2
            focus:ring-[#0F766E]/10
          "
        />

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            rounded-lg p-1 text-gray-400 transition
            hover:bg-gray-100 hover:text-gray-600
          "
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
