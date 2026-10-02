import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Ticket } from "../models/ticket.model.js";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";


const addCommentController = asyncHandler(async(req, res)=>{

    
    const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };
    
    if(!["admin", "agent", "customer"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };

            const { ticketId } = req.params;
    
    const filteredTicketId = ticketId?.trim();
    
    if(!filteredTicketId){
        throw new ApiError(400, "TicketId is required")
    };
    
    if (!mongoose.Types.ObjectId.isValid(filteredTicketId)) {
        throw new ApiError(400, "Invalid TicketId");
    }

    let isTicketIdValid;

    if(currentUserRole === "admin"){
            isTicketIdValid = await Ticket.findOne({
                _id: filteredTicketId,
                isDeleted: false
            });
    }else if(currentUserRole === "agent"){
            isTicketIdValid = await Ticket.findOne({
                _id: filteredTicketId,
                assignedTo: currentUser._id,
                isDeleted: false
            });
    }else if(currentUserRole === "customer"){
             isTicketIdValid = await Ticket.findOne({
                _id: filteredTicketId,
                createdBy: currentUser._id,
                isDeleted: false
            });
    };

    if(!isTicketIdValid){
   throw new ApiError(404, "Ticket not found");
};


 const { comment } = req.body;
 const filteredComment = comment?.trim();

 if(!filteredComment){
    throw new ApiError(400, "Comment is required")
 }

 const newComment = await Comment.create({
    ticketId: isTicketIdValid._id,
    userId: currentUser._id,
    comment: filteredComment
 });

 return res
 .status(201)
     .json(new ApiResponse(201, { ticket: isTicketIdValid,
        comment: newComment
      }, "Comment added successfully"))

});

const getCommentsController = asyncHandler(async(req, res)=>{

    const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Unauthorized")
    };

    const currentUserRole = currentUser.role;
         if(!currentUserRole){
            throw new ApiError(400, "Error while fetching user role")
         };
    
    if(!["admin", "agent", "customer"].includes(currentUserRole)){
        throw new ApiError(403, "Unauthorized access")
    };

            const { ticketId } = req.params;
    
    const filteredTicketId = ticketId?.trim();
    
    if(!filteredTicketId){
        throw new ApiError(400, "TicketId is required")
    };
    
    if (!mongoose.Types.ObjectId.isValid(filteredTicketId)) {
        throw new ApiError(400, "Invalid TicketId");
    }

    let isTicketIdValid;

    if(currentUserRole === "admin"){
            isTicketIdValid = await Ticket.findOne({
                _id: filteredTicketId,
                isDeleted: false
            });
    }else if(currentUserRole === "agent"){
            isTicketIdValid = await Ticket.findOne({
                _id: filteredTicketId,
                assignedTo: currentUser._id,
                isDeleted: false
            });
    }else if(currentUserRole === "customer"){
             isTicketIdValid = await Ticket.findOne({
                _id: filteredTicketId,
                createdBy: currentUser._id,
                isDeleted: false
            });
    };

    if(!isTicketIdValid){
   throw new ApiError(404, "Ticket not found");
};

const allComments = await Comment.find({
    ticketId: isTicketIdValid._id
})
.populate("userId", "fullName email role")
.sort({ createdAt: 1 });

return res
.status(200)
 .json(new ApiResponse(200, { ticket: isTicketIdValid,
        comments: allComments
      }, "Comments fetched successfully"))
});

export{

    addCommentController,
    getCommentsController
}