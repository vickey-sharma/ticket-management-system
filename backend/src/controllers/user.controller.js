import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Otp } from "../models/otp.model.js";
import { sendOTP, verifyOTP } from "../services/otp.services.js";
import jwt from "jsonwebtoken";
import { sanitizeUserResponse } from "../utils/sanitizeUserResponse.js";

//TESTING ONLY
const registerUserWithoutOTPVerification = asyncHandler(async(req, res)=> {
   const { fullName, email, password, phoneNumber, role, companyName } = req.body;

   const filteredFullName = fullName?.trim();
   const filteredEmail = email?.trim().toLowerCase();
   const filteredPassword = password?.trim();
   const filteredPhoneNumber = phoneNumber?.trim();
   const filteredRole = role?.trim().toLowerCase() || "client";;
   const filteredCompanyName = companyName?.trim();

 
   if(filteredRole === "client"){
    if(!filteredCompanyName){
     throw new ApiError(400, "Company Name is required")
    }
   }

   if(!filteredFullName || !filteredEmail || !filteredPassword || !filteredPhoneNumber){
    throw new ApiError(400, "All fields are required")
   };

     const allowedRoles = ["superadmin", "admin", "engineer", "l1_engineer", "client"];

   if(!allowedRoles.includes(filteredRole)){
throw new ApiError(400, "Invalid role")
   };


   const userExists = await User.findOne({ email: filteredEmail })

   if(userExists){
    throw new ApiError(409, "User already exists")
   };

  
let createdUser;
   if(filteredRole === "client"){
  createdUser = await User.create({
       fullName: filteredFullName,
    email: filteredEmail,
    phoneNumber: filteredPhoneNumber,
    password: filteredPassword,
    isRegistrationComplete: true,
    isActive: true,
    isVerified: true,
    role: filteredRole,
    companyName: filteredCompanyName
   })
   } else{
    createdUser = await User.create({
       fullName: filteredFullName,
    email: filteredEmail,
    phoneNumber: filteredPhoneNumber,
    password: filteredPassword,
    isRegistrationComplete: true,
    isActive: true,
    isVerified: true,
    role: filteredRole
   })
   }

   return res
   .status(201)
   .json(new ApiResponse(201, { user : sanitizeUserResponse(createdUser) }, "User created successfully"))
})

const sendOTPController = asyncHandler(async (req, res)=> {
  const { email, purpose, turnstileToken } = req.body;

  const filteredPurpose = purpose?.trim().toLowerCase();
  const filteredEmail = email?.trim().toLowerCase();
  const filteredTurnstileToken = turnstileToken?.trim();
  // console.log(filteredPurpose, filteredEmail);


  if(!filteredEmail || !filteredPurpose){
    throw new ApiError(400, "Email and purpose are required");
  }

  if(!["register", "verify", "forgot_password"].includes(filteredPurpose)){
  throw new ApiError(
    400,
    "Invalid purpose"
  )
}


  if(filteredPurpose === "register" && !filteredTurnstileToken){
 throw new ApiError(400, "Human verification is required.");
  }

  if(filteredPurpose === "register"){
    const existingUser = await User.findOne({ 
      email: filteredEmail,
      isRegistrationComplete: true,
      isOTPVerified: true,
      canLogin: true,
     });

    if(existingUser){
      throw new ApiError( 400, "User already exists")
    }

         // Verify Turnstile token with Cloudflare
        const formData = new FormData();

        formData.append(
            "secret",
            process.env.TURNSTILE_SECRET_KEY
        );

        formData.append(
            "response",
            filteredTurnstileToken
        );

        formData.append("remoteip", req.ip);

     let result;

try {
    const cloudflareResponse = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            body: formData,
        }
    );

    if (!cloudflareResponse.ok) {
        throw new ApiError(
            500,
            "Unable to verify human verification."
        );
    }

    result = await cloudflareResponse.json();
} catch (error) {
    throw new ApiError(
        500,
        "Unable to verify human verification."
    );
}

if (!result.success) {
    console.error("Turnstile verification failed:", result["error-codes"]);

    throw new ApiError(
        400,
        "Human verification failed."
    );
}
  }

    if(filteredPurpose === "verify"){
    const existingUser = await User.findOne({ 
      email: filteredEmail,
      isRegistrationComplete: true,
      isOTPVerified: true,
      canLogin: true,
     });

    if(existingUser){
      throw new ApiError( 400, "User already exists")
    }
  }

  if(filteredPurpose === "forgot_password"){
     const existingUser = await User.findOne({ 
      email: filteredEmail,
      canLogin: true,
     });

     if(!existingUser){
      throw new ApiError( 404, "User not found")
     }
  }
// console.log("purpose in sendOTP controller: ", purpose);

  await sendOTP(filteredEmail, filteredPurpose)

  return res
