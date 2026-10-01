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
        issueTitle: {
            type: String,
            required: true,
            trim: true,
        },
        issueDescription: {
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
},

ticketStatus: {
    type: String,
  enum: ["open", "in_progress", "resolved", "closed"],
    default:"open"
},
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
},
updatedBy: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
],
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

















// replyMessage: [ 
//   {
//     category: {
//         type: String,
//        enum: ["work_in_progress", "issue_resolved"],
//         required: true
//     },
//      message: {
//     type: String,
//     required: true,
//     trim: true
// },
//     repliedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     createdAt: {
//     type: Date,
//     default: Date.now
// }
//   }
// ],