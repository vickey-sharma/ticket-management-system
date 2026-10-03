import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F9]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
        />

        {/* Main area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <Topbar
            user={user}
            onMenuClick={handleOpenSidebar}
          />

          {/* Page content */}
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1600px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;