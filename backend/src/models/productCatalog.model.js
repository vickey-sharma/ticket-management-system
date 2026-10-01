import mongoose, { Schema } from "mongoose";

const productCatalogSchema = new Schema(
    {
        modelName: {
            type: String,
            required: true,
            trim: true,
             unique: true,
             set: (value) =>
  value
    .trim()
    .replace(/\s*-\s*/g, "-") // Remove spaces around existing hyphens
    .replace(/\s+/g, "-")      // Replace remaining spaces with hyphens
    .toUpperCase()
        },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

    isActive: {
      type: Boolean,
      default: true,
    },
 isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    }
    },
    { timestamps: true }
);

export const ProductCatalog = mongoose.model(
  "ProductCatalog",
  productCatalogSchema
);


//  Model Name example -  WD-GS-2210-8P4SI