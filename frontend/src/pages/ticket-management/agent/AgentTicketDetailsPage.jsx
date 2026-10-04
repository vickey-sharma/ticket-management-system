import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import PrimaryButton from "../../../components/ui/PrimaryButton";
import StatusBadge from "../../../components/ui/StatusBadge";
import TicketComments from "../../../components/ticket-management/TicketComments";

import {
  getTicketById,
  updateTicket,
} from "../../../services/ticketService";

const AgentTicketDetailsPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "open",
  });

  const fetchTicket = async () => {
    try {
      setLoading(true);

      const response = await getTicketById(ticketId);

      const ticketData =
        response?.data?.data?.ticket ||
        response?.data?.ticket ||
        response?.data?.data;

      setTicket(ticketData);

      setFormData({
        title: ticketData?.title || "",
        description: ticketData?.description || "",
        priority: ticketData?.priority || "low",
        status: ticketData?.status || "open",
      });
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      setSaving(true);

      const response = await updateTicket(ticketId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
      });

      const updatedTicket =
        response?.data?.data?.ticket ||
        response?.data?.ticket;

      setTicket((prev) => ({
        ...prev,
        ...updatedTicket,
      }));

      setFormData({
        title: updatedTicket?.title || formData.title,
        description:
          updatedTicket?.description ||
          formData.description,
        priority:
          updatedTicket?.priority ||
          formData.priority,
        status:
          updatedTicket?.status ||
          formData.status,
      });

      toast.success(
        response?.data?.message ||
          "Ticket updated successfully"
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update ticket"
      );
    } finally {
      setSaving(false);
    }
  };

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
            navigate("/dashboard/tickets/agent")
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

      {/* Update Ticket */}
      <form
        onSubmit={handleUpdate}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Update Ticket
        </h2>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-700 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
            />
          </div>

          {/* Priority + Status */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
              >
                <option value="open">Open</option>
                <option value="in_progress">
                  In Progress
                </option>
                <option value="resolved">
                  Resolved
                </option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Assignment - Read Only */}
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Assigned To
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {assignedTo?.fullName ||
                assignedTo?.email ||
                "You"}
            </p>

            {assignedTo?.email && (
              <p className="text-xs text-gray-500">
                {assignedTo.email}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <PrimaryButton
              type="submit"
              loading={saving}
            >
              Save Changes
            </PrimaryButton>
          </div>
        </div>
      </form>

      {/* Ticket Information */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Ticket Information
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Created By
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {createdBy?.fullName ||
                createdBy?.email ||
                "-"}
            </p>
          </div>

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
        </div>
      </div>

      {/* Comments */}
      <TicketComments ticketId={ticketId} />
    </div>
  );
};

export default AgentTicketDetailsPage;