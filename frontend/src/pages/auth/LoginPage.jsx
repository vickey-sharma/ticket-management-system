
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

import logo from "../../assets/logo.png";

import AuthLayout from "../../layouts/AuthLayout.jsx";
import AuthCard from "../../components/auth/AuthCard.jsx";
import InputField from "../../components/ui/InputField.jsx";

import { loginUser } from "../../services/authService.js";
import { useAuth } from "../../hooks/useAuth.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { fetchCurrentUser } = useAuth();

  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = loginData.email.trim().toLowerCase();
    const password = loginData.password;

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      if (response.data.success) {
        await fetchCurrentUser();

        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard className="animate-authReveal">
        {/* Brand */}
        <div className="mb-8 text-center">
          {/* <div className="mb-6 flex justify-center">
            <img
              src={logo}
              alt="Company Logo"
              className="h-14 w-auto object-contain"
            />
          </div> */}

          <h1 className="text-2xl font-bold tracking-tight text-[#073B3A] sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Sign in to access your helpdesk workspace.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <InputField
            label="Email address"
            type="email"
            value={loginData.email}
            placeholder="you@example.com"
            autoComplete="email"
            onChange={(e) =>
              setLoginData({
                ...loginData,
                email: e.target.value,
              })
            }
          />

          {/* Password */}
          <InputField
            label="Password"
            type="password"
            value={loginData.password}
            placeholder="Enter your password"
            autoComplete="current-password"
            onChange={(e) =>
              setLoginData({
                ...loginData,
                password: e.target.value,
              })
            }
          />

          {/* Forgot password */}
          <div className="-mt-1 flex justify-end">
            <span className="text-sm font-medium text-gray-400">
              Forgot password?
            </span>
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
              shadow-lg shadow-[#073B3A]/10
              transition-all duration-200
              hover:bg-[#0A4D4A]
              hover:shadow-xl hover:shadow-[#073B3A]/15
              focus:outline-none
              focus:ring-2
              focus:ring-[#0F766E]/30
              disabled:cursor-not-allowed
              disabled:opacity-60
              active:scale-[0.99]
            "
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign in

                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200/80" />

          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            New here?
          </span>

          <div className="h-px flex-1 bg-gray-200/80" />
        </div>

        {/* Register */}
        <Link
          to="/auth/register"
          className="
            flex h-11 w-full items-center justify-center
            rounded-xl
            border border-gray-200/80
            bg-white/70
            text-sm font-semibold text-[#073B3A]
            shadow-sm
            backdrop-blur-sm
            transition-all duration-200
            hover:border-[#0F766E]/30
            hover:bg-white
            hover:shadow-md
          "
        >
          Create a customer account
        </Link>

        {/* Security note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck size={14} />
          <span>Your account is protected</span>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
