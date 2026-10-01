import AuthCard from "../../components/auth/AuthCard.jsx";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import InputField from "../../components/ui/InputField.jsx";
import PrimaryButton from "../../components/ui/PrimaryButton.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { sendOTP } from "../../services/authService.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const [formEmail, setFormEmail] = useState("");

  const navigate = useNavigate();
  
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    const filteredEmail = formEmail?.trim().toLowerCase();

      
              const response = await sendOTP({
                email: filteredEmail,
                purpose: "forgot_password"
              }
              );
        
              // store backup
       localStorage.setItem("email", JSON.stringify(filteredEmail));
        localStorage.setItem("purpose", "forgot_password");
        
             navigate("/auth/verify-otp", {
           state: {
              email: filteredEmail,
               purpose: "forgot_password",
           }
        });
        

         toast.success("OTP sent successfully!");
    } catch (err) {
      console.log(err);
      
      // alert(err.response?.data?.message || "Something went wrong");
      toast.error(err.response?.data?.message || "Something went wrong");

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard className="animate-authReveal py-8">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        {/* SUBTITLE */}
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your registered email to receive a password reset OTP
        </p>

        {/* FORM */}
        <form className="space-y-2" onSubmit={handleSendOtp}>
          <InputField
            label="Email"
            type="email"
            value={formEmail}
            placeholder="Enter your email"
            onChange={(e) =>
              setFormEmail(e.target.value)
            }
          />

          <PrimaryButton text="Send Reset OTP" type="submit" loading={loading} className="mt-4" />

          {/* BACK TO LOGIN */}
          <p className="text-sm mt-4 text-gray-600 text-center">
            Remember your password?{" "}
            <Link to="/auth/login-activate" className="text-blue-500 hover:underline">
              Back to Login
            </Link>
          </p>
        </form>

      </AuthCard>
    </AuthLayout>
  );
}