import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
    {
receiverId :{
     type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
},
type: {
    type: String,
    required: true,
    enum: [
        // Ticket lifecycle
        "ticket_created",
        "ticket_assigned",
        "ticket_reassigned",
        "ticket_updated",
        "ticket_replied",
        "ticket_resolved",
        "ticket_closed",
        "ticket_reopened",
        "ticket_priority_changed",
        "ticket_status_changed",

        // User management (admin)
        "user_created",
        "user_updated",
        "user_deactivated",

        // Product (admin + client)
        "product_added",
        "product_updated",
        "product_deleted",
        "product_warranty_expiring", // useful reminder for client

        // Upload (admin)
        "product_upload_success",
        "product_upload_failed",
    ],
},
title:{
    type: String,
    required: true,
    trim: true
},
message: {
    type: String,
    required: true,
    trim: true,
},
link: {
    type: String, 
    trim: true,
},
 isRead: {
    type: Boolean,
    default: false,
},
    },
    { timestamps: true }
)

export const Notification = mongoose.model("Notification", notificationSchema);