.status(200)
.json(
   new ApiResponse(
      200,
      null,
      "OTP sent successfully"
   )
);
})

const verifyOTPController = asyncHandler(async(req, res)=>{
  const { email, otp, purpose } = req.body;

   const filteredEmail = email?.trim().toLowerCase();
  const filteredPurpose = purpose?.trim().toLowerCase();
const filteredOTP = String(otp)?.trim();

  if(!filteredEmail || !filteredPurpose || !filteredOTP){
    throw new ApiError( 400, "Email, OTP and purpose are required")
  }

  if(!["register", "verify", "forgot_password"].includes(filteredPurpose)){
      throw new ApiError(
      400,
      "Invalid purpose"
    );
  }

const user = await User.findOne({ email: filteredEmail });

if (user && !user.canLogin) {
    throw new ApiError(
        403,
        "This account is not permitted to log in."
    );
}

// console.log("purpose in user controller: ", purpose);

  await verifyOTP(
    filteredEmail,
    filteredOTP,
    filteredPurpose
  )

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "OTP verified successfully"
      )
    );
})

const registerClientController = asyncHandler(async (req, res)=> {

  console.log("Headers:", req.headers["content-type"]);
  console.log("BODY:", req.body);

  const { fullName, email, phoneNumber, companyName } = req.body;

  const filteredFullName = fullName?.trim();
  const filteredEmail = email?.trim().toLowerCase();
  const filteredPhoneNumber = phoneNumber?.trim();
  const filteredCompanyName = companyName?.trim().toLowerCase();
  //  const filteredPassword = password?.trim();

  if(!filteredFullName || !filteredEmail || !filteredPhoneNumber|| !filteredCompanyName){
    throw new ApiError(400, "All fields are required")
  }

  const existingUser = await User.findOne({
    email: filteredEmail
  })

  if(existingUser){
    throw new ApiError(400, "User already exists")
  }

//   if (existingUser && !existingUser.canLogin) {
//     throw new ApiError(
//         403,
//         "This account is not permitted."
//     );
// }

  // const isOTPVerified = await Otp.findOne({ 
  //   email: filteredEmail,
  //   purpose: "register",
  //   isVerified: true
  // })

  // if(!isOTPVerified){
  //   throw new ApiError( 400, "Please verify OTP first")
  // };

  const user = await User.create({
    fullName: filteredFullName,
    email: filteredEmail,
    phoneNumber: filteredPhoneNumber,
    companyName: filteredCompanyName,
    isRegistrationComplete: true,
    isActive: true,
    isVerified: true
  })

   const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

return res
    .status(201) //postman expects this seperately
    .json(new ApiResponse(201,
      { user : sanitizeUserResponse(createdUser) }, 
       "User registered in successfully"));
})

const generateAccessAndRefreshToken = async(userId)=>{
  try {
    const user = await User.findOne({
  _id: userId,
  isDeleted: false
});

    if(!user){
      throw new ApiError(404, "User not found");
    }
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken }


  } catch (error) {
    console.error("TOKEN ERROR:", error);
       if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}

const loginUserController = asyncHandler(async(req, res) => {

  console.log("LOGIN BODY:", req.body);

   const { email, password } = req.body;

  const filteredEmail = email?.trim().toLowerCase();
  const filteredPassword = password?.trim();

  if(!filteredEmail || !filteredPassword){
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findOne({
  email: filteredEmail,
  isDeleted: false,
});

  if (!user) {
   throw new ApiError(404, "User not found");
}

if (user.role === "vendor") {
    throw new ApiError(403, "Vendor accounts cannot log in.");
}

if (!user.canLogin) {
    throw new ApiError(403, "This account is not permitted to log in.");
}

if(!user.isVerified){
  throw new ApiError(403, "Account not verified");
}

if(!user.isRegistrationComplete){
   throw new ApiError(403, "Complete your registration first");
}

if(!user.isActive){
  throw new ApiError(403, "Your account is inactive");
}

const isPasswordValid = await user.isPasswordCorrect(filteredPassword);

if(!isPasswordValid){
  throw new ApiError(401, "Invalid credentials");
}

const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

//USER WITH UPDATED --  ACCESS AND REFRESH TOKEN
const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

if(!loggedInUser){
   throw new ApiError(404, "User not found");
};

//SEND COOKIES -- PURPOSE -- BY DEFAULT ANYONE CAN MODIFY IN FRONTEND BUT NOW IT CAN ONLY BE MODIFIED FROM SERVER FRONTEND CAN ONLY SEE 
const options =  {
  httpOnly: true,
  secure: true,

  //DEPLOYMENT
  sameSite: "none"

  //LOCALLY
  //  sameSite: "strict"
}

// FOR MOBILE --because you cannot set cookies in mobile, so handling that here in response
  // new ApiResponse(
  //   200,
  //   {
  //     user: loggedInUser, accessToken, refreshToken
  //   }
  // )

return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
  new ApiResponse(
    200,
   { user : sanitizeUserResponse(loggedInUser) },
    "User logged in successfully"
  )
)
})

