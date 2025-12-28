import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = (buffer, folder, fileName, isImage = false) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: isImage ? "image" : "auto",
        folder: folder,
        public_id: fileName,
        type: "upload",
        access_mode: "public",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};
