import { Resend } from "resend"
import { otpEmailTemplate } from "./emailTemplates/otpEmailTemplate.js"

// initialize Resend once with API key
// reused for every email — no new connection needed each time


const sendOTPEmail = async (sendToEmail, otp, purpose) => {


    const resend = new Resend(process.env.RESEND_API_KEY)
// const e = "onboarding@resend.dev"

    const subject = purpose === "register"
        ? "Email Verification - Helpdesk CRM"
        : "Password Reset - Helpdesk CRM"

    const { data, error } = await resend.emails.send({
        from: process.env.RESEND_EMAIL_FROM,       // sender — from your .env
        to: sendToEmail,                        // receiver — user's email
        subject: subject,                   // email subject line
        html: otpEmailTemplate(otp, purpose) // email body from template
    })

    // if resend returns an error, throw it so controller catches it
    if (error) {
        throw new Error(`Email sending failed: ${error.message}`)
    }
}

export { sendOTPEmail }