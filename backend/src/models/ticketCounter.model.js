import mongoose, { Schema } from "mongoose";

const ticketCounterSchema = new Schema({
    year: {
        type: Number,
        required: true,
        unique: true
    },

    sequence: {
        type: Number,
        default: 0,
    },
});

export const TicketCounter = mongoose.model(
    "TicketCounter",
    ticketCounterSchema
);