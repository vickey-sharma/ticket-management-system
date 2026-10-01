import mongoose, { Schema } from "mongoose";


const  registeredProductUploadSchema = new Schema(
    {
fileName: {
    type: String,
    required: true
},
uploadedBy: {
     type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
},
totalRows: {
    type: Number,
    required: true
},
failedRows: {
    type: Number,
    required: true
},
insertedRows: {
    type: Number,
    required: true
},
fileUrl: {
    type: String,
    required: true
},
failedData: {
            type: [
                {
                    rowNumber: Number,

                    data: {
                        type: Schema.Types.Mixed,
                    },

                    errors: {
                        type: [String],
                    },
                },
            ],

            default: [],
},
isDeleted: {
  type: Boolean,
  default: false
},
deletedAt: {
  type: Date,
  default: null
}

    },
  { timestamps: true }
)

export const RegisteredProductUpload = mongoose.model(  "RegisteredProductUpload", registeredProductUploadSchema);