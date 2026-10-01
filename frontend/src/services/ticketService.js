import api from "./api";

export const createTicketByAdmin = (data) => {
    return api.post("/tickets/admin/create-ticket", data);
};

export const createTicketByClient = (data) => {
    return api.post("/tickets/client/create-ticket", data);
};

export const getAllClientForTicket = (data)=> {
    return api.get("/tickets/clients", data)
};

export const getRegisteredProductsByCompanyName = (companyName, data)=> {
return api.get(`/tickets/companies/${companyName}/registered-products`, data)
};

export const getClientsByCompanyName = (companyName, data)=>{
    return api.get(`/tickets/companies/${companyName}/clients`, data)
};

export const getAssignableUsersForTicket = ()=>{
    return api.get(`/tickets/assignable-users`)
};

export const getAllCompaniesFromRegisteredProducts = (data)=> {
    return api.get("/tickets/companies")
};

export const getClientById = (clientId, data)=> {
    return api.get(`/tickets/clients/${clientId}`, data)
};

export const getAllTicketsByAdmin = (data = {}) => {
    return api.get("/tickets/admin/all-tickets", {
        params: data,
    });
};

export const getAllTicketsByClient = (data) => {
    return api.get("/tickets/client/all-tickets", data);
};