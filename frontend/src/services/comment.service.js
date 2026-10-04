import api from "./api";

export const addComment = async (ticketId, comment) => {
    const response = await api.post(
        `/tickets/${ticketId}/comments`,
        { comment }
    );

    return response.data;
};

export const getComments = async (ticketId) => {
    const response = await api.get(
        `/tickets/${ticketId}/comments`
    );

    return response.data;
};