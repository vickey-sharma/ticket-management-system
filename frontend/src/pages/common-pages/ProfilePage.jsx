
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { User } from "lucide-react";

import PrimaryButton from "../../components/ui/PrimaryButton";
import SecondaryButton from "../../components/ui/SecondaryButton";

import {
  getCurrentUser,
  updateProfile,
} from "../../services/authService";

import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Full name and email are required");
      return;
    }

    try {
      setLoading(true);

      await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
      });

      const response = await getCurrentUser();
      const updatedUser = response.data?.data?.user;

      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
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
              <User size={21} />
            </div>

            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[#073B3A]">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your profile information.
            </p>
          </div>
        </section>

        {/* Form Card */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="
                  h-11 w-full rounded-xl border border-gray-200
                  bg-gray-50 px-4 text-sm text-gray-800
                  outline-none transition
                  placeholder:text-gray-400
                  focus:border-[#0F766E]/40
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#0F766E]/10
                "
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="
                  h-11 w-full rounded-xl border border-gray-200
                  bg-gray-50 px-4 text-sm text-gray-800
                  outline-none transition
                  placeholder:text-gray-400
                  focus:border-[#0F766E]/40
                  focus:bg-white
                  focus:ring-2
                  focus:ring-[#0F766E]/10
                "
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Role
              </label>

              <div className="flex h-11 items-center rounded-xl border border-gray-200 bg-gray-50 px-4">
                <span className="text-sm capitalize text-gray-500">
                  {user?.role || "User"}
                </span>
              </div>
            </div>

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
                Save Changes
              </PrimaryButton>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
