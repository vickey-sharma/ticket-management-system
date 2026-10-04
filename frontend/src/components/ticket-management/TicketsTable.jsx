import { Eye, Trash2 } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

const TicketsTable = ({
  tickets = [],
  loading = false,
  onTicketClick,
  onDeleteTicket,
  isAdmin = false,
  showAssignee = true,
}) => {
  const handleTicketClick = (ticket) => {
    if (onTicketClick) {
      onTicketClick(ticket);
    }
  };

  const handleDeleteClick = (event, ticket) => {
    event.stopPropagation();

    if (onDeleteTicket) {
      onDeleteTicket(ticket);
    }
  };

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

  const getUserName = (user) => {
    if (!user) return "—";

    if (typeof user === "string") {
      return user;
    }

    return user.name || user.fullName || user.email || "—";
  };

  const getPriorityClasses = (priority) => {
    switch (priority?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";

      case "HIGH":
        return "bg-red-50 text-red-700";

      case "MEDIUM":
        return "bg-orange-50 text-orange-700";

      case "LOW":
        return "bg-blue-50 text-blue-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-sm">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#0F766E]" />
          Loading tickets...
        </div>
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
          <Eye size={22} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-gray-900">
          No tickets found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          There are no tickets matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/80">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Ticket
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Title
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Priority
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>

              {showAssignee && (
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Assigned To
                </th>
              )}

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Created
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {tickets.map((ticket) => {
              const ticketId = ticket._id || ticket.id;
              const ticketNumber = ticket.ticketNumber;

              return (
                <tr
                  key={ticketId}
                  onClick={() => handleTicketClick(ticket)}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                >
                  {/* Ticket Number */}
                  <td className="px-5 py-4">
                    <span
                      title={ticketNumber}
                      className="block max-w-[140px] truncate font-mono text-xs font-semibold text-[#0F766E]"
                    >
                      {ticketNumber || "—"}
                    </span>
                  </td>

                  {/* Title */}
                  <td className="max-w-[280px] px-5 py-4">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {ticket.title || "Untitled ticket"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {ticket.description || "No description"}
                    </p>
                  </td>

                  {/* Priority */}
                  <td className="px-5 py-4">
                    <span
                      className={`
                        inline-flex rounded-full
                        px-2.5 py-1
                        text-xs font-semibold
                        ${getPriorityClasses(ticket.priority)}
                      `}
                    >
                      {ticket.priority || "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={ticket.status} />
                  </td>

                  {/* Assigned To */}
                  {showAssignee && (
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {getUserName(ticket.assignedTo)}
                    </td>
                  )}

                  {/* Created */}
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                    {formatDate(ticket.createdAt)}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleTicketClick(ticket);
                        }}
                        className="
                          inline-flex h-9 w-9
                          items-center justify-center
                          rounded-lg text-gray-400
                          transition
                          hover:bg-[#E5F4F1]
                          hover:text-[#0F766E]
                        "
                        aria-label="View ticket"
                        title="View ticket"
                      >
                        <Eye size={18} />
                      </button>

                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(event) =>
                            handleDeleteClick(event, ticket)
                          }
                          className="
                            inline-flex h-9 w-9
                            items-center justify-center
                            rounded-lg text-gray-400
                            transition
                            hover:bg-red-50
                            hover:text-red-600
                          "
                          aria-label="Delete ticket"
                          title="Delete ticket"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="divide-y divide-gray-100 md:hidden">
        {tickets.map((ticket) => {
          const ticketId = ticket._id || ticket.id;
          const ticketNumber = ticket.ticketNumber;

          return (
            <div
              key={ticketId}
              onClick={() => handleTicketClick(ticket)}
              className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    title={ticketNumber}
                    className="truncate font-mono text-xs font-semibold text-[#0F766E]"
                  >
                    {ticketNumber || "—"}
                  </p>

                  <h3 className="mt-1 truncate text-sm font-semibold text-gray-900">
                    {ticket.title || "Untitled ticket"}
                  </h3>
                </div>

                <StatusBadge status={ticket.status} />
              </div>

              <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                {ticket.description || "No description"}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className={`
                    rounded-full px-2.5 py-1
                    text-xs font-semibold
                    ${getPriorityClasses(ticket.priority)}
                  `}
                >
                  {ticket.priority || "—"}
                </span>

                {showAssignee && (
                  <>
                    <span className="text-xs text-gray-400">
                      •
                    </span>

                    <span className="text-xs text-gray-500">
                      {getUserName(ticket.assignedTo)}
                    </span>
                  </>
                )}

                <span className="text-xs text-gray-400">
                  •
                </span>

                <span className="text-xs text-gray-500">
                  {formatDate(ticket.createdAt)}
                </span>
              </div>

              {isAdmin && (
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={(event) =>
                      handleDeleteClick(event, ticket)
                    }
                    className="
                      inline-flex items-center gap-2
                      rounded-lg border border-red-200
                      px-3 py-2
                      text-xs font-medium text-red-600
                      transition
                      hover:bg-red-50
                    "
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketsTable;