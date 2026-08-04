import {Queue, Worker} from "bullmq";
import {redisClient} from "../config/redis";
import {db, drawingObjects, uploadedFiles} from "@repo/db";
import {eq, isNull, and} from "drizzle-orm";
import {uploadBufferToCloudinary} from "../config/cloudinary";
import { io } from "../websocket";
import { renderBoardToPngBuffer, getShapesForPdf } from "./renderBoard";
import PDFDocument from "pdfkit";


export const exportQueue = new Queue("export-queue", { connection: redisClient });

function renderBoardToPdfBuffer(shapes: ReturnType<typeof getShapesForPdf>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [1600, 1000], margin: 0 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.rect(0, 0, 1600, 1000).fill("#ffffff");

    shapes.forEach((shape) => {
      doc.strokeColor(shape.color || "#000000").lineWidth(2);

      if (shape.type === "pen") {
        const points = shape.points ?? [];
        const firstPoint = points[0];

        if (firstPoint) {
          doc.moveTo(firstPoint.x, firstPoint.y);
          points.slice(1).forEach((p) => doc.lineTo(p.x, p.y));
          doc.stroke();
        }
      } else if (
        shape.type === "rectangle" &&
        shape.x !== undefined &&
        shape.y !== undefined &&
        shape.width !== undefined &&
        shape.height !== undefined
      ) {
        doc.rect(shape.x, shape.y, shape.width, shape.height).stroke();
      } else if (shape.type === "circle" && shape.centerX !== undefined) {
        doc.circle(shape.centerX, shape.centerY!, shape.radius!).stroke();
      } else if (shape.type === "line" && shape.x1 !== undefined) {
        doc.moveTo(shape.x1, shape.y1!).lineTo(shape.x2!, shape.y2!).stroke();
      } else if (shape.type === "arrow" && shape.x1 !== undefined) {
        doc.moveTo(shape.x1, shape.y1!).lineTo(shape.x2!, shape.y2!).stroke();
      } else if (shape.type === "text" && shape.text) {
        doc.fillColor(shape.color || "#000000").fontSize(shape.fontSize || 16).text(shape.text, shape.x!, shape.y!);
      }
    });

    doc.end();
  });
}

export function startExportWorker() {
  return new Worker(
    "export-queue",
    async (job) => {
      const { boardId, format, userId, fileId } = job.data as {
        boardId: string;
        format: "png" | "pdf";
        userId: string;
        fileId: string;
      };

      const objects = await db
        .select()
        .from(drawingObjects)
        .where(and(eq(drawingObjects.boardId, boardId), isNull(drawingObjects.deletedAt)));

      let buffer: Buffer;
      if (format === "png") {
        buffer = renderBoardToPngBuffer(objects);
      } else {
        buffer = await renderBoardToPdfBuffer(getShapesForPdf(objects));
      }

      const result = await uploadBufferToCloudinary(buffer, {
        folder: `syncboard/exports/${boardId}`,
        resourceType: format === "pdf" ? "raw" : "image",
      });

      const [record] = await db
        .update(uploadedFiles)
        .set({
          url: result.secure_url,
          status: "ready",
        })
        .where(eq(uploadedFiles.id, fileId))
        .returning();

      if (!record) throw new Error("Failed to save export record");

      io.to(`board:${boardId}`).emit("export:ready", {
        jobId: fileId,
        url: record.url,
        format,
      });
    },
    { connection: redisClient }
  );
}