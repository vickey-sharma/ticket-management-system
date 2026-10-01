import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
    {
        ticketNumber: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true
        },
        issueTitle: {
            type: String,
            required: true,
            trim: true,
        },
        issueDescription: {
            type: String,
            required: true
        },
        priority: {
            type: String,
            default: "low",
            enum: ["high", "medium", "low"],
            required: true
        },
        department: {
            type: String,
          enum: ["rma", "technical_support", "general_query"],
            required: true
        },
        companyName:{
            type: String,
            required: true,
            trim: true
        },
        customerName: {
    type: String,
    required: true,
     trim: true
},
customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
},
        contactPerson: {
            type: String,
            required: true,
            trim: true
        },
        contactEmail:{
               type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true, 
     match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format"
    ]
        },
contactNumber: {
     type: String,
    required: [true, "Phone Number is required"],
     trim: true,
    match: [/^(\+91|91)?[6-9]\d{9}$/, "Invalid Indian phone number"]
},
fullAddress: {
    type: String,
    required: true,
    trim: true
},
state: {
    type: String,
    required: true,
    trim: true
},
city: {
    type: String,
     required: true,
    trim: true
},
pincode: {
    type: String,
     required: true,
    trim: true
},
productName: {
     type: String,
     required: true,
    trim: true
},
    modelNumber: {
            type: String,
            required: true,
            trim: true
        },
        serialNumber: {
             type: [String],    
            required: [true, "At least one serial number is required"],
            uppercase: true,
               validate: [
        {
            validator: function (arr) { return arr.length > 0; },
            message: "At least one serial number is required",
        },
        {
            validator: function (arr) {
                const unique = new Set(arr.map((s) => s.toUpperCase().trim()));
                return unique.size === arr.length;
            },
            message: "Duplicate serial numbers are not allowed",
        },
    ],
        },
         billNumber: {
            type: String,
           required: true,
            trim: true,
        },
        problemCategory: {
            type: String,
           enum: ["hw_failure", "sw_failure", "port_issue", "poe_issue", "power_issue", "others"],
            required: function () {
        return this.department === "rma"},
           validate: {
        validator: function (value) {
            if (this.department === "rma") {
                return value != null;
            }

            // For non-RMA tickets, problemCategory should not be provided
            return value === undefined || value === null;
        },
        message: "Problem category is only applicable for RMA tickets.",
    },
        },
        productImage: {
             type: [ String ], //cloudinary url
        },
        warrantyEndDate: {
            type: Date,
            required: true
        },
       expiredWarrantyDescription: {
    type: String,
    trim: true,
    default: null,
    required: function () {
        return this.warrantyEndDate < new Date();
    }
},
    assignedToHistory: [
  {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
],
assignedTo : {
     type: mongoose.Schema.Types.ObjectId,
      ref: "User",
},
replyMessage: [ 
  {
    category: {
        type: String,
       enum: ["work_in_progress", "issue_resolved"],
        required: true
    },
     message: {
    type: String,
    required: true,
    trim: true
},
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
    type: Date,
    default: Date.now
}
  }
],
ticketStatus: {
    type: String,
  enum: ["open", "in_progress", "resolved", "closed"],
    default:"open"
},
replyStatus: {
    type: String,
    enum: ["unanswered", "answered"],
    default:"unanswered"
},
createdBy: {
    type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
},
createdByRole: {
    type: String,
    enum: ["superadmin", "admin", "engineer", "l1_engineer", "client"],
    required: true
},
closedAt: {
    type: Date,
},
closedBy: {
    type: mongoose.Schema.Types.ObjectId,
        ref: "User",
},
updatedBy: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
],
isDeleted: {
  type: Boolean,
  default: false
},
deletedAt: {
  type: Date,
  default: null
},

vendorDetails: {
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },

      assignedAt: {
        type: Date,
        default: null
    },

    problemDescription: {
        type: String,
        trim: true,
        default: null
    },
    remarks: {
        type: String,
        trim: true,
        default: null
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
         default: null
    },

    updatedAt: {
        type: Date,
         default: null
    }
}
    },
    { timestamps: true }
    
)

export const Ticket = mongoose.model("Ticket", ticketSchema)