import AuthCard from "../../components/auth/AuthCard.jsx";
import AuthLayout from "../../layouts/AuthLayout.jsx";
import InputField from "../../components/ui/InputField.jsx";
import PrimaryButton from "../../components/ui/PrimaryButton.jsx";
import TabButton from "../../components/ui/TabButton.jsx"
import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser, sendOTP } from "../../services/authService.js";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../hooks/useAuth.js";

import toast from "react-hot-toast";


export default function LoginPage() {

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

   const { fetchCurrentUser } = useAuth();

  const navigate = useNavigate();

   const [activeTab, setActiveTab] = useState("login");
  
    // LOGIN STATE
    const [loginData, setLoginData] = useState({
      email: "",
      password: "",
    });
  
    // ACTIVATE STATE
    const [activateData, setActivateData] = useState({
      email: "",
    });

    const handleLogin = async(e)=> {
      e.preventDefault();

      setLoading(true);

      try {
        const response = await loginUser(loginData);

        // console.log(response.data);
        
        if(response.data.success){


            const user = response.data.data.user;
  
      // localStorage.setItem("user", JSON.stringify(user));

      await fetchCurrentUser();
     
      
  if (user.role === "client") {
    navigate("/client/dashboard");
  } else {
    navigate("/admin/dashboard");
  }
 
        }

 
      } catch (error) {
  //         console.log("LOGIN ERROR:", error.response?.data);
  // console.log("STATUS:", error.response?.status);
  toast.error("Invalid credentials");
      } finally {
    setLoading(false);  
  }
    }


    const handleSendOtp = async (e) => {
e.preventDefault();
      setLoading(true);

  try {
  
 const filteredEmail = activateData.email?.trim().toLowerCase();

      if(!filteredEmail){
        toast.error("Invalid email")
        return
      }
              const response = await sendOTP({
                email: filteredEmail,
                purpose: "verify"
              }
              );
        
              // store backup
     localStorage.setItem("email", filteredEmail);
localStorage.setItem("purpose", "verify");
        
             navigate("/auth/verify-otp", {
           state: {
              email: filteredEmail,
               purpose: "verify",
           }
        });


    toast.success("OTP sent successfully!");
  } catch (err) {
      console.log("SEND OTP ERROR:", err.response?.data);
  console.log("STATUS:", err.response?.status);
    toast.error(
      err.response?.data?.message || "Failed to send OTP."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout>
      
      <AuthCard className="animate-authReveal py-4">
         
        
                {/* TITLE */}
                <h1 className="text-3xl font-bold text-center mb-6">
                  Welcome
                </h1>
        
                {/* BUTTON TABS */}
                <div className="flex mb-6 border border-gray-200 rounded-lg overflow-hidden">
                  
                  <TabButton
                  type="button"
                  text="Login"
                    onClick={() => setActiveTab("login")}
                    className={`w-1/2 py-2 text-sm font-medium transition border-r border-gray-200 ${
                      activeTab === "login"
                        // ? "bg-black text-white"
                        // : "bg-white text-gray-600"

                         ? "bg-green-100 text-[#56BD05] border-green-200"
  :  "bg-gray-50 text-gray-600"

                    }`}
                  />
                  
        
                  <TabButton 
                  type="button"
                  text="Activate"
                    onClick={() => setActiveTab("activate")}
                    className={`w-1/2 py-2 text-sm font-medium transition ${
                      activeTab === "activate"
                        // ? "bg-black text-white"
                        // : "bg-white text-gray-600"

                                                 ? "bg-green-50 text-[#56BD05] border-green-200"
  : "bg-white text-gray-600"

                    }`}
                  />
                  
                </div>
        




        

         
                {/* LOGIN FORM */}
                {activeTab === "login" && (
                  <form className="space-y-2" onSubmit={handleLogin}>
        
                    <InputField
                      label="Email"
                      type="email"
                      value={loginData.email}
                      placeholder="Enter Email"
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                    />
        
            

<InputField
  label="Password"
  type={showPassword ? "text" : "password"}
  value={loginData.password}
  placeholder="Enter Password"
  onChange={(e) =>
    setLoginData({
      ...loginData,
      password: e.target.value,
    })
  }
  rightElement={
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="text-gray-500 hover:text-gray-700"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  }
/>

                    <p className="text-right text-sm mt-1">
  <Link to="/auth/forgot-password" className="text-blue-500 hover:underline">
    Forgot password?
  </Link>
</p>
        
                    <PrimaryButton text="Login" type="submit" loading={loading} className="mt-4"/>
                    
                    {/* Signup link */}
        <p className="text-sm mt-4 text-gray-600">
          Don't have an account?{" "}
         <Link to="/auth/register" className="text-blue-500 hover:underline">
  Sign up
</Link>
        </p>
        
                  </form>
                )}
        
                {/* ACTIVATE FORM */}
                {activeTab === "activate" && (
                  <form className="space-y-2" onSubmit={handleSendOtp}>
        
                    <InputField
                      label="Email"
                      type="email"
                      value={activateData.email}
                      placeholder="Enter email to activate"
                      onChange={(e) =>
                        setActivateData({ ...activateData, email: e.target.value })
                      }
                    />
        

                    <PrimaryButton text="Send OTP" type="submit" loading={loading} className="mt-4"/>
        

                   {/* Signup link */}
        <p className="text-sm mt-4 text-gray-600">
          Don't have an account?{" "}
         <Link to="/auth/register" className="text-blue-500">
  Sign up
</Link>
        </p>

                  </form>
                )}
        
           
         
          {/* Warranty CTA */}
     <div className="mt-5 border-t border-slate-200 pt-5">
  <p className="mb-4 text-center text-sm leading-6 text-slate-600">
    Verify your product warranty without logging in.
  </p>

<div className="flex items-center justify-center">
   <Link to="/warranty-check" className=" inline-block">
    <PrimaryButton
      type="button"
      text="Verify Warranty"
        className="w-auto"
    />
  </Link>
  </div>

</div>

   

            {/* Warranty Verification CTA */}
{/* <div className="mt-4 border-t border-slate-200 pt-4 text-center mb-0">
  <p className="mb-2 text-sm leading-6 text-slate-600">
    Verify your product warranty serial number.
  </p>

  <Link
    to="/warranty-check"
    className="flex justify-center inline-block"
  >
    <PrimaryButton
      type="button"
      text="Verify Warranty"
      fullWidth={false}
      className="text-light px-4"
    />
  </Link>
</div> */}



      </AuthCard>



    </AuthLayout>
  );
}








