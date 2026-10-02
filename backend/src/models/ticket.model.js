import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
    {
        ticketNumber: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true
        },
        priority: {
            type: String,
            default: "low",
            enum: ["critical", "high", "medium", "low"],
            required: true
        },
assignedTo : {
     type: mongoose.Schema.Types.ObjectId,
      ref: "User",
       default: null
},

status: {
    type: String,
  enum: ["open", "in_progress", "resolved", "closed"],
    default:"open"
},
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
},
isDeleted: {
  type: Boolean,
  default: false
},
deletedAt: {
  type: Date,
  default: null
},

    },
    { timestamps: true }
    
)

export const Ticket = mongoose.model("Ticket", ticketSchema)