const logoutUserController = asyncHandler(async(req, res)=>{

 await User.findByIdAndUpdate(req.user._id, {
   
    $unset: {
      refreshToken: 1,
    },
  },
{
  // new: true  - depricated //retured responsehere  will be - new updated value of user with deted refreshtoken
    returnDocument: "after"
});

  const options =  {
  httpOnly: true,
  secure: true,
  sameSite: "strict"
}


return res.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200, {}, "User logged out successfully"))

})

const refreshAccessToken = asyncHandler(async(req, res)=> {
  
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorized request")
  };

 try {
   const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
 

   //Didn't do optional chaining or verified decodedToken

   const loggedInUser = await User.findOne({
  _id: decodedToken._id,
  isDeleted: false
});
 
   if(!loggedInUser){
     throw new ApiError(401, "Invalid refresh token")
   };
 
   if(incomingRefreshToken !== loggedInUser?.refreshToken){
 throw new ApiError(401, "Refresh Token is expired or used")
   };
 
   const {   accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(loggedInUser._id);
 
 
     const options =  {
   httpOnly: true,
   secure: true,
   sameSite: "strict"
 }
 
 return res
 .status(200)
 .cookie("accessToken", newAccessToken, options)
 .cookie("refreshToken", newRefreshToken, options)
 .json(
 new ApiResponse(
   200,
   { accessToken: newAccessToken, refreshToken: newRefreshToken },
   "Access Token refreshed successfully"
 )
 )
 } catch (error) {
throw new ApiError(401, "Invalid or expired refresh token")
 };

});

const forgotPassword = asyncHandler(async(req, res)=> {


  const { email, newPassword, confirmNewPassword, purpose } = req.body;

  const filteredEmail = email?.trim().toLowerCase();
  const filteredNewPassword = newPassword?.trim();
  const filteredConfirmNewPassword = confirmNewPassword?.trim();
  const filteredPurpose = purpose?.trim().toLowerCase() || "forgot_password";


  if(!filteredEmail || !filteredNewPassword || !filteredConfirmNewPassword ||!filteredPurpose){
     throw new ApiError(400, "All fields are required")
  };

  if(filteredNewPassword !== filteredConfirmNewPassword){
    throw new ApiError(400, "Both password doesn't match")
  };

const currentUser = await User.findOne({
  email: filteredEmail,
  isDeleted: false
});

   if(!currentUser){
      throw new ApiError( 404, "User not found")
     }

     if(!currentUser.canLogin){
  throw new ApiError(
        403,
        "This account is not permitted to log in."
    )
     }

  const isOTPVerified = await Otp.findOne({ 
    email: filteredEmail,
    purpose: filteredPurpose,
    isVerified: true
  })

  if(!isOTPVerified){
    throw new ApiError( 400, "Please verify OTP first")
  };

  const isOldAndNewPasswordSame = await currentUser.isPasswordCorrect(filteredNewPassword);

if(isOldAndNewPasswordSame){
  throw new ApiError(409, "New password cannot be same as old password");
};

currentUser.password = filteredNewPassword;
currentUser.refreshToken = null;
await currentUser.save();


    await Otp.deleteMany({
  email: filteredEmail,
  purpose: "forgot_password"
});

return res
.status(200)
.json( 
  new ApiResponse(200, {}, "Password reset successfully")
)
})

const changeCurrentPassword = asyncHandler(async(req, res)=> {

  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  const userId = req.user?._id;

   if(!userId){
    throw new ApiError(401, "Unauthorized Access");
   }

  const filteredOldPassword = oldPassword?.trim();
  const filteredNewPassword = newPassword?.trim();
  const filteredConfirmNewPassword = confirmNewPassword?.trim();

  if(!filteredOldPassword || !filteredNewPassword || !filteredConfirmNewPassword){
throw new ApiError(400, "All fields are required")
  };

  if(filteredOldPassword === filteredNewPassword){
 throw new ApiError(409, "New password cannot be same as old password");
  }

  if( filteredNewPassword !== filteredConfirmNewPassword){
     throw new ApiError(400, "Both password doesn't match")
  };

  const currentUser = await User.findById(userId);

 if(!currentUser){
      throw new ApiError( 404, "User not found")
     }

    if (!currentUser.canLogin) {
    throw new ApiError(
        403,
        "This account is not permitted to log in."
    );
}

const isOldPasswordCorrect = await currentUser.isPasswordCorrect(filteredOldPassword);

if(!isOldPasswordCorrect){
  throw new ApiError(401, "Incorrect old password")
};

currentUser.password = filteredNewPassword;
currentUser.refreshToken = null;
await currentUser.save();

return res
.status(200)
.json( 
  new ApiResponse(200, {}, "Password changed successfully")
)


})

const getCurrentUser = asyncHandler(async(req, res)=> {

   const currentUser = req.user;

   if(!currentUser){
    throw new ApiError(400, "Current user not found");
   }

   return res
   .status(200)
   .json(new ApiResponse(200, { user : sanitizeUserResponse(currentUser) }, "Current user found"))

})


//UPDATE PROFILE
const updateProfileController = asyncHandler(async(req, res)=> {

  const { fullName, phoneNumber, companyName } = req.body;

  const filteredFullName = fullName?.trim();
  const filteredPhoneNumber = phoneNumber?.trim();
  const filteredCompanyName = companyName?.trim().toLowerCase();


  const userId = req.user?._id;

  if(!userId){
     throw new ApiError(401, "Invalid or Missing UserId")
  };

const currentUser = await User.findById(userId);

if(!currentUser){
  throw new ApiError(404, "User not found")
}

let isUserAClient;

if(currentUser.role === "client"){
  isUserAClient = true;
  if(!filteredFullName || !filteredPhoneNumber || !filteredCompanyName){
    throw new ApiError(400, "All fields are required")
  }
}

if(currentUser.role !== "client"){
  isUserAClient = false;
   if(!filteredFullName || !filteredPhoneNumber){
    throw new ApiError(400, "All fields are required")
  }
}

if(isUserAClient){
  currentUser.fullName = filteredFullName;
  currentUser.phoneNumber = filteredPhoneNumber;
  currentUser.companyName = filteredCompanyName;
} else{
  currentUser.fullName = filteredFullName;
  currentUser.phoneNumber = filteredPhoneNumber;
}


 await currentUser.save();

return res
.status(200)
.json(new ApiResponse(200, {}, "Profile updated successfully"))
})

//UPDATING OTHER'S PROFILE
const updateUserProfileController = asyncHandler(async(req, res)=> {

  const currentUser = req.user;
  if(!currentUser){
     throw new ApiError(401, "Current User is Missing")
  };
const currentUserRole = currentUser.role?.trim().toLowerCase();
if(!currentUserRole){
  throw new ApiError(400, "Error while fetching user role")
}

const { fullName, phoneNumber, companyName, fullAddress, city, state, pincode, isActive } = req.body;

  const filteredFullName = fullName?.trim();
  const filteredPhoneNumber = phoneNumber?.trim();
  const filteredCompanyName = companyName?.trim().toLowerCase();
  const filteredFullAddress = fullAddress?.trim();
   const filteredCity = city?.trim();
    const filteredState = state?.trim();
     const filteredPincode = pincode?.trim();
  
  if (typeof isActive !== "boolean") {
  throw new ApiError(400, "isActive must be a boolean.");
}

const filteredIsActive = isActive;


  if(!filteredFullName || !filteredPhoneNumber){
    throw new ApiError(400, "All fields are required")
  }

  const userEmailForUpdate = req.params?.email;
const filteredUserEmailForUpdate = userEmailForUpdate?.trim().toLowerCase();

if(!filteredUserEmailForUpdate){
throw new ApiError(401,  "Email is required")
};

const filteredUserForUpdate = await User.findOne({
  email: filteredUserEmailForUpdate,
  isDeleted: false
});
if(!filteredUserForUpdate){
  throw new ApiError(404, "User not found")
};
const roleOfUserToBeUpdated = filteredUserForUpdate.role?.trim().toLowerCase();

if(!roleOfUserToBeUpdated){
  throw new ApiError(400, "Error while fetching user role")
}


const manageableRoles = {
  superadmin: ["superadmin", "admin", "engineer", "l1_engineer", "client", "sales_manager", "inventory_manager", "vendor"],
  admin: ["admin", "engineer", "l1_engineer", "client", "sales_manager", "inventory_manager", "vendor"],
  engineer: ["client"],
  l1_engineer: ["client"],
  sales_manager: ["client"]
};


if(!manageableRoles[currentUserRole]?.includes(roleOfUserToBeUpdated)){
throw new ApiError(403, "Unauthorized access")
};

console.log(filteredCompanyName);
if(manageableRoles[currentUserRole].includes(roleOfUserToBeUpdated)){
filteredUserForUpdate.fullName = filteredFullName;
filteredUserForUpdate.phoneNumber = filteredPhoneNumber;
filteredUserForUpdate.isActive = filteredIsActive;


if(roleOfUserToBeUpdated === "client"){
if(!filteredCompanyName){
     throw new ApiError(400, "company name is required for client");
  }
   filteredUserForUpdate.companyName = filteredCompanyName;
 
  filteredUserForUpdate.fullAddress = filteredFullAddress || "";
  filteredUserForUpdate.city = filteredCity || "";
  filteredUserForUpdate.state = filteredState || "";
  filteredUserForUpdate.pincode = filteredPincode || "";
};

if(roleOfUserToBeUpdated === "vendor"){
  if(!filteredCompanyName || !filteredFullAddress || !filteredCity || !filteredState || !filteredPincode){
     throw new ApiError(400, "All Address fields & company name is required for vendors");
  }
  filteredUserForUpdate.companyName = filteredCompanyName;
  filteredUserForUpdate.fullAddress = filteredFullAddress;
  filteredUserForUpdate.city = filteredCity;
  filteredUserForUpdate.state = filteredState;
  filteredUserForUpdate.pincode = filteredPincode;
}


await filteredUserForUpdate.save()
};

//updatedUser == user -- IN API RESPONSE
return res
.status(200)
.json(new ApiResponse(200, { user: sanitizeUserResponse(filteredUserForUpdate) }, "User Profile updated successfully"))

})



