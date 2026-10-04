import api from "./api.js";

export const createTicket = (ticketData) => {
  return api.post("/tickets", ticketData);
};

export const getAdminTickets = (params = {}) => {
  return api.get("/tickets/admin", {
    params,
  });
};

export const getCustomerTickets = (params = {}) => {
  return api.get("/tickets/customer", {
    params,
  });
};

export const getAgentTickets = (params = {}) => {
  return api.get("/tickets/agent", {
    params,
  });
};

export const assignTicket = (ticketId, assignedToId) => {
  return api.patch(`/tickets/${ticketId}/assign`, {
    assignedToId,
  });
};

export const updateTicket = (ticketId, ticketData) => {
  return api.patch(`/tickets/${ticketId}`, ticketData);
};

export const deleteTicket = (ticketId) => {
  return api.delete(`/tickets/${ticketId}`);
};

export const getTicketById = (ticketId) => {
  return api.get(`/tickets/${ticketId}`);
};