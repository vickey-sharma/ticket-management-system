// purpose of this file:
// keeps email HTML content separate from sending logic
// if you want to change email design later, only touch this file

const otpEmailTemplate = (otp, purpose) => {

    const heading = purpose === "register"
        ? "Verify Your Email"
        : "Reset Your Password"


    const message = purpose === "register"
        ? "You recently registered on Helpdesk CRM. Use the OTP below to verify your email."
        : "You requested to reset your password. Use the OTP below to proceed."

    return `
        <h2>${heading}</h2>
        <p>${message}</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
    `
}

export { otpEmailTemplate }