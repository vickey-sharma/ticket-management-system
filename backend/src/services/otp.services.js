
import crypto from "crypto";
import { Otp } from "../models/otp.model.js";
import { ApiError } from "../utils/ApiError.js";
import { sendOTPEmail } from "../utils/sendOTPEmail.js";

const sendOTP = async (email, purpose) => {

    if (!email || !purpose) {
        throw new ApiError(
            400,
            "Email and purpose are required"
        );
    }

    if (!["register", "verify", "forgot_password"].includes(purpose)) {
        throw new ApiError(
            400,
            "Invalid purpose"
        );
    }

    // Delete old OTPs for same email & purpose
    await Otp.deleteMany({
        email,
        purpose
    });


    // FOR TESTING ONLY
    // const otp = "123456";

    // FOR DEVELOPMENT
    // const otp = crypto.randomInt(
    //     100000,
    //     999999
    // ).toString();

    const otp = crypto.randomInt(100000, 1000000).toString();

    console.log("purpose just before creating otp in db at otp services: ", purpose);

    await Otp.create({
        email,
        otp,
        purpose
    });

    await sendOTPEmail(
        email,
        otp,
        purpose
    );

    return {
        success: true,
        message: "OTP sent successfully"
    };
};



const verifyOTP = async (
    email,
    otp,
    purpose
) => {

    if (!email || !otp || !purpose) {
        throw new ApiError(
            400,
            "Email, OTP and purpose are required"
        );
    }

    const otpRecord = await Otp.findOne({
        email,
        purpose
    });

    if (!otpRecord) {
        throw new ApiError(
            400,
            "OTP expired or not requested, please request a new one"
        );
    }

    if (otpRecord.isVerified) {
        throw new ApiError(
            400,
            "OTP already used, please request a new one"
        );
    }

    if (otpRecord.otp !== otp) {
        throw new ApiError(
            400,
            "Invalid OTP"
        );
    }

    otpRecord.isVerified = true;

    await otpRecord.save();

    return {
        success: true,
        message: "OTP verified successfully"
    };
};

export {
    sendOTP,
    verifyOTP
};

