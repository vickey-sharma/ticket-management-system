import StatusBadge from "../ui/StatusBadge";

const TicketDetails = ({ ticket }) => {
  if (!ticket) return null;

  const createdBy =
    typeof ticket.createdBy === "object"
      ? ticket.createdBy
      : null;

  const assignedTo =
    typeof ticket.assignedTo === "object"
      ? ticket.assignedTo
      : null;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-[#0F766E]">
              Ticket #{ticket.ticketNumber || ticket._id}
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              {ticket.title}
            </h1>
          </div>

          <StatusBadge status={ticket.status} />
        </div>
      </div>

      {/* Ticket Information */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Ticket Information
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Priority
            </p>

            <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
              {ticket.priority?.replace("_", " ") || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Status
            </p>

            <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
              {ticket.status?.replace("_", " ") || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Created By
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {createdBy?.fullName || createdBy?.email || "-"}
            </p>

            {createdBy?.email && (
              <p className="text-xs text-gray-500">
                {createdBy.email}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Assigned To
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {assignedTo?.fullName || assignedTo?.email || "Unassigned"}
            </p>

            {assignedTo?.email && (
              <p className="text-xs text-gray-500">
                {assignedTo.email}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Created At
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {formatDate(ticket.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Last Updated
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {formatDate(ticket.updatedAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Description
        </h2>

        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
          {ticket.description || "No description provided."}
        </p>
      </div>
    </div>
  );
};

export default TicketDetails;