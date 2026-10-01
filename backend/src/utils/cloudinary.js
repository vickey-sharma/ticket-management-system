import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, options= {}) => {
    try {
        if(!localFilePath) return null;

        //upload file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath, {
            //cloudinary options --study in cloudinary
            // resource_type: "auto"
            // resource_type: "raw"
             ...options,
        })
        //file uploaded successfully
        console.log(`File is uploaded on cloudinary ${response.secure_url}`)
        console.log(`RESPONSE IS ${response}`)

       
        // if(response){
        //     fs.unlinkSync(localFilePath)
        // }

        if (fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
}

        return response;
       
    } catch (error) {
         console.error("CLOUDINARY ERROR:", error);

    if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
    }

    return null;
    }
}

export { uploadOnCloudinary }