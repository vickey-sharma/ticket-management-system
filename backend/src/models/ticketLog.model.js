import mongoose, { Schema } from "mongoose";

const ticketLogSchema = new Schema(
    {
ticketId: {
     type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true
},
action: {
    type: String,
    required: true,
    enum: [
  "created",
  "assigned",
  "reassigned",
  "priority_changed",
  "status_changed",
  "replied",
  "resolved",
  "closed",
  "reopened"
]
},
oldValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
},
newValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
},
performedBy: {
     type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
},
remarks: {
    type: String,
}

    },
{ timestamps: true }
)

export const TicketLog = mongoose.model("TicketLog", ticketLogSchema)