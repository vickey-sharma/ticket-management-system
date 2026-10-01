import AuthCard from "../../components/auth/AuthCard.jsx";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import InputField from "../../components/ui/InputField.jsx";
import PrimaryButton from "../../components/ui/PrimaryButton.jsx";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { forgotPassword } from "../../services/authService.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyAccountAfterRegister } from "../../services/userService.js";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";



export default function UpdatePasswordPage() {
  const [loading, setLoading] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const location = useLocation();
const navigate = useNavigate();

  const email =
    location.state?.email ||
    localStorage.getItem("email");

    const purpose = location.state?.purpose || localStorage.getItem("purpose");

  const [resetData, setResetData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!resetData.newPassword || !resetData.confirmNewPassword) {
      return toast.error("All fields are required");
    }

    if (resetData.newPassword !== resetData.confirmNewPassword) {
      return toast.error("Passwords do not match");
    }

  
         console.log(email);

         console.log(purpose);

        //  if(purpose === "register"){

        //  }

         setLoading(true);

try {
  
          if(purpose === "verify" || purpose === "register"){
            await verifyAccountAfterRegister({
              email: email,
              password: resetData.newPassword,
              confirmPassword: resetData.confirmNewPassword,
              purpose: purpose,
            });
  
            localStorage.removeItem("userDetails");
   localStorage.removeItem("email");
       localStorage.removeItem("purpose");
  
     toast.success("Account registered successfully");
          
          } 
          
          if(!purpose || purpose === "forgot_password"){
  
                await forgotPassword({
              email: email,
              newPassword: resetData.newPassword,
              confirmNewPassword: resetData.confirmNewPassword,
              purpose
          });
  
           toast.success("Password updated successfully!");
          }
  
  
        // call your resetPassword service here
  
       
        localStorage.removeItem("email");
        localStorage.removeItem("purpose");
   
        
  navigate("/auth/login-activate");
  
} catch (error) {
   console.log(error);
        toast.error(error.response?.data?.message || "Something went wrong");
}finally {
        setLoading(false);
      }
  };

  return (
    <AuthLayout>
      <AuthCard className="animate-authReveal py-8">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Update Password
        </h1>

        {/* SUBTITLE */}
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your new password for {email}
        </p>

        {/* FORM */}
        <form className="space-y-2" onSubmit={handleUpdatePassword}>

       <InputField
  label="New Password"
  type={showNewPassword ? "text" : "password"}
  value={resetData.newPassword}
  placeholder="Enter new password"
  onChange={(e) =>
    setResetData({
      ...resetData,
      newPassword: e.target.value,
    })
  }
  rightElement={
    <button
      type="button"
      onClick={() => setShowNewPassword((prev) => !prev)}
      className="text-gray-500 hover:text-gray-700"
    >
      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  }
/>

          <InputField
  label="Confirm New Password"
  type={showConfirmNewPassword ? "text" : "password"}
  value={resetData.confirmNewPassword}
  placeholder="Confirm new password"
  onChange={(e) =>
    setResetData({
      ...resetData,
      confirmNewPassword: e.target.value,
    })
  }
  rightElement={
    <button
      type="button"
      onClick={() => setShowConfirmNewPassword((prev) => !prev)}
      className="text-gray-500 hover:text-gray-700"
    >
      {showConfirmNewPassword ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>
  }
/>

          <PrimaryButton
            text="Reset Password"
            type="submit"
            loading={loading}
            className="mt-4"
          />

          {/* BACK TO LOGIN */}
          <p className="text-sm mt-4 text-gray-600 text-center">
            Remember your password?{" "}
            <Link
              to="/auth/login-activate"
              className="text-blue-500 hover:underline"
            >
              Back to Login
            </Link>
          </p>

        </form>

      </AuthCard>
    </AuthLayout>
  );
}