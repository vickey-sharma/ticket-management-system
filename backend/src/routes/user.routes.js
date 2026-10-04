import { Router } from "express";
import { registerCustomerController, registerUserByAdminController, generateAccessAndRefreshToken, refreshAccessToken, loginUserController, logoutUserController, changeCurrentPassword, getCurrentUser, updateProfileController, getAllAgentUsers, getUsersBySearch, } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();


// Public registration - Customer
router.post(
    "/register",
    registerCustomerController
);


// Admin creates Admin / Agent
router.post(
    "/register/admin",
    verifyJWT,
    registerUserByAdminController
);


// Login
router.post(
    "/login",
    loginUserController
);


// Refresh access token
router.post(
    "/refresh-token",
    refreshAccessToken
);


// Logout
router.post(
    "/logout",
    verifyJWT,
    logoutUserController
);


// Change current user's password
router.patch(
    "/change-password",
    verifyJWT,
    changeCurrentPassword
);


// Get current logged-in user
router.get(
    "/me",
    verifyJWT,
    getCurrentUser
);


// Update current user's profile
router.patch(
    "/profile",
    verifyJWT,
    updateProfileController
);


// Get all users - Admin
// router.get(
//     "/",
//     verifyJWT,
//     getAllUsers
// );


// Search users - Admin
router.get(
    "/search",
    verifyJWT,
    getUsersBySearch
);

// Get agents for assignment dropdown - Admin
router.get(
  "/agents",
  verifyJWT,
  getAllAgentUsers
);

export default router;