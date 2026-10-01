import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const isVendor = function () {
    return this.role === "vendor";
};

const isClientOrVendor = function () {
    return ["client", "vendor"].includes(this.role);
};

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
default: null
},
isVerified: {
    type: Boolean,
    default: false
},
isRegistrationComplete: {
   type: Boolean,
   default: false
},
phoneNumber: {
    type: String,
    required: [true, "Phone Number is required"],
     trim: true,
    match: [/^(\+91|91)?[6-9]\d{9}$/, "Invalid Indian phone number"]
},
role: {
    type: String,
    enum: ["superadmin", "admin", "engineer", "l1_engineer", "client", "sales_manager", "inventory_manager", "vendor"],
    default: "client"
},
 companyName: {
    type: String,
    required: isClientOrVendor,
    trim: true
  },
  canLogin: {
    type: Boolean,
    default: true
},
isActive: {
    type: Boolean,
    default: false
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

fullAddress: {
    type: String,
    required: isVendor,
    trim: true,
},

city: {
    type: String,
    required: isVendor,
    trim: true,
},

state: {
    type: String,
    required: isVendor,
    trim: true,
},

pincode: {
    type: String,
    required: isVendor,
    trim: true,
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

//FOR NULL SAFETY CHECK
// userSchema.methods.isPasswordCorrect = async function (password) {
//     if (!this.password) {
//         return false;
//     }

//     return await bcrypt.compare(password, this.password);
// };



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