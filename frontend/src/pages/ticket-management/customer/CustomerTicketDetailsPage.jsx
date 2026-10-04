import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import StatusBadge from "../../../components/ui/StatusBadge";
import TicketComments from "../../../components/ticket-management/TicketComments";

import { getTicketById } from "../../../services/ticketService";

const CustomerTicketDetailsPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    try {
      setLoading(true);

      const response = await getTicketById(ticketId);

      const ticketData =
        response?.data?.data?.ticket ||
        response?.data?.ticket ||
        response?.data?.data;

      setTicket(ticketData);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading ticket...
        </p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-gray-500">
          Ticket not found.
        </p>
      </div>
    );
  }

  const assignedTo =
    typeof ticket.assignedTo === "object"
      ? ticket.assignedTo
      : null;

  const createdBy =
    typeof ticket.createdBy === "object"
      ? ticket.createdBy
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() =>
            navigate("/dashboard/tickets/customer")
          }
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0F766E]"
        >
          <ArrowLeft size={17} />
          Back to Tickets
        </button>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#0F766E]">
              Ticket #{ticket.ticketNumber || ticket._id}
            </p>

            <h1 className="mt-1 text-2xl font-bold text-gray-900">
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
          {/* Priority */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Priority
            </p>

            <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
              {ticket.priority || "-"}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Status
            </p>

            <p className="mt-1 text-sm font-semibold capitalize text-gray-800">
              {ticket.status?.replace("_", " ") || "-"}
            </p>
          </div>

          {/* Assigned Agent */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Assigned To
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {assignedTo?.fullName ||
                assignedTo?.email ||
                "Not assigned yet"}
            </p>

            {assignedTo?.email && (
              <p className="text-xs text-gray-500">
                {assignedTo.email}
              </p>
            )}
          </div>

          {/* Created By */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Created By
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {createdBy?.fullName ||
                createdBy?.email ||
                "You"}
            </p>
          </div>

          {/* Created At */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Created At
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {ticket.createdAt
                ? new Date(
                    ticket.createdAt
                  ).toLocaleString("en-IN")
                : "-"}
            </p>
          </div>

          {/* Updated At */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Last Updated
            </p>

            <p className="mt-1 text-sm text-gray-700">
              {ticket.updatedAt
                ? new Date(
                    ticket.updatedAt
                  ).toLocaleString("en-IN")
                : "-"}
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
          {ticket.description ||
            "No description provided."}
        </p>
      </div>

      {/* Comments */}
      <TicketComments ticketId={ticketId} />
    </div>
  );
};

export default CustomerTicketDetailsPage;