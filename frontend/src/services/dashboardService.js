import axios from "axios";
import api from "./api";

// const API = "http://localhost:5000/api/v1/users";

// // export const getCurrentUser = async () => {
// //   const token = localStorage.getItem("token");

// //   return axios.get(`${API}/auth/current-user`, {
// //     headers: {
// //       Authorization: `Bearer ${token}`,
// //     },
// //   });
// // };


// export const getCurrentUser = async () => {
//   return axios.get(
//     `${API}/auth/current-user`,
//     {
//       withCredentials: true,
//     }
//   );
// };





export const getCurrentUser = () => {
    return api.get("/users/auth/current-user");
};