import { ArrowRight, Plus, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHero = ({
  user,
  openTickets = 0,
  onCreateTicket,
}) => {
  const navigate = useNavigate();

  const firstName = user?.fullName?.split(" ")[0] || "there";

  const handleCreateTicket = () => {
    if (onCreateTicket) {
      onCreateTicket();
      return;
    }

    navigate("/tickets/create");
  };

  const handleViewTickets = () => {
    navigate("/tickets");
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#073B3A] px-6 py-8 text-white shadow-sm sm:px-8 sm:py-10 lg:px-10">
      <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/5" />
      <div className="absolute -bottom-40 right-20 h-72 w-72 rounded-full bg-[#0F766E]/30" />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Ticket size={22} />
          </div>

          <p className="text-sm font-medium text-[#8AD8CD]">
            Support workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Good morning, {firstName}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60 sm:text-base">
            Keep track of your support requests and stay on top of what needs
            your attention.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <button
            type="button"
            onClick={handleCreateTicket}
            className="
              inline-flex h-11 items-center justify-center gap-2
              rounded-xl bg-white px-5
              text-sm font-semibold text-[#073B3A]
              shadow-sm transition-all duration-200
              hover:bg-gray-50 hover:shadow-md
              focus:outline-none
              focus:ring-2
              focus:ring-white/30
              active:scale-[0.98]
            "
          >
            <Plus size={17} strokeWidth={2.5} />
            Create Ticket
          </button>

          <button
            type="button"
            onClick={handleViewTickets}
            className="
              inline-flex h-11 items-center justify-center gap-2
              rounded-xl border border-white/15
              bg-white/5 px-5
              text-sm font-semibold text-white
              transition-all duration-200
              hover:bg-white/10
              focus:outline-none
              focus:ring-2
              focus:ring-white/20
              active:scale-[0.98]
            "
          >
            View Tickets
            <ArrowRight size={17} />
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 pt-5">
        <div>
          <p className="text-2xl font-bold">{openTickets}</p>

          <p className="text-xs text-white/45">
            Open tickets
          </p>
        </div>

        <div className="h-9 w-px bg-white/10" />

        <p className="text-xs text-white/45">
          Review your latest requests and updates from one place.
        </p>
      </div>
    </section>
  );
};

export default DashboardHero;