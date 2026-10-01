import { Bell, Search, Settings, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ user, role, title = "Dashboard" }) {

  const navigate = useNavigate();

  const searchPlaceholder =
    role === "client"
      ? "Search warranty, tickets..."
      : "Search users, tickets, orders...";

  return (
    <header className="w-full bg-white/90 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
      
      {/* LEFT */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      {/* CENTER */}
      <div className="hidden md:flex items-center bg-white rounded-xl px-3 py-2 w-72 border border-gray-100 shadow-inner">
        <Search size={15} className="text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="bg-transparent outline-none text-sm ml-2 w-full text-gray-700 placeholder:text-gray-400"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

      
{/* Quick Add */}
<button
  onClick={() => navigate("/admin/dashboard/ticket/create")}
  className="px-5 py-2 rounded-lg bg-gradient-to-b from-green-50 to-green-100 border border-green-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 text-sm font-medium text-gray-900 whitespace-nowrap"
>
  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#56BD05] shadow-sm pr-0.2">
    <Plus size={13} strokeWidth={3} className="text-white" />
  </span>

  Create Ticket
</button>



        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <Bell size={16} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full shadow-[0_0_6px_rgba(239,68,68,0.7)]"></span>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        onClick={()=> navigate("/admin/dashboard/profile-details")}>
          <Settings size={16} className="text-gray-600" />
        </button>

        {/* User Info */}
        <div className="px-8 py-1.5 rounded-lg bg-white border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-900 leading-tight">
            {user.fullName}
          </p>
          <p className="text-[11px] text-gray-500 capitalize leading-tight">
            {user.role}
          </p>
        </div>
      </div>
    </header>
  );
}