import { Bell, Menu, Search } from "lucide-react";

const Topbar = ({ user, onMenuClick }) => {
  const firstName = user?.fullName?.split(" ")[0] || "User";

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Welcome back, {firstName}
          </h2>

          <p className="hidden text-sm text-gray-500 sm:block">
            Here's what's happening with your support tickets.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search tickets..."
            className="
              h-10 w-56 rounded-xl border border-gray-200
              bg-gray-50 pl-10 pr-4 text-sm text-gray-900
              outline-none transition
              placeholder:text-gray-400
              focus:border-[#0F766E]
              focus:bg-white
              focus:ring-2
              focus:ring-[#0F766E]/10
              lg:w-64
            "
          />
        </div>

        {/* Notification */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          aria-label="Notifications"
        >
          <Bell size={20} />

          {/* Notification indicator */}
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DFF5F1] text-sm font-bold text-[#0F766E]">
            {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="hidden min-w-0 sm:block">
            <p className="max-w-32 truncate text-sm font-semibold text-gray-900">
              {user?.fullName || "User"}
            </p>

            <p className="text-xs capitalize text-gray-500">
              {user?.role || "User"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;