//DEACTIVATE AND REACTIVATE
// const deactivateUserAccountController = asyncHandler(async(req, res)=> {
  
//     const user = req.user;
//   if(!user){
//      throw new ApiError(401, "Invalid or Missing User")
//   };
// const currentUserRole = user.role?.trim().toLowerCase();
// if(!currentUserRole){
//   throw new ApiError(400, "Error while fetching user role")
// }

//   const userEmailForDeactivation = req.params?.email;
// const filteredUserEmailForDeactivation = userEmailForDeactivation?.trim().toLowerCase();

// if(!filteredUserEmailForDeactivation){
// throw new ApiError(400, "Invalid Email Id")
// };

// if (user.email === filteredUserEmailForDeactivation) {
//   throw new ApiError(
//     400,
//     "Use account deactivation endpoint for your own account"
//   );
// }

// const filteredUserForDeactivation = await User.findOne({
//   email: filteredUserEmailForDeactivation,
//   isDeleted: false
// });
// if(!filteredUserForDeactivation){
//   throw new ApiError(404, "User not found or already deactivated")
// };
// const roleOfUserToBeDeactivated = filteredUserForDeactivation.role?.trim().toLowerCase();

// if(!roleOfUserToBeDeactivated){
//   throw new ApiError(400, "Error while fetching user role")
// }


// const manageableRoles = {
//   superadmin: ["superadmin", "admin", "engineer", "l1_engineer", "client"],
//   admin: ["admin", "engineer", "l1_engineer", "client"],
// };


// if(!manageableRoles[currentUserRole]?.includes(roleOfUserToBeDeactivated)){
// throw new ApiError(403, "Unauthorized access")
// };

// if(manageableRoles[currentUserRole].includes(roleOfUserToBeDeactivated)){
// filteredUserForDeactivation.isDeleted = true;
// filteredUserForDeactivation.deletedAt = new Date();
// await filteredUserForDeactivation.save();
// };

// //deactivatedUser = user -- IN API RESPONSE
// return res
// .status(200)
// .json(new ApiResponse(200, { user: sanitizeUserResponse(filteredUserForDeactivation) }, "User Account deactivated successfully"))
// })


// const reactivateUserAccountController = asyncHandler(async(req, res)=> {
  
    
//     const user = req.user;
//   if(!user){
//      throw new ApiError(401, "Invalid or Missing User")
//   };
// const currentUserRole = user.role?.trim().toLowerCase();
// if(!currentUserRole){
//   throw new ApiError(400, "Error while fetching user role")
// }

//   const userEmailForReactivation = req.params?.email;
// const filteredUserEmailForReactivation = userEmailForReactivation?.trim().toLowerCase();

// if(!filteredUserEmailForReactivation){
// throw new ApiError(400, "Invalid Email Id")
// };

// if (user.email === filteredUserEmailForReactivation) {
//   throw new ApiError(
//     400,
//     "Use account reactivation endpoint for your own account"
//   );
// }

// const filteredUserForReactivation = await User.findOne({
//   email: filteredUserEmailForReactivation,
//   isDeleted: true
// });
// if(!filteredUserForReactivation){
//   throw new ApiError(404, "User not found or already activated")
// };
// const roleOfUserToBeReactivated = filteredUserForReactivation.role?.trim().toLowerCase();

// if(!roleOfUserToBeReactivated){
//   throw new ApiError(400, "Error while fetching user role")
// }


// const manageableRoles = {
//   superadmin: ["superadmin", "admin", "engineer", "l1_engineer", "client"],
//   admin: ["admin", "engineer", "l1_engineer", "client"],
// };


