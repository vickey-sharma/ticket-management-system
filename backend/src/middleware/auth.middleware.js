
//verify if user is there or not
//AUTHENTICATE WHO THE USER IS

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT =  asyncHandler(async(req, res, next)=> {
try {
    //req has cookie access
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
    if(!token){
        throw new ApiError(401, "Unauthorized request")
    }
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
    if(!user){
        //discuss about front end
        throw new ApiError(401, "Invalid Access Token")
    }
    
    
    ///IMPORTANT
    
    req.user = user  //ADDING NEW OBJECT as (name can be any) = user --- for eg (req, res)
    next()  //in order to run one more method in router automatically
    
} catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token")
}
})


///middleware - majorly used in routes
