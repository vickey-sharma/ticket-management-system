import logo from "../assets/logo.png"

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F9F9]">

      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#DFF3EF] blur-3xl" />

      <div className="pointer-events-none absolute -bottom-48 -right-40 h-[30rem] w-[30rem] rounded-full bg-[#E5F4F1] blur-3xl" />

      {/* Subtle center glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0F766E]/[0.025] blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-8 sm:px-6">

        {/* Brand */}
        <div className="mb-6 flex flex-col items-center">

          {/* Brand */}
<div className="mb-0 flex flex-col items-center">
  <img
    src={logo}
    alt="Company Logo"
    className="h-18 w-auto object-contain"
  />
</div>

          {/* <div className="mt-3 text-center">
            <h2 className="text-base font-bold tracking-tight text-[#073B3A]">
              Watchdog
            </h2>

            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#0F766E]">
              Helpdesk
            </p>
          </div> */}

        </div>

        {/* Auth content */}
        <main className="flex w-full flex-1 items-start justify-center">
          <div className="w-full max-w-[430px]">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            Secure support workspace
          </p>
        </footer>

      </div>
    </div>
  );
};

export default AuthLayout;