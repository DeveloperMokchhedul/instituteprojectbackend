import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME||"dn5llg9d2",
    api_key: process.env.CLOUDINARY_API_KEY||"645463629883328",
    api_secret: process.env.CLOUDINARY_API_SECRET||"cZzuvUFGNwf8Vkc2YtSGquEP5FY"
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
    
        if (!localFilePath || !fs.existsSync(localFilePath)) {
            console.error("File not found or invalid path:", localFilePath);
            return null;
        }

        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });


        try {
            fs.unlinkSync(localFilePath);
        } catch (unlinkErr) {
            console.error("Failed to delete local file:", unlinkErr);
        }

        return response;

    } catch (err) {
        console.error("Cloudinary upload failed:", err);
        try {
            fs.unlinkSync(localFilePath); 
        } catch (unlinkErr) {
            console.error("Failed to delete local file:", unlinkErr);
        }
        return null;
    }
};

export { uploadOnCloudinary };



// import { v2 as cloudinary } from "cloudinary"; // cloudinary ইম্পোর্টে v2 যোগ করা হয়েছে
// import fs from "fs";

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME||"dn5llg9d2",
//     api_key: process.env.CLOUDINARY_API_KEY||"645463629883328",
//     api_secret: process.env.CLOUDINARY_API_SECRET||"cZzuvUFGNwf8Vkc2YtSGquEP5FY"
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null;

//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         });
//         fs.unlinkSync(localFilePath);
        
//         return response;

//     } catch (err) {
//     // 
//         fs.unlinkSync(localFilePath);
//         return null;
//     }
// };

// export { uploadOnCloudinary };
