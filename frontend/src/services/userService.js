import axios from "axios";
// import { data } from "react-router-dom";
import api from "./api";


export const getUsers = () => {
    return api.get("/users/all-users");
};

export const getUserDetailsAndUpdate = (email, data) => {
    return api.post(`/users/update-user-profile/${email}`, data);
};

export const getOwnProfileDetails = () => {
    return api.get("/users/current-user");
};

export const updateOwnProfileDetails = (data) => {
    return api.post("/users/update-profile", data);
};

export const registerUserInitially = (data) => {
    return api.post("/users/register-user", data);
};

export const verifyAccountAfterRegister = (data) => {
    return api.post("/users/verify-account", data);
};

export const getUserByRole = (role, search = "") => {
  return api.get("/users/by-role", {
    params: {
      role,
      search,
    },
  });
};

export const getAdminUsers = (data)=> {
    return api.get("/users/admins", data)
};

export const getClientUsers = (data)=> {
    return api.get("/users/clients", data)
};

export const getVendorUsers = (data)=>{
    return api.get("/users/vendors", data)
};









// const API = "http://localhost:5000/api/v1/users";

// //GET ALL USERS
// export const getUsers = ()=> {
//     return axios.get(
//         `${API}/all-users`,
//         {
//            withCredentials: true,
//         }
//     )
// }

// //UPDATE ONE USER
// export const getUserDetailsAndUpdate = (email, data)=> {
//     return axios.post(
//          `${API}/update-user-profile/${email}`, data,
//         {
//            withCredentials: true,
//         }
//     )
// }

// //GET OWN PROFILE
// export const getOwnProfileDetails = (data)=> {
//    return axios.post(
//     `${API}/current-user`,
//     data,
//      {
//            withCredentials: true,
//         }
//   )
// }
// export const updateOwnProfileDetails = (data)=> {
//   return axios.post(
//     `${API}/update-profile`,
//     data,
//      {
//            withCredentials: true,
//         }
//   )
// }

// // userService.js

// export const registerUserInitially = (data) => {
//   return axios.post(
//     `${API}/register-user`,
//     data,
//     {
//       withCredentials: true,
//     }
//   );
// };


// export const verifyAccountAfterRegister = (data)=> {
//   return axios.post(
//     `${API}/verify-account`,
//     data,
//     {
//       withCredentials: true,
//     }
//   )
// }