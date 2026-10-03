import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  Users,
  LogOut,
  Headset,
  X,
} from "lucide-react";

const Sidebar = ({ user, isOpen, onClose }) => {
  const navigate = useNavigate();

  const role = user?.role?.toUpperCase();

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Tickets",
      path: "/tickets",
      icon: Ticket,
    },
  ];

  // Users management is available only for ADMIN
  if (role === "ADMIN") {
    navigationItems.push({
      label: "Users",
      path: "/users",
      icon: Users,
    });
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth/login-activate");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          bg-[#073B3A] text-white
          transition-transform duration-300
          lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#073B3A]">
              <Headset size={22} strokeWidth={2.5} />
            </div>

            <div className="text-left">
              <h1 className="text-lg font-bold tracking-tight">Helpdesk</h1>
              <p className="text-[11px] text-white/50">Support Center</p>
            </div>
          </button>

          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Workspace
          </p>

          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    group flex items-center gap-3 rounded-xl px-3.5 py-3
                    text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-[#073B3A] shadow-sm"
                        : "text-white/65 hover:bg-white/10 hover:text-white"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.5 : 2}
                        className="shrink-0"
                      />

                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.fullName || "User"}
              </p>

              <p className="truncate text-xs text-white/45">
                {user?.role || "User"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-white/60 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;