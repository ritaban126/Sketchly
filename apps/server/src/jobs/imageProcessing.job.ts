import {Queue, Worker} from "bullmq";
import {redisClient} from "../config/redis";
import {db, uploadedFiles} from "@repo/db";
import {eq} from "drizzle-orm";
// import { io } from "../websocket";

export const imageProcessingQueue = new Queue("image-processing-queue", {
  connection: redisClient,
});


export function startImageProcessingWorker() {
  return new Worker(
    "image-processing-queue",
    async (job) => {
      const { fileId, boardId, type, sourceUrl } = job.data as {
        fileId: string;
        boardId: string;
        type: "image" | "pdf";
        sourceUrl?: string;
      };

      if (type === "pdf" && sourceUrl) {
        // Cloudinary can render PDF pages as images via URL transformation.
        // Example: appending `.jpg` with a page flag converts page 1 to an image.
        const pageImageUrl = sourceUrl.replace(/\.pdf$/, ".jpg");

        await db.update(uploadedFiles).set({ status: "ready", url: pageImageUrl }).where(eq(uploadedFiles.id, fileId));
      } else {
        await db.update(uploadedFiles).set({ status: "ready" }).where(eq(uploadedFiles.id, fileId));
      }

    //   io.to(`board:${boardId}`).emit("file:ready", { fileId, type });
    },
    { connection: redisClient }
  );
}