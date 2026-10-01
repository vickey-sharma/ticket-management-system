
// const api = axios.create({
//   baseURL: "http://localhost:5000/api/v1",
//   withCredentials: true,
// });



// export default api;



import axios from "axios";

const api = axios.create({

   // baseURL: "http://localhost:5000/api/v1",

  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  // Success
  (response) => response,

  // Error
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
//    if (
//     error.response?.status === 401 &&
//     !originalRequest._retry &&
//     !originalRequest.url.includes("/refresh-token")
// )
if (
  error.response?.status === 401 &&
  !originalRequest._retry &&
  !originalRequest.url.includes("/refresh-token") &&
  !originalRequest.url.includes("/current-user")
) {
      originalRequest._retry = true;

      try {
        // Refresh the access token
        await axios.post(
          `${import.meta.env.VITE_API_URL}/users/refresh-token`,
          {},
          {
            withCredentials: true,
          }
        );

        console.log("Token refreshed successfully")
        // Retry the original request
        return api(originalRequest);

      } catch (refreshError) {
        console.error("Refresh token expired. Logging out...");

        localStorage.removeItem("user");

        // window.location.href = "/auth/login-activate";

        if (window.location.pathname !== "/auth/login-activate") {
  window.location.replace("/auth/login-activate");
}

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;