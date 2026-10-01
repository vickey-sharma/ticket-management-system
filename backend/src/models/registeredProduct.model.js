import mongoose, { Schema } from "mongoose";

// const replacementHistorySchema = new Schema(
//     {
//         oldSerialNumber: {
//             type: String,
//             required: true,
//             trim: true,
//         },
//         replacedDate: {
//             type: Date,
//             default: Date.now,
//         },
//         remark: {
//             type: String,
//             trim: true,
//               maxlength: 500,
//             default: "",
//             required: true
//         },
//         replacedBy: {
//             type: Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },
//     },
// );

// const repairHistorySchema = new Schema({
//   repairedDate: {
//     type: Date,
//     default: Date.now,
//   },
//   remark: {
//     type: String,
//     trim: true,
//     maxlength: 500,
//     default: "",
//   },
//   repairedBy: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
// });


const serviceHistorySchema = new Schema({
    type: {
        type: String,
        enum: ["repaired", "replaced"],
        required: true,
    },
    
fromSerialNumber: {
    type: String,
    trim: true,
},

toSerialNumber: {
    type: String,
    trim: true,
},

    remark: {
        type: String,
        trim: true,
        maxlength: 500,
        default: "",
    },

    createdBy: {
type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    performedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: true,
    },

    performedAt: {
        type: Date,
        default: Date.now,
    },
        isDeleted: {
        type: Boolean,
        default: false,
    },

    deletedAt: {
        type: Date,
        default: null,
    },
});

const registeredProductSchema = new Schema(
    {
        billNumber: {
            type: String,
            required: true,
            trim: true,
        },
        billDate: {
            type: Date,
            required: true,
        },
       billCompanyName: {
    type: String,
    trim: true,
    lowercase: true,
},

endCompanyName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
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
            type: String,
            required: [true, "Serial number is required"],
            trim: true,
            unique: true,
        },
          productStatus: {
            type: String,
            enum: ["new", "repaired", "replaced", ],
            default: "new",
        },
//          replacementHistory: {
//     type: [replacementHistorySchema],
//     default: [],
// },
// repairHistory: {
//   type: [repairHistorySchema],
//   default: [],
// },

serviceHistory: {
    type: [serviceHistorySchema],
    default: [],
},
        warrantyEndDate: {
            type: Date,
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        updatedBy: [
            {
                user: {
                    type: Schema.Types.ObjectId,
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

    },
    { timestamps: true }
)

export const RegisteredProduct = mongoose.model("RegisteredProduct", registeredProductSchema);