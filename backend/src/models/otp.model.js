import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        otp: {
            type: String,
            required: true
        },
        purpose: {
            type: String,
            enum: ["register", "verify", "forgot_password"],
            required: true
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
        },
    },
    { timestamps: true }
)

// auto-delete document after expiresAt
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model("Otp", otpSchema);