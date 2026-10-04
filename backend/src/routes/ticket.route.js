import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { createTicketController, getAllTicketsByAdminController, getAllTicketsByCustomerController,    getAllTicketsByAgentController, getSingleTicketById, assignTicketController, updateTicketController, deleteTicketController } from "../controllers/ticket.controller.js";


const router = Router();


// Create ticket
router.post(
    "/",
    verifyJWT,
    createTicketController
);


// Get all tickets - Admin
router.get(
    "/admin",
    verifyJWT,
    getAllTicketsByAdminController
);


// Get customer's own tickets
router.get(
    "/customer",
    verifyJWT,
    getAllTicketsByCustomerController
);


// Get agent's assigned tickets
router.get(
    "/agent",
    verifyJWT,
    getAllTicketsByAgentController
);

// Get single ticket by ID

router.get(
    "/:ticketId",
    verifyJWT,
    getSingleTicketById
);

// Assign / reassign ticket - Admin only
router.patch(
    "/:ticketId/assign",
    verifyJWT,
    assignTicketController
);


// Update ticket
router.patch(
    "/:ticketId",
    verifyJWT,
    updateTicketController
);


// Delete ticket - Admin only
router.delete(
    "/:ticketId",
    verifyJWT,
    deleteTicketController
);



export default router;
