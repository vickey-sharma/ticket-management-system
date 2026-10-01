import { useState, useEffect } from "react";
import AuthCard from "../../components/auth/AuthCard.jsx";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import InputField from "../../components/ui/InputField.jsx";
import PrimaryButton from "../../components/ui/PrimaryButton.jsx";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../services/authService";
import { registerUser, } from "../../services/authService";
import toast from "react-hot-toast";


export default function VerifyOTPPage() {

    const location = useLocation();
const navigate = useNavigate();

const email =
  location.state?.email ||
  localStorage.getItem("email");

const purpose =
  location.state?.purpose ||
  localStorage.getItem("purpose");

  const storedUser = localStorage.getItem("filteredUserDetails");

  const filteredUserDetails = location.state?.filteredUserDetails ||  (storedUser ? JSON.parse(storedUser) : null);

    // console.log("email: ", email);
    // console.log("purpose: ", purpose);
    // console.log("filtered User Details: ", filteredUserDetails);


useEffect(() => {
  
  if(!purpose){
toast.error("Missing user purpose")
  }

  if(purpose === "register"){
if (!email || !purpose) {
    toast.error("Missing user data")
    navigate("/auth/register");
  }
  }

   if(purpose === "verify"){
if (!email || !purpose) {
    toast.error("Missing user data")
    navigate("/auth/register");
  }
  }

  if(purpose === "forgot_password"){
if (!email || !purpose) {
    toast.error("Missing user data")
    navigate("/auth/forgot-password");
  }
  }

}, [email, purpose, filteredUserDetails, navigate]);



  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async (e)=> {
    e.preventDefault();


  if (!otp || otp.trim() === ""){
     toast.error("OTP required");
    return;
  }


  try {
    // console.log("purpose: ", purpose);
    const response = await verifyOtp({
        email,
        otp,
        purpose
    });

//     console.log("FULL RESPONSE:", response);
// console.log("RESPONSE DATA:", response.data);

    if(response.data.success && purpose === "register"){

const registerResponse = await registerUser(filteredUserDetails);

  console.log("REGISTER RESPONSE:", registerResponse.data);

  if (registerResponse.data.success) {
    // localStorage.removeItem("email");
    // localStorage.removeItem("purpose");
    // localStorage.removeItem("userDetails");

    // alert("Account created successfully");

    // navigate("/auth/login-activate");
    navigate("/auth/update-password", {
  state: { email,
    purpose
   }
    })
  }

    }

    if(response.data.success && purpose === "verify"){

  toast.success("Account verified successfully, Enter password");

    navigate("/auth/update-password", {
  state: { email,
    purpose
   }
    })

    }

    if(response.data.success && purpose === "forgot_password"){
  toast.success("Account verified successfully, enter new password");

    navigate("/auth/update-password", {
  state: { email }
});
    }

  } catch (error) {
     console.log(error);
    toast.error("Invalid OTP");
  }
  }

  return (
    <AuthLayout>
      <AuthCard className="animate-authReveal py-8">

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">Verify OTP</h1>

  {/* Full Name */}
        <InputField
          label="Verify OTP"
         value={otp}
onChange={(e) => setOtp(e.target.value)}
/>

     

{/* <p className="text-sm text-gray-600 mt-2">
  We'll send a <span className="font-semibold text-gray-800">verification OTP</span> to your email for account activation.
</p> */}

<div className="flex items-center justify-between w-full mb-2">

    <p className="text-sm text-gray-700 ">
  Didn’t receive <span className="font-semibold text-[#56BD05]"> OTP?</span> Resend it.
</p>

                        <p className="text-right text-sm">
  <Link to="/forgot-password" className="text-blue-500 hover:underline">
    Resend OTP
  </Link>
</p>
</div>


        {/* Button */}
       <PrimaryButton text="Verify OTP" onClick={handleVerifyOTP} className="mt-4"/>

        {/* Login link */}
        <p className="text-sm mt-4 text-gray-600">
          Already have an account?{" "}
         <Link to="/auth/login-activate" className="text-blue-500 hover:underline">
  Log in
</Link>
        </p>

      </AuthCard>
    </AuthLayout>
  );
}