// if(!manageableRoles[currentUserRole]?.includes(roleOfUserToBeReactivated)){
// throw new ApiError(403, "Unauthorized access")
// };

// if(manageableRoles[currentUserRole].includes(roleOfUserToBeReactivated)){
// filteredUserForReactivation.isDeleted = false;
// filteredUserForReactivation.deletedAt = null;
// await filteredUserForReactivation.save();
// };

// // reactivatedUser = user -- IN API RESPONSE
// return res
// .status(200)
// .json(new ApiResponse(200, { user: sanitizeUserResponse(filteredUserForReactivation) }, "User account reactivated successfully"))
// })

// const deactivateAccountController = asyncHandler(async(req, res)=> {

// })

// const reactivateAccountController = asyncHandler(async(req, res)=> {
// })



const registerInitiallyUserController = asyncHandler(async(req, res)=> {


  const user = req.user;
    if(!user){
     throw new ApiError(401, "Invalid or Missing User")
  };
const currentUserRole = user.role?.trim().toLowerCase();
if(!currentUserRole){
  throw new ApiError(400, "Error while fetching current user role")
};


  const { fullName, email, phoneNumber, role, companyName, fullAddress, city, state, pincode  } = req.body;

    const filteredFullName = fullName?.trim();
  const filteredEmail = email?.trim().toLowerCase();
  const filteredPhoneNumber = phoneNumber?.trim();
  const filteredRole = role?.trim().toLowerCase();
  const filteredCompanyName = companyName?.trim().toLowerCase();
  const filteredFullAddress = fullAddress?.trim();
  const filteredCity = city?.trim();
  const filteredState = state?.trim();
  const filteredPincode = pincode?.trim();


  // console.log("Payload frontend data is: ", filteredFullName, filteredEmail, filteredPhoneNumber, filteredRole, filteredCompanyName);

  if(!filteredFullName || !filteredEmail || !filteredPhoneNumber || !filteredRole){
     throw new ApiError(400, "All fields are required")
  };

if (
    (filteredRole === "client" || filteredRole === "vendor") &&
    !filteredCompanyName
) {
    throw new ApiError(400, "Company name is required");
}

  if(filteredRole === "vendor" || filteredRole === "client"){
    if(!filteredFullAddress || !filteredCity || !filteredState || !filteredPincode){
         throw new ApiError(400,  "Full address, city, state and pincode are required.")
    }
  }

  

 const existingUser = await User.findOne({ email: filteredEmail });

if (existingUser) {
  throw new ApiError(409, "User already exists");
}

  const validRoles = ["superadmin", "admin", "engineer", "l1_engineer", "client", "sales_manager", "inventory_manager", "vendor"];
  if(!validRoles.includes(filteredRole)){
    throw new ApiError(400, "Role not available");
  };

  const availableRoles = {
  superadmin: ["superadmin", "admin", "engineer", "l1_engineer", "client", "sales_manager", "inventory_manager", "vendor"],
  admin: ["admin", "engineer", "l1_engineer", "client", "sales_manager", "inventory_manager", "vendor"],
  engineer: ["client"],
  l1_engineer: ["client"],
  sales_manager: ["client"]
};


if(!availableRoles[currentUserRole]?.includes(filteredRole)){
throw new ApiError(403, "Unauthorized access")
};

let createdUser;
if(availableRoles[currentUserRole].includes(filteredRole)){
let newUser;

if(filteredRole === "client"){
     newUser = await User.create({
    fullName: filteredFullName,
    email: filteredEmail,
    phoneNumber: filteredPhoneNumber,
   role: filteredRole, 
   companyName: filteredCompanyName,
   createdBy: user._id,
   fullAddress: filteredFullAddress,
city: filteredCity,
state: filteredState,
pincode: filteredPincode,
  })
} else if(filteredRole === "vendor"){
    newUser = await User.create({
    fullName: filteredFullName,
    email: filteredEmail,
    phoneNumber: filteredPhoneNumber,
   role: filteredRole, 
   companyName: filteredCompanyName || null,
   createdBy: user._id,
    canLogin: false,
    isVerified: true,
isRegistrationComplete: true, 
isActive: true,
fullAddress: filteredFullAddress,
city: filteredCity,
state: filteredState,
pincode: filteredPincode
  })
}else{
    newUser = await User.create({
    fullName: filteredFullName,
    email: filteredEmail,
    phoneNumber: filteredPhoneNumber,
   role: filteredRole, 
   createdBy: user._id
  })
}

  createdUser = await User.findById(newUser._id).select(
  "-password -refreshToken"
);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

};

return res
.status(201)
.json(new ApiResponse(201, { user : sanitizeUserResponse(createdUser) }, "User registered successfully"))

})

const verifyAccountAfterRegister = asyncHandler(async(req, res)=>{

const { email, password, confirmPassword, purpose } =  req.body;

const filteredPassword = password?.trim();
const filteredConfirmPassword = confirmPassword?.trim();
const filteredEmail = email?.trim().toLowerCase();
const filteredPurpose = purpose?.trim().toLowerCase();

console.log("Detail for verification controller", filteredEmail, filteredPassword, filteredConfirmPassword, filteredPurpose)

if(!filteredPassword || !filteredEmail || !filteredConfirmPassword || !purpose){
  throw new ApiError(400, " All fields are required")
}

if (filteredPassword !== filteredConfirmPassword) {
  throw new ApiError(400, "Passwords do not match");
}

let isOTPVerified;

if(filteredPurpose === "verify"){
    isOTPVerified = await Otp.findOne({ 
    email: filteredEmail,
    purpose: "verify",
    isVerified: true
  })
};

if(filteredPurpose === "register"){
  isOTPVerified = await Otp.findOne({ 
    email: filteredEmail,
    purpose: "register",
    isVerified: true
  })
}

  if(!isOTPVerified){
    throw new ApiError( 400, "Please verify OTP first")
  };


  const updateUser = await User.findOne({ email: filteredEmail });

  if (!updateUser) {
  throw new ApiError(404, "User not found");
};

if(!updateUser.canLogin){
    throw new ApiError(
        403,
        "This account is not permitted to log in."
    );
}

  updateUser.password = filteredPassword;
   updateUser.isRegistrationComplete = true;
    updateUser.isActive = true;
    updateUser.isVerified = true ;

    await updateUser.save();

    const createdUser = await User.findOne({
      email: filteredEmail,
      isRegistrationComplete: true,
      isActive: true,
      isVerified: true
    }).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while verifying created the user");
  }

  console.log("Created User is :", createdUser);


    await Otp.deleteMany({
  email: filteredEmail,
  purpose: "verify"
    })

  return res
    .status(200) //postman expects this seperately
    .json(new ApiResponse(200,
        { user : sanitizeUserResponse(createdUser) }, 
       "User registered successfully"));
})

const getAllUsers = asyncHandler(async(req, res)=> {

  
  const currentUser = req.user;
  if(!currentUser){
     throw new ApiError(401, "Invalid or Missing User")
  };

const currentUserRole = currentUser.role?.trim().toLowerCase();
if(!currentUserRole){
  throw new ApiError(400, "Error while fetching user role")
};

if(!["superadmin", "admin", "engineer", "l1_engineer", "sales_manager"].includes(currentUserRole)){
  throw new ApiError(403, "Unauthorized access")
};

let users;
if(currentUserRole === "superadmin"){
users = await User.find({
  isVerified: true,
isRegistrationComplete: true,
}).select("-password -refreshToken -isRegistrationComplete -isVerified");
}

if(currentUserRole === "admin"){
  users = await User.find({
  isVerified: true,
isRegistrationComplete: true,
 role: { $ne: "superadmin" }
}).select("-password -refreshToken -isRegistrationComplete -isVerified");
}

if(currentUserRole === "engineer" || currentUserRole === "l1_engineer" || currentUserRole === "sales_manager"){
   users = await User.find({
  isVerified: true,
isRegistrationComplete: true,
 role: "client"
}).select("-password -refreshToken -isRegistrationComplete -isVerified");
}

//{ users: users }
  return res
   .status(200)
   .json(new ApiResponse(200,  { users: users.map(sanitizeUserResponse) },  "All users fetched successfully"))


})


const getUserByRole = asyncHandler(async(req, res)=> {

  const currentUser = req.user;
  if(!currentUser){
     throw new ApiError(401, "Unauthorized");
  };

  const currentUserRole = currentUser.role?.trim()?.toLowerCase();
  if(!currentUserRole){
throw new ApiError(401, "Unauthorized role");
  };

    if (!["superadmin", "admin", "engineer", "l1_engineer", "sales_manager"].includes(currentUserRole)) {
        throw new ApiError(403, "Unauthorized access");
    };

    const searchedRole = req.query.role?.trim().toLowerCase();
    const search = req.query.search?.trim();

    
    if(!searchedRole){
      throw new ApiError(400, "Role is required");
    };

     const escapedSearch = search
    ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    : "";


    const allowedRoles = [
    "vendor",
    "engineer",
    "l1_engineer",
    "sales_manager",
    "client",
    "admin",
    "superadmin",
];

if (!allowedRoles.includes(searchedRole)) {
    throw new ApiError(400, "Invalid role");
}


       const filter = {
        role: searchedRole,
        isDeleted: false,
    };

        if (escapedSearch) {
        filter.$or = [
            {
                fullName: {
                    $regex: escapedSearch,
                    $options: "i",
                },
            },
            {
                email: {
                    $regex: escapedSearch,
                    $options: "i",
                },
            },
        ];
    };

     const users = await User.find(filter)
        .select("_id fullName email")
        .sort({ fullName: 1 })
        .limit(20);

         return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Users fetched successfully"
        )
    );
    
});

