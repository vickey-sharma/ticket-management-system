
import { useState } from "react";
import { Loader2, Send, Ticket } from "lucide-react";
import toast from "react-hot-toast";

import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import SearchableDropdown from "../ui/SearchableDropdown";
import FilterDropdown from "../ui/FilterDropdown";

import { createTicket } from "../../services/ticketService";

const CreateTicketForm = ({
  role,
  agents = [],
  onAgentSearch,
  loadingAgents = false,
  onSuccess,
  onCancel,
}) => {
  const isAdmin = role === "admin";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "low",
    assignedToId: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a ticket title");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a ticket description");
      return;
    }

    try {
      setLoading(true);

      const ticketData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
      };

      if (isAdmin && formData.assignedToId) {
        ticketData.assignedToId = formData.assignedToId;
      }

      console.log("========== TICKET DATA SENT ==========");
      console.log(ticketData);

      const response = await createTicket(ticketData);

      console.log("========== COMPLETE CREATE TICKET RESPONSE ==========");
      console.log(response);

      console.log("========== COMPLETE CREATED TICKET ==========");
      console.log(response.data);

      console.log(
        "========== TICKET OBJECT ==========",
        JSON.stringify(response.data?.data, null, 2)
      );

      toast.success("Ticket created successfully");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("========== CREATE TICKET ERROR ==========");
      console.error(error);
      console.error(error.response?.data);

      toast.error(
        error.response?.data?.message ||
          "Failed to create ticket"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F4F1] text-[#0F766E]">
          <Ticket size={21} />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#073B3A]">
            Create Ticket
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {isAdmin
              ? "Create a support ticket and optionally assign it to an agent."
              : "Submit a new support request to the helpdesk."}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-6">
          {/* Ticket Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Ticket Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              maxLength={200}
              placeholder="Enter ticket title"
              className="
                w-full rounded-xl border border-gray-200
                bg-white px-4 py-3
                text-sm text-gray-800
                outline-none transition
                placeholder:text-gray-400
                focus:border-[#0F766E]
                focus:ring-2 focus:ring-[#0F766E]/10
              "
            />

            <div className="mt-1 text-right text-xs text-gray-400">
              {formData.title.length}/200
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={7}
              placeholder="Describe the issue in detail..."
              className="
                w-full resize-none rounded-xl
                border border-gray-200 bg-white
                px-4 py-3 text-sm text-gray-800
                outline-none transition
                placeholder:text-gray-400
                focus:border-[#0F766E]
                focus:ring-2 focus:ring-[#0F766E]/10
              "
            />
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="priority"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Priority
            </label>

            <FilterDropdown
              value={formData.priority}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: value,
                }))
              }
              placeholder="Select Priority"
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "critical", label: "Critical" },
              ]}
            />
          </div>

          {/* Admin-only Agent Assignment */}
          {isAdmin && (
            <SearchableDropdown
              label="Assign Agent"
              value={formData.assignedToId}
              options={agents}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  assignedToId: value,
                }))
              }
              onSearch={onAgentSearch}
              placeholder="Unassigned"
            />
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
          <SecondaryButton
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </SecondaryButton>

          <PrimaryButton
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Creating...
              </>
            ) : (
              <>
                <Send size={17} />
                Create Ticket
              </>
            )}
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketForm;
