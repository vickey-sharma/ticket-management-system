
import { useCallback, useEffect, useState } from "react";
import { Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import TicketsFilters from "../../../components/ticket-management/TicketsFilters";
import TicketsTable from "../../../components/ticket-management/TicketsTable";

import { getAgentTickets } from "../../../services/ticketService";

const AgentTicketsPage = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchTickets = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        const params = {
          page,
          limit: pagination.limit,
        };

        if (filters.search.trim()) {
          params.search = filters.search.trim();
        }

        if (filters.status) {
          params.status = filters.status.toLowerCase();
        }

        if (filters.priority) {
          params.priority = filters.priority.toLowerCase();
        }

        const response = await getAgentTickets(params);

        const responseData = response.data?.data;

        setTickets(
          responseData?.tickets ||
            responseData?.data ||
            []
        );

        setPagination((prev) => ({
          ...prev,
          page: responseData?.pagination?.page || page,
          total:
            responseData?.pagination?.total ||
            responseData?.pagination?.totalTickets ||
            0,
          totalPages:
            responseData?.pagination?.totalPages || 1,
        }));
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load assigned tickets"
        );
      } finally {
        setLoading(false);
      }
    },
    [
      filters.search,
      filters.status,
      filters.priority,
      pagination.limit,
    ]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [
    filters.search,
    filters.status,
    filters.priority,
  ]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      status: "",
      priority: "",
    });
  };

  const handleTicketClick = (ticket) => {
    const ticketId = ticket?._id || ticket?.id;

    if (!ticketId) return;

    navigate(
      `/dashboard/tickets/agent/${ticketId}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F4F1] text-[#0F766E]">
          <Ticket size={21} />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#073B3A]">
            Assigned Tickets
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View and manage tickets assigned to you.
          </p>
        </div>
      </div>

      {/* Filters */}
      <TicketsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        showAssigneeFilter={false}
      />

      {/* Result count */}
      {!loading && (
        <p className="text-sm text-gray-500">
          {pagination.total}{" "}
          {pagination.total === 1
            ? "assigned ticket"
            : "assigned tickets"}
        </p>
      )}

      {/* Table */}
      <TicketsTable
        tickets={tickets}
        loading={loading}
        onTicketClick={handleTicketClick}
         showAssignee={true}
      />

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={pagination.page <= 1}
            onClick={() =>
              fetchTickets(pagination.page - 1)
            }
            className="
              rounded-xl border border-gray-200
              bg-white px-4 py-2
              text-sm font-semibold text-gray-600
              transition hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Previous
          </button>

          <div className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-[#073B3A] px-3 text-sm font-semibold text-white">
            {pagination.page}
          </div>

          <button
            type="button"
            disabled={
              pagination.page >= pagination.totalPages
            }
            onClick={() =>
              fetchTickets(pagination.page + 1)
            }
            className="
              rounded-xl border border-gray-200
              bg-white px-4 py-2
              text-sm font-semibold text-gray-600
              transition hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AgentTicketsPage;