const getClientUsers = asyncHandler(async (req, res) => {

    const { email } = req.query;
    const filteredEmail = email?.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!filteredEmail) {
        return res.json(
            new ApiResponse(200, [], "No search text")
        );
    };

    const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Invalid or Missing User")
    };

    const currentUserRole = currentUser.role?.trim().toLowerCase();
    if (!currentUserRole) {
        throw new ApiError(400, "Error while fetching current user role")
    };

    if (["client", "inventory_manager", "vendor"].includes(currentUserRole)) {
        throw new ApiError(403, "Unauthorized role");
    };

    const users = await User.find({
        email: {
            $regex: `^${filteredEmail}`,
            $options: "i",
        },
        isRegistrationComplete: true,
        isActive: true,
        isDeleted: false,
        role: "client"
    }).select(
        "_id fullName email phoneNumber companyName"
    )
        .sort({ email: 1 })
        .limit(10);

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Users fetched successfully"
        )
    );
});

const getAdminUsers = asyncHandler(async (req, res) => {

    // const { email } = req.query;
    // const filteredEmail = email?.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // if (!filteredEmail) {
    //     return res.json(
    //         new ApiResponse(200, [], "No search text")
    //     );
    // };

    const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Invalid or Missing User")
    };

    const currentUserRole = currentUser.role?.trim().toLowerCase();
    if (!currentUserRole) {
        throw new ApiError(400, "Error while fetching current user role")
    };

    if (["client", "sales_manager", "inventory_manager", "vendor"].includes(currentUserRole)) {
        throw new ApiError(403, "Unauthorized role");
    };

    let users;

    if (currentUserRole === "superadmin") {
        users = await User.find({
            isRegistrationComplete: true,
            isActive: true,
            isDeleted: false,
            role: {
                $in: ["superadmin", "admin", "engineer", "l1_engineer"],
            },
        }).select(
            "_id fullName email phoneNumber companyName role"
        )
            .sort({ email: 1 })
            .limit(10);
    }

    if (currentUserRole === "admin") {
        users = await User.find({
            isRegistrationComplete: true,
            isActive: true,
            isDeleted: false,
            role: {
                $in: ["admin", "engineer", "l1_engineer"],
            },
        }).select(
            "_id fullName email phoneNumber companyName role"
        )
            .sort({ email: 1 })
            .limit(10);
    }

    if (currentUserRole === "engineer" || currentUserRole === "l1_engineer") {
        users = [{
            _id: currentUser._id,
            fullName: currentUser.fullName,
            email: currentUser.email,
            phoneNumber: currentUser.phoneNumber,
            companyName: currentUser.companyName,
            role: currentUser.role
        }];
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Users fetched successfully"
        )
    );
});

const getVendorUsers = asyncHandler(async (req, res) => {

    // const { email } = req.query;
    // const filteredEmail = email?.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // if (!filteredEmail) {
    //     return res.json(
    //         new ApiResponse(200, [], "No search text")
    //     );
    // };

    const currentUser = req.user;
    if (!currentUser) {
        throw new ApiError(401, "Invalid or Missing User")
    };

    const currentUserRole = currentUser.role?.trim().toLowerCase();
    if (!currentUserRole) {
        throw new ApiError(400, "Error while fetching current user role")
    };

    if (["client", "inventory_manager", "vendor"].includes(currentUserRole)) {
        throw new ApiError(403, "Unauthorized role");
    };

    let users;


    if (currentUserRole === "superadmin" || currentUserRole === "admin" || currentUserRole === "engineer" || currentUserRole === "l1_engineer" || currentUserRole === "sales_manager") {
        users = await User.find({
            isRegistrationComplete: true,
            isActive: true,
            isDeleted: false,
            role: "vendor",
        }).select(
            "_id fullName email phoneNumber companyName"
        )
            .sort({ email: 1 })
            .limit(10);
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            users,
            "Users fetched successfully"
        )
    );
});


export { 
  registerUserWithoutOTPVerification,
  
sendOTPController,
verifyOTPController,
registerClientController,
loginUserController,

logoutUserController,
refreshAccessToken,

forgotPassword,
changeCurrentPassword,
getCurrentUser,
updateProfileController,

updateUserProfileController,
// deactivateUserAccountController,
// reactivateUserAccountController,
getAllUsers,
getUserByRole,

registerInitiallyUserController,
verifyAccountAfterRegister,

getClientUsers,
getAdminUsers,
getVendorUsers,
}


