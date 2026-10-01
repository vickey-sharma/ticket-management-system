import { v2 as cloudinary } from "cloudinary";

const deleteFromCloudinary = async (fileUrl) => {
  try {

    if (!fileUrl) return null;

    // extract public_id
    const public_id = fileUrl.split("/").pop().split(".")[0];

    // detect file type from extension
    const extension = fileUrl.split(".").pop().toLowerCase();

    let resourceType = "image";

    if (["mp4", "mov", "avi", "mkv", "webm"].includes(extension)) {
      resourceType = "video";
    }

    const result = await cloudinary.uploader.destroy(
      public_id,
      { resource_type: resourceType }
    );

    console.log("Cloudinary delete result:", result);

    return result;

  } catch (error) {

    console.log("Cloudinary delete error:", error);

  }
};

export { deleteFromCloudinary };