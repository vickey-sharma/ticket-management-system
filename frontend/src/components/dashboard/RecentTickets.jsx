import { ArrowRight, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatusBadge from "../ui/StatusBadge";

import {
  getAdminTickets,
  getAgentTickets,
  getCustomerTickets,
} from "../../services/ticketService";

const RecentTickets = ({ user }) => {
  console.log("RECENT TICKETS USER:", user);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTickets = async () => {
      if (!user?.role) {
        setTickets([]);
        setLoading(false);
        return;
      }

      let getTicketsService;

      if (user.role === "admin") {
        getTicketsService = getAdminTickets;
      } else if (user.role === "agent") {
        getTicketsService = getAgentTickets;
      } else if (user.role === "customer") {
        getTicketsService = getCustomerTickets;
      } else {
        setTickets([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

      const response = await getTicketsService({
  page: 1,
  limit: 5,
});

console.log("USER:", user);
console.log("RECENT TICKETS RESPONSE:", response);
console.log("RESPONSE DATA:", response.data?.data);



        const responseData = response.data?.data;

        setTickets(
          responseData?.tickets ||
            responseData?.data ||
            []
        );
      } catch (error) {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTickets();
  }, [user?.role]);

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleViewAll = () => {
    if (user?.role === "admin") {
      navigate("/dashboard/tickets/admin");
      return;
    }

    if (user?.role === "agent") {
      navigate("/dashboard/tickets/agent");
      return;
    }

    if (user?.role === "customer") {
      navigate("/dashboard/tickets/customer");
    }
  };

  const handleTicketClick = (ticket) => {
    const ticketId = ticket?._id || ticket?.id;

    if (!ticketId) return;

    if (user?.role === "admin") {
      navigate(`/dashboard/tickets/admin/${ticketId}`);
      return;
    }

    if (user?.role === "agent") {
      navigate(`/dashboard/tickets/agent/${ticketId}`);
      return;
    }

    if (user?.role === "customer") {
      navigate(`/dashboard/tickets/customer/${ticketId}`);
    }
  };

  const getTicketId = (ticket) => {
    return ticket?.ticketNumber || ticket?._id || ticket?.id || "—";
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Recent Tickets
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest tickets in your workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={handleViewAll}
          className="
            inline-flex items-center gap-1.5
            rounded-lg px-3 py-2
            text-sm font-semibold text-[#0F766E]
            transition
            hover:bg-[#E5F4F1]
          "
        >
          View all
          <ArrowRight size={16} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center px-5 py-12 text-sm text-gray-500">
          <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#0F766E]" />
          Loading tickets...
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
            <Ticket size={21} />
          </div>

          <p className="mt-3 text-sm font-semibold text-gray-900">
            No recent tickets
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Your latest tickets will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {tickets.slice(0, 5).map((ticket) => {
            const ticketId = getTicketId(ticket);

            return (
              <button
                key={ticket._id || ticket.id}
                type="button"
                onClick={() => handleTicketClick(ticket)}
                className="
                  flex w-full items-center gap-4
                  px-5 py-4 text-left
                  transition
                  hover:bg-gray-50
                  sm:px-6
                "
              >
                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5F4F1] text-[#0F766E] sm:flex">
                  <Ticket size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      title={ticketId}
                      className="max-w-[180px] truncate font-mono text-xs font-semibold text-[#0F766E]"
                    >
                      {ticketId}
                    </span>

                    <span className="hidden text-xs text-gray-300 sm:inline">
                      •
                    </span>

                    <span className="hidden text-xs text-gray-400 sm:inline">
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm font-semibold text-gray-900">
                    {ticket.title || "Untitled ticket"}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {ticket.description || "No description"}
                  </p>
                </div>

                <div className="shrink-0">
                  <StatusBadge status={ticket.status} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTickets;