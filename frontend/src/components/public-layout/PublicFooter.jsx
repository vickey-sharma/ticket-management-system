import { Headset } from "lucide-react";

const PublicFooter = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#073B3A] text-white">
            <Headset size={16} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Helpdesk
            </p>

            <p className="text-xs text-gray-400">
              Support Center
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Helpdesk. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default PublicFooter;