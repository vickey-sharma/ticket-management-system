import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getAllClientForTicketController, getClientByIdController, getClientsByCompanyName, getAssignableUsersForTicket, getRegisteredProductsByCompanyNameController, createTicketByAdminController, createTicketByClientController, getAllCompaniesFromRegisteredProducts, getAllTicketsByAdminController, getAllTicketsByClientController, } from "../controllers/ticket.controller.js";


const router = Router();

router.route("/clients").get(verifyJWT, getAllClientForTicketController);
router.route("/clients/:clientId").get(verifyJWT, getClientByIdController);
router.route("/companies/:companyName/registered-products").get(verifyJWT, getRegisteredProductsByCompanyNameController);
router.route("/companies/:companyName/clients").get(verifyJWT, getClientsByCompanyName);
router.route("/companies").get(verifyJWT, getAllCompaniesFromRegisteredProducts);
router.route("/assignable-users").get(verifyJWT, getAssignableUsersForTicket);

router.route("/admin/create-ticket").post(verifyJWT, createTicketByAdminController);
router.route("/client/create-ticket").post(verifyJWT, createTicketByClientController);

router.route("/admin/all-tickets").get(verifyJWT, getAllTicketsByAdminController);
router.route("/client/all-tickets").get(verifyJWT, getAllTicketsByClientController);

export default router;
