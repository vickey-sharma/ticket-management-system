import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import InputField from "../ui/InputField";
import TextArea from "../ui/TextArea";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

import { updateTicket } from "../../services/ticketService";

const EditTicketForm = ({
  ticket,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "open",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ticket) return;

    setFormData({
      title: ticket.title || "",
      description: ticket.description || "",
      priority: ticket.priority || "low",
      status: ticket.status || "open",
    });
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    try {
      setLoading(true);

      const response = await updateTicket(ticket._id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
      });

      toast.success(
        response?.data?.message || "Ticket updated successfully"
      );

      if (onSuccess) {
        onSuccess(
          response?.data?.data?.ticket || response?.data?.ticket
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-5 text-lg font-semibold text-gray-900">
        Edit Ticket
      </h2>

      <div className="space-y-5">
        <InputField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter ticket title"
        />

        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the issue"
          rows={5}
        />

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
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <SecondaryButton
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </SecondaryButton>

          <PrimaryButton
            type="submit"
            loading={loading}
          >
            Update Ticket
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};

export default EditTicketForm;