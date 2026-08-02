import {db, uploadedFiles} from "@repo/db";
import {eq} from "drizzle-orm";
import {uploadBufferToCloudinary} from "../../config/cloudinary.js";
import {imageProcessingQueue} from "../../jobs/imageProcessing.job";
import {exportQueue} from "../../jobs/export.job";


export async function handleUpload(
  boardId: string,
  userId: string,
  file: Express.Multer.File,
  type: "image" | "pdf"
) {
  const result = await uploadBufferToCloudinary(file.buffer, {
    folder: `syncboard/boards/${boardId}`,
    resourceType: type === "pdf" ? "raw" : "image",
  });

  const createdRows = await db
    .insert(uploadedFiles)
    .values({
      boardId,
      uploadedBy: userId,
      type,
      url: result.secure_url,
      status: type === "image" ? "ready" : "processing",
    })
    .returning();

  const record = createdRows[0];
  if (!record) {
    throw new Error("Failed to create uploaded file record.");
  }

  if (type === "pdf") {
    await imageProcessingQueue.add("process-pdf", {
      fileId: record.id,
      boardId,
      type,
      sourceUrl: result.secure_url,
    });
  }

  return record;
}

export async function requestExport(boardId: string, format: "png" | "pdf", userId: string) {
  const job = await exportQueue.add("export-board", { boardId, format, userId });
  return job.id;
}

// export async function getFileStatus(fileId: string) {
//   const file = await db.query.uploadedFiles.findFirst({
//     where: eq(uploadedFiles.id, fileId),
//   });

//   return file ?? null;
// }

// export async function getFileStatus(fileId: string) {
//   return db.query.uploadedFiles.findFirst({ where: eq(uploadedFiles.id, fileId) });
// }

export async function getFileStatus(fileId: string) {
  const [file] = await db
    .select()
    .from(uploadedFiles)
    .where(eq(uploadedFiles.id, fileId))
    .limit(1);

  return file ?? null;
}
