
import { useEffect, useState } from "react";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import PrimaryButton from "../../../components/ui/PrimaryButton";
import SearchableDropdown from "../../../components/ui/SearchableDropdown";
import StatusBadge from "../../../components/ui/StatusBadge";
import TicketComments from "../../../components/ticket-management/TicketComments";

import {
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../../../services/ticketService";

import { getAllAgentUsers } from "../../../services/authService";

const AdminTicketDetailsPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [agents, setAgents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "open",
  });

  const [assignedToId, setAssignedToId] = useState("");

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

      setAssignedToId(
        typeof ticketData?.assignedTo === "object"
          ? ticketData?.assignedTo?._id || ""
          : ticketData?.assignedTo || ""
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async (search = "") => {
    try {
      setLoadingAgents(true);

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await getAllAgentUsers(params);

      const responseData = response?.data?.data;

      const users =
        responseData?.users ||
        responseData?.data ||
        [];

      setAgents(
        users.map((agent) => ({
          value: agent._id,
          label: `${agent.fullName} (${agent.email})`,
        }))
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load agents"
      );
    } finally {
      setLoadingAgents(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchAgents();
  }, [ticketId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!assignedToId) {
      toast.error("Please select an agent");
      return;
    }

    try {
      setSaving(true);

      const response = await updateTicket(ticketId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        assignedToId,
      });

      const updatedTicket =
        response?.data?.data?.ticket ||
        response?.data?.ticket;

      setTicket((prev) => ({
        ...prev,
        ...updatedTicket,
      }));

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

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteTicket(ticketId);

      toast.success("Ticket deleted successfully");

      navigate("/dashboard/tickets/admin");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete ticket"
      );
    } finally {
      setDeleting(false);
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
        <p className="text-gray-500">
          Ticket not found.
        </p>
      </div>
    );
  }

  const createdBy =
    typeof ticket.createdBy === "object"
      ? ticket.createdBy
      : null;

  const assignedAgent =
    typeof ticket.assignedTo === "object"
      ? ticket.assignedTo
      : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/tickets/admin")
            }
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-[#0F766E]"
          >
            <ArrowLeft size={17} />
            Back to Tickets
          </button>

          <p className="text-sm font-medium text-[#0F766E]">
            Ticket #{ticket.ticketNumber || ticket._id}
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {ticket.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={ticket.status} />

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={17} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
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
              className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
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
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
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
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
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
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
              >
                <option value="open">Open</option>
                <option value="in_progress">
                  In Progress
                </option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Assigned Agent */}
          <div>
            <SearchableDropdown
              label="Assigned Agent"
              value={assignedToId}
              options={agents}
              onChange={setAssignedToId}
              onSearch={fetchAgents}
              placeholder="Select agent"
            />

            {assignedAgent && (
              <p className="mt-2 text-xs text-gray-400">
                Currently assigned to{" "}
                <span className="font-medium text-gray-500">
                  {assignedAgent.fullName}
                </span>
              </p>
            )}
          </div>

          {/* Save */}
          <div className="flex justify-end border-t border-gray-100 pt-5">
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

export default AdminTicketDetailsPage;
