import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";



const registerCustomerController = asyncHandler(async (req, res)=> {

  const { fullName, email, password, confirmPassword } = req.body;

  const filteredFullName = fullName?.trim();
  const filteredEmail = email?.trim().toLowerCase();
  const filteredPassword = password?.trim();
  const filteredConfirmPassword = confirmPassword?.trim();

  if(!filteredFullName || !filteredEmail || !filteredPassword || !filteredConfirmPassword){
    throw new ApiError(400, "All fields are required")
  }

   if(filteredPassword !== filteredConfirmPassword){
    throw new ApiError(400, "Please Enter the same password")
  }

  const existingUser = await User.findOne({
    email: filteredEmail
  })

  if(existingUser){
    throw new ApiError(400, "User already exists")
  }

  const user = await User.create({
    fullName: filteredFullName,
    email: filteredEmail,
   password: filteredPassword,
   role: "customer"
  })

   const createdUser = await User.findById(user._id).select(
  "-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

return res
    .status(201)
    .json(new ApiResponse(201,
      { user : createdUser }, 
       "User created successfully"));
});

const registerUserByAdminController = asyncHandler(async(req, res)=> {


  const currentUser = req.user;
    if(!currentUser){
     throw new ApiError(401, "Invalid or Missing User")
  };
const currentUserRole = currentUser.role?.trim().toLowerCase();
if(!currentUserRole){
  throw new ApiError(400, "Error while fetching current user role")
};
if(currentUserRole !== "admin"){
  throw new ApiError(403, "Unauthorized access")
};


  const { fullName, email, role, password, confirmPassword  } = req.body;

    const filteredFullName = fullName?.trim();
  const filteredEmail = email?.trim().toLowerCase();
  const filteredPassword = password?.trim();
  const filteredConfirmPassword = confirmPassword?.trim();
  const filteredRole = role?.trim().toLowerCase();


  if(!filteredFullName || !filteredEmail || !filteredPassword || !filteredRole || !filteredConfirmPassword){
     throw new ApiError(400, "All fields are required")
  };

  if(filteredPassword !== filteredConfirmPassword){
    throw new ApiError(400, "Please Enter the same password")
  }
  
   const validRoles = [ "admin", "agent"];
  if(!validRoles.includes(filteredRole)){
    throw new ApiError(400, "Invalid role");
  };


 const existingUser = await User.findOne({ email: filteredEmail });

if (existingUser) {
  throw new ApiError(409, "User already exists");
}

const createUser = await User.create({
    fullName: filteredFullName,
    email: filteredEmail,
    password: filteredPassword,
   role: filteredRole,
   createdBy: currentUser._id 
})

  const createdUser = await User.findById(createUser._id).select(
  "-password -refreshToken"
);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }



return res
.status(201)
.json(new ApiResponse(201, { user : createdUser }, "User registered successfully"))

});

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
};

const loginUserController = asyncHandler(async(req, res) => {

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

return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
  new ApiResponse(
    200,
   { user : loggedInUser },
    "User logged in successfully"
  )
)
});

const logoutUserController = asyncHandler(async(req, res)=>{

 await User.findByIdAndUpdate(req.user._id, {
   
    $unset: {
      refreshToken: 1,
    },
  },
{

    returnDocument: "after"
});

  const options =  {
  httpOnly: true,
  secure: true,
  sameSite: "none"
}


return res.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(new ApiResponse(200, {}, "User logged out successfully"))

});


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
   sameSite: "none"
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


});

const getCurrentUser = asyncHandler(async(req, res)=> {

   const currentUser = req.user;

   if(!currentUser){
    throw new ApiError(400, "Current user not found");
   }

   return res
   .status(200)
   .json(new ApiResponse(200, { user : currentUser }, "Current user found"))

});


const updateProfileController = asyncHandler(async(req, res)=> {

  const { fullName, email } = req.body;

  const filteredFullName = fullName?.trim();
  const filteredEmail = email?.trim().toLowerCase();

if (!filteredFullName || !filteredEmail) {
  throw new ApiError(400, "Full name and email are required");
};

  const userId = req.user?._id;

  if(!userId){
     throw new ApiError(401, "Invalid or Missing UserId")
  };

const currentUser = await User.findById(userId);

if(!currentUser){
  throw new ApiError(404, "User not found")
}


  currentUser.fullName = filteredFullName;
  currentUser.email = filteredEmail;
 await currentUser.save();

return res
.status(200)
.json(new ApiResponse(200, {}, "Profile updated successfully"))
});


const getAllUsers = asyncHandler(async(req, res)=> {

  
  const currentUser = req.user;
  if(!currentUser){
     throw new ApiError(401, "Invalid or Missing User")
  };

const currentUserRole = currentUser.role?.trim().toLowerCase();
if(!currentUserRole){
  throw new ApiError(400, "Error while fetching user role")
};

if(currentUserRole !== "admin"){
  throw new ApiError(403, "Unauthorized access")
};

const allUsers = await User.find({isDeleted: false,}).select("-password -refreshToken");

  return res
   .status(200)
   .json(new ApiResponse(200,  { users: allUsers },  "All users fetched successfully"))


});


const getUsersBySearch = asyncHandler(async(req, res)=> {

  const currentUser = req.user;
  if(!currentUser){
     throw new ApiError(401, "Unauthorized");
  };

  const currentUserRole = currentUser.role?.trim()?.toLowerCase();
  if(!currentUserRole){
throw new ApiError(401, "Unauthorized role");
  };

  if(currentUserRole !== "admin"){
  throw new ApiError(403, "Unauthorized access")
};

   const name = req.query.name?.trim();
const email = req.query.email?.trim().toLowerCase();
const role = req.query.role?.trim().toLowerCase();

   
const filter = {
  isDeleted: false,
};

if (name) {
  filter.fullName = {
    $regex: name,
    $options: "i",
  };
}

if (email) {
  filter.email = {
    $regex: email,
    $options: "i",
  };
}

if (role) {
  const allowedRoles = ["admin", "agent", "customer"];

  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  filter.role = role;
}



     const allUsers = await User.find(filter)
        .select("_id fullName email role")
        .sort({ fullName: 1 })
        .limit(20);

         return res.status(200).json(
        new ApiResponse(
            200,
            { users: allUsers },
            "Users fetched successfully"
        )
    );
    
});




export { 
  
registerCustomerController,
registerUserByAdminController,

generateAccessAndRefreshToken,
refreshAccessToken,

loginUserController,
logoutUserController,

changeCurrentPassword,
getCurrentUser,
updateProfileController,

getAllUsers,
getUsersBySearch,

}


