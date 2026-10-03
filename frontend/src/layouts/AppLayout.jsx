
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/app-layout/Sidebar";
import { useAuth } from "../hooks/useAuth";

export default function AppLayout() {
  const { user } = useAuth();

  console.log("APP LAYOUT USER:", user);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-[#F7F9F9]">
      {/* Fixed Sidebar */}
      <Sidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right Side */}
      <div className="flex h-screen flex-col lg:ml-64">
        {/* Fixed Top Bar */}
        <header className="z-30 h-16 shrink-0 border-b border-gray-200 bg-white">
          <div className="flex h-full items-center px-4 sm:px-6 lg:px-8">
            {/* Mobile menu */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={21} />
            </button>

            {/* User */}
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-[#073B3A]">
                  {user?.fullName || "User"}
                </p>

                <p className="text-xs capitalize text-gray-400">
                  {user?.role || ""}
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5F4F1] text-sm font-bold text-[#0F766E]">
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* ONLY THIS AREA SCROLLS */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
