import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addCommentController, getCommentsController } from "../controllers/comment.controller.js";


const router = Router();

router
    .route("/:ticketId/comments")
    .post(verifyJWT, addCommentController)
    .get(verifyJWT, getCommentsController);

export default router;
