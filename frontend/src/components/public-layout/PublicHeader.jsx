import { Headset, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const PublicHeader = ({ user = null }) => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Helpdesk home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#073B3A] text-white">
            <Headset size={19} strokeWidth={2.5} />
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-gray-900">
              Helpdesk
            </p>

            <p className="hidden text-[10px] font-medium text-gray-400 sm:block">
              Support Center
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="
              hidden rounded-lg px-3 py-2
              text-sm font-medium text-gray-600
              transition hover:bg-gray-100 hover:text-gray-900
              sm:block
            "
          >
            Home
          </Link>

          {user ? (
            <button
              type="button"
              onClick={handleDashboard}
              className="
                inline-flex h-10 items-center gap-2
                rounded-xl bg-[#0F766E]
                px-4 text-sm font-semibold text-white
                shadow-sm transition
                hover:bg-[#0B625C]
                hover:shadow-md
                focus:outline-none
                focus:ring-2
                focus:ring-[#0F766E]/20
              "
            >
              Dashboard
            </button>
          ) : (
            <Link
              to="/auth/login-activate"
              className="
                inline-flex h-10 items-center gap-2
                rounded-xl bg-[#0F766E]
                px-4 text-sm font-semibold text-white
                shadow-sm transition
                hover:bg-[#0B625C]
                hover:shadow-md
                focus:outline-none
                focus:ring-2
                focus:ring-[#0F766E]/20
              "
            >
              <LogIn size={16} />
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default PublicHeader;