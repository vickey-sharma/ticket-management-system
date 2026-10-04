import api from "./api.js";

export const registerCustomer = (userData) => {
  return api.post("/users/register", userData);
};

export const registerUserByAdmin = (userData) => {
  return api.post("/users/register/admin", userData);
};

export const loginUser = (credentials) => {
  return api.post("/users/login", credentials);
};

export const refreshAccessToken = () => {
  return api.post("/users/refresh-token");
};

export const logoutUser = () => {
  return api.post("/users/logout");
};

export const changeCurrentPassword = (passwordData) => {
  return api.patch("/users/change-password", passwordData);
};

export const getCurrentUser = () => {
  return api.get("/users/me");
};

export const updateProfile = (profileData) => {
  return api.patch("/users/profile", profileData);
};

// export const getAllUsers = (params = {}) => {
//   return api.get("/users", {
//     params,
//   });
// };

export const getUsersBySearch = (params = {}) => {
  return api.get("/users/search", {
    params,
  });
};

export const getAllAgentUsers = (params = {}) => {
  return api.get("/users/agents", {
    params,
  });
};