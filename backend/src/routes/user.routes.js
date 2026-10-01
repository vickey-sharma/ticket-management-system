import { Router } from "express";
import { registerUserWithoutOTPVerification, sendOTPController, verifyOTPController, registerClientController, loginUserController, logoutUserController, refreshAccessToken, forgotPassword, changeCurrentPassword, getCurrentUser, updateProfileController, updateUserProfileController, registerInitiallyUserController, verifyAccountAfterRegister, getAllUsers, getUserByRole, getClientUsers, getAdminUsers, getVendorUsers } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const router = Router();

//FOR DEV & TESTING ONLY
router.route("/register-user-without-otp-verification").post(registerUserWithoutOTPVerification);

router.route("/send-otp").post(sendOTPController);
router.route("/verify-otp").post(verifyOTPController);
router.route("/register").post(registerClientController);
router.route("/login").post(loginUserController);
router.route("/forgot-password").post(forgotPassword);


//SECURED ROUTES
router.route("/logout").post(verifyJWT, logoutUserController);
router.route("/refresh-token"). post ( refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-profile").post (verifyJWT, updateProfileController);
router.route("/by-role").get(verifyJWT, getUserByRole);
router.route("/admins").get(verifyJWT, getAdminUsers);
router.route("/clients").get(verifyJWT, getClientUsers);
router.route("/vendors").get(verifyJWT, getVendorUsers);

//RBAC
router.route("/update-user-profile/:email").post(verifyJWT, updateUserProfileController);

// router.route("/deactivate-account/:email").post(verifyJWT, deactivateUserAccountController);
// router.route("/reactivate-account/:email").post(verifyJWT, reactivateUserAccountController);

router.route("/all-users").get(verifyJWT, getAllUsers);

router.route("/register-user").post(verifyJWT, registerInitiallyUserController);
router.route("/verify-account").post(verifyAccountAfterRegister);


export default router;