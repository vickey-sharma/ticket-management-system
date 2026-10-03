
import {
  X,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logoutUser } from "../../services/authService";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";

import { sidebarConfig } from "../../config/sidebarConfig";

export default function Sidebar({
  user,
  open = false,
  onClose,
}) {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const role = user?.role?.trim().toLowerCase();
  const navigation = sidebarConfig[role] || [];

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Logout locally even if the API request fails.
    } finally {
      setUser(null);
      localStorage.removeItem("user");

      navigate("/auth/login", {
        replace: true,
      });

      toast.success("Logged out successfully");
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-screen w-64 shrink-0 flex-col
          border-r border-gray-200 bg-white
          transition-transform duration-200
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center border-b border-gray-100 px-5">
          <div className="mb-0 flex flex-col items-center">
            <img
              src={logo}
              alt="Company Logo"
              className="h-13 w-auto object-contain"
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-gray-400 hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
               <NavLink
  key={item.path + item.name}
  to={item.path}
  end
  onClick={onClose}
  className={({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-[#E5F4F1] text-[#0F766E]"
        : "text-gray-600 hover:bg-gray-50 hover:text-[#073B3A]"
    }`
  }
>
  <Icon size={18} strokeWidth={1.8} />
  <span>{item.name}</span>
</NavLink>
              );
            })}
          </div>
        </nav>

        {/* User / Logout */}
        <div className="shrink-0 border-t border-gray-100 p-3">
          <div className="mb-2 rounded-xl bg-[#F7F9F9] px-3 py-3">
            <p className="truncate text-sm font-semibold text-[#073B3A]">
              {user?.fullName || "User"}
            </p>

            <p className="mt-0.5 truncate text-xs text-gray-400">
              {user?.email || ""}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
