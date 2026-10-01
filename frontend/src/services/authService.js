import axios from "axios";
import api from "./api";


export const loginUser = (data) => {
    return api.post("/users/login", data);
};

export const logoutUser = () => {
    return api.post("/users/logout");
};

export const getCurrentUser = () => {
    return api.get("/users/current-user");
};

export const registerUser = (data) => {
    return api.post("/users/register", data);
};

export const sendOTP = (data) => {
    return api.post("/users/send-otp", data);
};

export const verifyOtp = (data) => {
    return api.post("/users/verify-otp", data);
};

export const forgotPassword = (data) => {
    return api.post("/users/forgot-password", data);
};

export const changePassword = (data) => {
    return api.post("/users/change-password", data);
};