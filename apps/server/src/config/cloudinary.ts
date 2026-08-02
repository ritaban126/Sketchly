import {v2 as cloudinary, type UploadApiResponse} from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLODINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secrect: process.env.CLOUDINARY_API_SECRET!
})

export {cloudinary}

// Uploads a buffer (from multer memoryStorage) to Cloudinary
export function uploadBufferToCloudinary(
  buffer: Buffer,
  options: { folder?: string; resourceType?: "image" | "raw" | "auto" } = {}
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "syncboard",
        resource_type: options.resourceType || "auto",
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "raw" = "image") {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}