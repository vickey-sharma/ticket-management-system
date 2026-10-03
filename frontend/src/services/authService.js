import api from "./api.js";


// ==============================
// Customer Registration
// ==============================

export const registerCustomer = (userData) => {
  return api.post("/users/register", userData);
};


// ==============================
// Admin Creates Admin / Agent
// ==============================

export const registerUserByAdmin = (userData) => {
  return api.post("/users/register/admin", userData);
};


// ==============================
// Login
// ==============================

export const loginUser = (credentials) => {
  return api.post("/users/login", credentials);
};


// ==============================
// Refresh Access Token
// ==============================

export const refreshAccessToken = () => {
  return api.post("/users/refresh-token");
};


// ==============================
// Logout
// ==============================

export const logoutUser = () => {
  return api.post("/users/logout");
};


// ==============================
// Change Current Password
// ==============================

export const changeCurrentPassword = (passwordData) => {
  return api.patch("/users/change-password", passwordData);
};


// ==============================
// Get Current User
// ==============================

export const getCurrentUser = () => {
  return api.get("/users/me");
};


// ==============================
// Update Current User Profile
// ==============================

export const updateProfile = (profileData) => {
  return api.patch("/users/profile", profileData);
};


// ==============================
// Get All Users
// ==============================

export const getAllUsers = (params = {}) => {
  return api.get("/users", {
    params,
  });
};


// ==============================
// Search Users
// ==============================

export const getUsersBySearch = (params = {}) => {
  return api.get("/users/search", {
    params,
  });
};