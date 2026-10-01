import { Link, useNavigate, useLocation } from "react-router-dom";
import { sidebarConfig } from "../../config/sidebarConfig";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import watchdogLogoTransparent from "../../assets/watchdogLogoTransparent.png";
import { logoutUser } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";


export default function Sidebar({ role }) {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser } = useAuth();

  const [openMenus, setOpenMenus] = useState({});

  const menuItems =
    role === "client"
      ? sidebarConfig.client
      : sidebarConfig.internal.filter((item) => {
          if (item.children) {
            return item.roles.includes(role);
          }

          return item.roles.includes(role);
        });

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

 const handleLogout = async () => {
  try {
    await logoutUser();
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    // localStorage.clear();
     setUser(null);
    navigate("/auth/login-activate", { replace: true });
  }
};

  return (
    <div className="fixed top-0 left-0 w-72 h-screen bg-white flex flex-col shadow-[6px_0_20px_rgba(15,23,42,0.08)]">

      {/* HEADER */}

      <div className="w-full bg-white px-0 py-0 shadow-[6px_0_20px_rgba(15,23,42,0.08)] flex items-center justify-center">

        {/* <h1 className="text-2xl font-bold text-[#56BD05]">
          CRM Helpdesk
        </h1> */}
<div className="">
         <img
                  src={watchdogLogoTransparent}
                  alt="Logo"
                  className="w-35 h-19.5 object-contain transition-all duration-300 
         hover:-translate-y-[10px]"
                />
                </div>

        {/* <p className="text-sm text-gray-500 capitalize">
          {role} Panel
        </p> */}

      </div>

      {/* MENU */}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {menuItems.map((item) => {

          // ---------- SUB MENU ----------

          if (item.children) {

            return (

              <div key={item.name}>

                <button
                  onClick={() => toggleMenu(item.name)}
                  className="w-full flex justify-between items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-green-50"
                >

                  <span>{item.name}</span>

                  {openMenus[item.name] ? (
                    <ChevronDown size={21} />
                  ) : (
                    <ChevronRight size={21} />
                  )}

                </button>

                {openMenus[item.name] && (

                  <div className="ml-4 mt-2 space-y-1">

                    {item.children
                      .filter((child) => child.roles.includes(role))
                      .map((child) => {

                        const isActive =
                          location.pathname === child.path;

                        return (

                          <Link
                            key={child.path}
                            to={child.path}
                            className={`block px-4 py-2 rounded-lg text-sm ${
                              isActive
                                ? "bg-green-100 text-[#56BD05]"
                                : "text-gray-600 hover:bg-green-50"
                            }`}
                          >

                            {child.name}

                          </Link>

                        );
                      })}

                  </div>

                )}

              </div>

            );
          }

          // ---------- NORMAL MENU ----------

          const isActive = location.pathname === item.path;

          return (

            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                isActive
                  ? "bg-green-100 text-[#56BD05]"
                  : "text-gray-600 hover:bg-green-50"
              }`}
            >

              {item.name}

            </Link>

          );
        })}

      </div>

      {/* LOGOUT */}

      <div className="p-2">

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50"
        >

          Logout

        </button>

      </div>

    </div>
  );
}