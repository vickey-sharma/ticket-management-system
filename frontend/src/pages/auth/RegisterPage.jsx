import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { ArrowRight, UserPlus } from "lucide-react";

import toast from "react-hot-toast";

import AuthLayout from "../../layouts/AuthLayout.jsx";

import AuthCard from "../../components/auth/AuthCard.jsx";

import InputField from "../../components/ui/InputField.jsx";

import { registerCustomer } from "../../services/authService.js";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (fullName.length < 2) {
      toast.error("Please enter a valid name");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
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

    try {
      setLoading(true);

      const registrationData = {
        fullName,
        email,
        password,
        confirmPassword,
      };

      const response = await registerCustomer(registrationData);

      if (response.data.success) {
        toast.success("Account created successfully");
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create your account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard className="animate-authReveal">
        {/* Heading */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E5F4F1] text-[#0F766E]">
            <UserPlus size={22} strokeWidth={2} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#073B3A] sm:text-3xl">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Join the helpdesk and start managing your support requests.
          </p>
        </div>

        {/* Registration form */}
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full name */}
          <InputField
            label="Full name"
            type="text"
            name="fullName"
            value={form.fullName}
            placeholder="Enter your full name"
            autoComplete="name"
            onChange={handleChange}
          />

          {/* Email */}
          <InputField
            label="Email address"
            type="email"
            name="email"
            value={form.email}
            placeholder="you@example.com"
            autoComplete="email"
            onChange={handleChange}
          />

          {/* Password */}
          <InputField
            label="Password"
            type="password"
            name="password"
            value={form.password}
            placeholder="Create a password"
            autoComplete="new-password"
            onChange={handleChange}
          />

          {/* Confirm password */}
          <InputField
            label="Confirm password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            placeholder="Confirm your password"
            autoComplete="new-password"
            onChange={handleChange}
          />

          {/* Account information */}
          <div className="rounded-xl bg-[#F3F8F7] px-4 py-3">
            <p className="text-xs leading-5 text-gray-500">
              Your account will be created as a customer account.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              group
              flex h-12 w-full items-center justify-center gap-2
              rounded-xl
              bg-[#073B3A]
              px-5
              text-sm font-semibold text-white
              shadow-sm
              transition-all duration-200
              hover:bg-[#0A4D4A]
              hover:shadow-md
              focus:outline-none
              focus:ring-2
              focus:ring-[#0F766E]/30
              disabled:cursor-not-allowed
              disabled:opacity-60
              active:scale-[0.99]
            "
          >
            {loading ? (
              "Creating account..."
            ) : (
              <>
                Create account

                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        </form>

        {/* Login divider */}
        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />

          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Already registered?
          </span>

          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* Login */}
        <Link
          to="/auth/login"
          className="
            flex h-11 w-full items-center justify-center
            rounded-xl
            border border-gray-200
            bg-white
            text-sm font-semibold text-[#073B3A]
            transition-all duration-200
            hover:border-[#0F766E]/30
            hover:bg-[#F7F9F9]
          "
        >
          Sign in instead
        </Link>
      </AuthCard>
    </AuthLayout>
  );
}