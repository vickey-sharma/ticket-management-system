
import { useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import toast from "react-hot-toast";
import FilterDropdown from "../ui/FilterDropdown";

import { registerUserByAdmin } from "../../services/authService";

export default function CreateUserModal({
  open,
  onClose,
  onCreated,
}) {
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "agent",
    password: "",
    confirmPassword: "",
  });

  if (!open) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const role = formData.role.trim().toLowerCase();

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      toast.error("All fields are required");
      return;
    }

    if (fullName.length < 2) {
      toast.error("Full name must be at least 2 characters");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!["admin", "agent"].includes(role)) {
      toast.error("Invalid role");
      return;
    }

    try {
      setLoading(true);

      await registerUserByAdmin({
        fullName,
        email,
        role,
        password,
        confirmPassword,
      });

      toast.success("User created successfully");

      setFormData({
        fullName: "",
        email: "",
        role: "agent",
        password: "",
        confirmPassword: "",
      });

      setShowPassword(false);
      setShowConfirmPassword(false);

      onCreated();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;

    setFormData({
      fullName: "",
      email: "",
      role: "agent",
      password: "",
      confirmPassword: "",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm">
      <div
        className="
          relative
          w-full
          max-w-lg
          overflow-hidden
          rounded-3xl
          border
          border-gray-200
          bg-white
          shadow-[0_30px_80px_rgba(15,23,42,0.20)]
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 sm:px-7">
          <div>
            <h2 className="text-lg font-semibold text-[#073B3A]">
              Create User
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create an admin or support agent account.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[90vh] overflow-y-auto px-6 py-6 sm:px-7"
        >
          <div className="space-y-5">
            {/* Full Name */}
            <FormField
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
            />

            {/* Email */}
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              autoComplete="email"
            />

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Role
              </label>

              <FilterDropdown
                value={formData.role}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: value,
                  }))
                }
                placeholder="Select Role"
                options={[
                  { value: "agent", label: "Agent" },
                  { value: "admin", label: "Admin" },
                ]}
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Customers are created through public registration.
              </p>
            </div>

            {/* Password */}
            <PasswordField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              visible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
            />

            {/* Confirm Password */}
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              visible={showConfirmPassword}
              onToggle={() =>
                setShowConfirmPassword((prev) => !prev)
              }
            />
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                h-11
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                text-sm
                font-semibold
                text-gray-600
                transition
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                h-11
                rounded-xl
                bg-[#073B3A]
                px-5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-[#0A4D4A]
                focus:outline-none
                focus:ring-2
                focus:ring-[#0F766E]/30
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="
          h-11
          w-full
          rounded-xl
          border
          border-gray-200
          bg-white
          px-3.5
          text-sm
          text-gray-800
          outline-none
          transition
          placeholder:text-gray-400
          focus:border-[#0F766E]/40
          focus:ring-2
          focus:ring-[#0F766E]/10
        "
      />
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
          className="
            h-11
            w-full
            rounded-xl
            border
            border-gray-200
            bg-white
            px-3.5
            pr-11
            text-sm
            text-gray-800
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-[#0F766E]/40
            focus:ring-2
            focus:ring-[#0F766E]/10
          "
        />

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-md
            p-1
            text-gray-400
            transition
            hover:text-gray-600
          "
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
}
