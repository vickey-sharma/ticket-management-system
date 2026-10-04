
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CreateTicketForm from "../../../components/ticket-management/CreateTicketForm";
import { getAllAgentUsers } from "../../../services/authService";

const AdminCreateTicketPage = () => {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [loadingAgents, setLoadingAgents] = useState(false);

  const fetchAgents = async (search = "") => {
    try {
      setLoadingAgents(true);

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await getAllAgentUsers(params);

      const responseData = response.data?.data;

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
        error.response?.data?.message ||
          "Failed to load agents"
      );
    } finally {
      setLoadingAgents(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSuccess = () => {
    navigate("/dashboard/tickets/admin");
  };

  const handleCancel = () => {
    navigate("/dashboard/tickets/admin");
  };

  return (
    <CreateTicketForm
      role="admin"
      agents={agents}
      onAgentSearch={fetchAgents}
      loadingAgents={loadingAgents}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default AdminCreateTicketPage;
