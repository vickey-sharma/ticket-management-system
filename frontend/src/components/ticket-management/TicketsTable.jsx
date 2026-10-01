import React from "react";
import { Eye } from "lucide-react";
import DataTable from "../table/DataTable";
import StatusBadge from "../ui/StatusBadge";
import LoadingState from "../ui/LoadingState";

const getColumns = (role) => [
  "Ticket Number",
  "Issue",
  "Customer / Company",
  "Product",
  "Priority",
  "Department",
  "Status",
  ...(role !== "client" ? ["Assigned To", "Created By"] : []),
  "Created At",
  "Action",
];

const formatLabel = (value) => {
  if (!value) return "—";

  return value
    .split("_")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "red";

    case "medium":
      return "yellow";

    case "low":
      return "green";

    default:
      return "gray";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "open":
      return "blue";

    case "in_progress":
      return "yellow";

    case "resolved":
      return "green";

    case "closed":
      return "gray";

    default:
      return "gray";
  }
};

export default function TicketsTable({
  tickets,
  loading,
  onView,
  role
}) {
  if (loading) {
    return (
      <LoadingState
        variant="table"
        rows={8}
        columns={getColumns(role).length}
      />
    );
  }

  if (!tickets?.length) {
    return (
      <div className="flex min-h-[250px] items-center justify-center text-sm text-slate-500">
        No tickets found.
      </div>
    );
  }

  return (
    <DataTable columns={getColumns(role)}>
      {tickets.map((ticket) => (
        <tr
          key={ticket._id}
          className="transition hover:bg-slate-50"
        >

          {/* Ticket Number */}
          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
            {ticket.ticketNumber || "—"}
          </td>

          {/* Issue */}
          <td className="min-w-[220px] px-6 py-4">
            <div className="text-sm font-medium text-slate-900">
              {ticket.issueTitle || "—"}
            </div>

            <div className="mt-1 max-w-[280px] truncate text-xs text-slate-500">
              {ticket.issueDescription || "—"}
            </div>
          </td>

          {/* Customer / Company */}
          <td className="min-w-[200px] px-6 py-4">
            <div className="text-sm font-medium text-slate-900">
              {ticket.contactPerson || "—"}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {ticket.companyName || "—"}
            </div>
          </td>

          {/* Product */}
          <td className="min-w-[200px] px-6 py-4">
            <div className="text-sm font-medium text-slate-900">
              {ticket.productName || "—"}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {ticket.modelNumber || "—"}
            </div>

            {ticket.serialNumber?.length > 0 && (
              <div className="mt-1 text-xs text-slate-500">
                SN: {ticket.serialNumber.join(", ")}
              </div>
            )}
          </td>

          {/* Priority */}
          <td className="whitespace-nowrap px-6 py-4">
            <StatusBadge
              text={formatLabel(ticket.priority)}
              color={getPriorityColor(ticket.priority)}
            />
          </td>

          {/* Department */}
          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
            {formatLabel(ticket.department)}
          </td>

          {/* Status */}
          <td className="whitespace-nowrap px-6 py-4">
            <StatusBadge
              text={formatLabel(ticket.ticketStatus)}
              color={getStatusColor(ticket.ticketStatus)}
            />
          </td>

          {/* Assigned To */}
          {role !== "client" && (
          <td className="min-w-[160px] px-6 py-4">
          {ticket.assignedTo ? (
  <>
    <div className="text-sm font-medium text-slate-900">
      {ticket.assignedTo.fullName || "—"}
    </div>

    <div className="mt-1 text-xs text-slate-500">
      {ticket.assignedTo.role
        ? formatLabel(ticket.assignedTo.role)
        : "—"}
    </div>
  </>
) : (
  <StatusBadge
    text="Unassigned"
    color="yellow"
  />
)}
          </td>
          )}

          {/* Created By */}
          {role !== "client" && (
          <td className="min-w-[160px] px-6 py-4">
            {ticket.createdBy ? (
              <>
                <div className="text-sm font-medium text-slate-900">
                  {ticket.createdBy.fullName || "—"}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {ticket.createdBy.role
                    ? formatLabel(ticket.createdBy.role)
                    : "—"}
                </div>
              </>
            ) : (
              "—"
            )}
          </td>
          )}

          {/* Created At */}
          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
            {formatDate(ticket.createdAt)}
          </td>

          {/* Action */}
          <td className="whitespace-nowrap px-6 py-4">
            <button
              type="button"
              onClick={() => onView(ticket)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-[#56BD05]"
              title="View Ticket"
            >
              <Eye size={17} />
              View
            </button>
          </td>

        </tr>
      ))}
    </DataTable>
  );
}