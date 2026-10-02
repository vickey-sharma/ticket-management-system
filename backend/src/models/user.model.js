import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
fullName: {
    type: String,
    required: [true, "Full Name is required"],
    trim: true,
},
email: {
   type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true, 
     match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
    ]
},
password: {
 type: String, 
 required: [true, "Password is required"],
},
role: {
    type: String,
    enum: [ "admin", "agent", "customer"],
    default: "customer"
},
isDeleted: {
  type: Boolean,
  default: false
},
deletedAt: {
  type: Date,
  default: null
},
refreshToken: {
type: String
},
createdBy: {
     type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
},

},
{ timestamps: true }
)


userSchema.pre("save", async function(){

    if(!this.isModified("password")) return;

this.password = await bcrypt.hash(this.password, 10)

});

userSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password, this.password) 
};


userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema);