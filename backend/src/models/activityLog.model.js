import mongoose, { Schema } from "mongoose";

const activityLogSchema = new Schema(
    {
userId: {
    type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
},
 action: {
    type: String,
    required: true,
    enum: [
        "create_user",
        "update_user",
        "create_product",
        "update_product",
        "delete_product",
        "upload_products",
        "create_ticket",
        "assign_ticket",
        "update_ticket",
        "close_ticket",
        "login",
        "reset_password"
    ]
},
entityType: {
    type: String,
    required: true,
    enum: [
        "user",
        "product",
        "ticket",
        "product_upload"
    ]
},
entityId: {
    type: mongoose.Schema.Types.ObjectId,
        required: true
},
description: {
    type: String,
    required: true
}

    },
    { timestamps: true }
)

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);