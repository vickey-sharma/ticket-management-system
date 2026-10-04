import { useNavigate } from "react-router-dom";

import CreateTicketForm from "../../../components/ticket-management/CreateTicketForm";

const CustomerCreateTicketPage = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/dashboard/tickets/customer");
  };

  const handleCancel = () => {
    navigate("/dashboard/tickets/customer");
  };

  return (
    <CreateTicketForm
      role="customer"
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default CustomerCreateTicketPage;