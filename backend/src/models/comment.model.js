import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: "Ticket",
            required: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

         comment: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Efficiently fetch comments for a ticket in chronological order
commentSchema.index({ ticketId: 1, createdAt: 1 });

export const Comment = mongoose.model("Comment", commentSchema);