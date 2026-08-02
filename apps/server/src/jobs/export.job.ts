import {Queue, Worker} from "bullmq";
import {redisClient} from "../config/redis";
import {db, drawingObjects, uploadedFiles} from "@repo/db";
import {eq, isNull, and} from "drizzle-orm";
import {uploadBufferToCloudinary} from "../config/cloudinary";
// import { io } from "../websocket";


export const exportQueue = new Queue("export-queue", { connection: redisClient });


export function startExportWorker() {
  return new Worker(
    "export-queue",
    async (job) => {
      const { boardId, format, userId } = job.data as {
        boardId: string;
        format: "png" | "pdf";
        userId: string;
      };

      const objects = await db
        .select()
        .from(drawingObjects)
        .where(and(eq(drawingObjects.boardId, boardId), isNull(drawingObjects.deletedAt)));

      // Placeholder: render `objects` into an actual image/PDF buffer here (e.g. using node-canvas or pdf-lib)
      // const buffer = await renderBoardToBuffer(objects, format);
      const buffer = Buffer.from("PLACEHOLDER"); // replace with real rendered buffer

      const result = await uploadBufferToCloudinary(buffer, {
        folder: `syncboard/exports/${boardId}`,
        resourceType: format === "pdf" ? "raw" : "image",
      });

      const [record] = await db
        .insert(uploadedFiles)
        .values({
          boardId,
          uploadedBy: userId,
          type: format === "png" ? "export-png" : "export-pdf",
          url: result.secure_url,
          status: "ready",
        })
        .returning();

    //   io.to(`board:${boardId}`).emit("export:ready", { jobId: job.id, url: record.url, format });
    },
    { connection: redisClient }
  );
}