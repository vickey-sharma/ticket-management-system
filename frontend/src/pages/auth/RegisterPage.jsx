import { useState, useRef } from "react";
import AuthCard from "../../components/auth/AuthCard.jsx";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import InputField from "../../components/ui/InputField.jsx";
import PrimaryButton from "../../components/ui/PrimaryButton.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { sendOTP } from "../../services/authService";
import toast from "react-hot-toast";
import { Turnstile } from "@marsidev/react-turnstile";


export default function RegisterPage() {
  const [form, setForm] = useState({
   fullName: "",
  email: "",
  phoneNumber: "",
  // password: "",
  companyName: ""
  });

  // console.log("key is :", import.meta.env.VITE_TURNSTILE_SITE_KEY)

const [turnstileToken, setTurnstileToken] = useState("");
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const turnstileRef = useRef(null);

  const handleRegister = async (e)=> {
    e.preventDefault();

    // password
    const { fullName, email, phoneNumber,  companyName } = form;

    //  if(!fullName || !email || !phoneNumber || !password || !companyName){
    if(!fullName || !email || !phoneNumber || !companyName){
       toast.error("All fields are required");
    return;
    }

    // || password.trim() === "" 
     if(fullName.trim() === "" || email.trim() === "" || phoneNumber.trim() === "" || companyName.trim() === ""){
       toast.error("All fields are required");
    return;
    }


    if (!/^\d{10}$/.test(phoneNumber.trim())) {
  toast.error("Invalid Number");
  return;
}

const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

if (!emailRegex.test(email.trim())) {
    toast.error("Invalid Email");
    return;
}

 if (!turnstileToken) {
        toast.error("Please verify that you are human.");
        return;
    }

    try {
setLoading(true);

      const filteredUserDetails = {
  fullName: fullName.trim(),
  email: email.trim().toLowerCase(),
  phoneNumber: phoneNumber.trim(),
  // password: password.trim(),
  companyName: companyName.trim(),
};


await sendOTP({
        email: filteredUserDetails.email,
        purpose: "register",
         turnstileToken
      }
      );

      turnstileRef.current?.reset();
setTurnstileToken("");


      // store backup
localStorage.setItem("email", filteredUserDetails.email);
localStorage.setItem("purpose", "register");
localStorage.setItem("filteredUserDetails", JSON.stringify(filteredUserDetails));

     navigate("/auth/verify-otp", {
   state: {
      email: filteredUserDetails.email,
       purpose: "register",
      filteredUserDetails
   }
});

    }catch (error) {

    console.log("REGISTER ERROR:", error.response?.data);

    turnstileRef.current?.reset();
    setTurnstileToken("");

    toast.error(
        error.response?.data?.message || "Something went wrong."
    );
}finally {
    setLoading(false);
}
  }

  return (
    <AuthLayout>
      <AuthCard className="animate-authReveal py-4">

        {/* Title */}
         <h1 className="text-3xl font-bold text-center mb-4">
                  Sign Up
                </h1>

  {/* Full Name */}
        <InputField
          label="Full Name"
          value={form.fullName}
                      placeholder="Enter Full Name"

          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
/>

        {/* Email */}
        <InputField
          label="Email address"
          value={form.email}
                      placeholder="Enter Email"

          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />


        {/* Phone Number */}
      <InputField
          label="Phone Number"
          type="tel"
          value={form.phoneNumber}
                      placeholder="Enter Phone Number"

         onChange={(e) =>
  setForm({
    ...form,
    phoneNumber: e.target.value.replace(/\D/g, "").slice(0, 10),
  })
}
        />

{/* Company Name */}
<InputField
  label="Company Name"
  value={form.companyName}
  placeholder="Enter Company Name"
  onChange={(e) =>
    setForm({
      ...form,
      companyName: e.target.value,
    })
  }
/>


        {/* Password */}
        {/* <InputField
          label="Password"
          type="password"
          value={form.password}
                      placeholder="Enter Password"
onChange={(e) =>
  setForm({ ...form, password: e.target.value })
}
        /> */}


{/* <p className="text-sm text-gray-600 mt-2">
  We'll send a <span className="font-semibold text-gray-800">verification OTP</span> to your email for account activation.
</p> */}

<p className="text-sm text-gray-700 mt-2">
  A <span className="font-semibold text-[#56BD05]">6-digit OTP</span> will be sent to your email.
</p>


{/* Turnstile */}
<Turnstile
    siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
      ref={turnstileRef}
    className="mt-3"
      options={{
    theme: "light",
     size: "flexible",
  }}
    onSuccess={(token) => {
        setTurnstileToken(token);
    }}
    onExpire={() => {
        setTurnstileToken("");
    }}
    onError={() => {
        setTurnstileToken("");
        toast.error("Human verification failed. Please try again.");
    }}
/>

        {/* Button */}
       <PrimaryButton text={loading ? "Sending OTP..." : "Create account & send OTP"} onClick={handleRegister} disabled={loading} className="mt-4"/>

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