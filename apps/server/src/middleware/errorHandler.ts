// import type { Request, Response, NextFunction } from "express";
// import multer from "multer";


// export function errorHandler(
//   err: any,
//   _req: Request,
//   res: Response,
//   _next: NextFunction
// ) {
//   // Multer-specific errors (file too large, wrong field name, etc.)
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ code: "UPLOAD_ERROR", message: err.message });
//   }

//   // File type rejected by our custom fileFilter in config/multer.ts
//   if (typeof err.message === "string" && err.message.startsWith("Only")) {
//     return res.status(400).json({ code: "INVALID_FILE_TYPE", message: err.message });
//   }

//   // Known business logic errors thrown manually (e.g., "Invalid share link", "Snapshot not found")
//   if (err.message === "Invalid share link" || err.message === "Snapshot not found") {
//     return res.status(404).json({ code: "NOT_FOUND", message: err.message });
//   }

//   // Fallback — unexpected errors
//   console.error("Unhandled error:", err);
//   res.status(err.status || 500).json({
//     code: err.code || "INTERNAL_ERROR",
//     message: err.message || "Something went wrong",
//   });
// }

import type { Request, Response, NextFunction } from "express";
import multer from "multer";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      code: "UPLOAD_ERROR",
      message: err.message,
    });
  }

  if (typeof err.message === "string" && err.message.startsWith("Only")) {
    return res.status(400).json({
      code: "INVALID_FILE_TYPE",
      message: err.message,
    });
  }

  if (
    err.message === "Invalid share link" ||
    err.message === "Snapshot not found"
  ) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: err.message,
    });
  }

  console.error("Unhandled error:", err);

  const statusCode = typeof err.status === "number" ? err.status : 500;

  res.status(statusCode).json({
    code: err.code || "INTERNAL_ERROR",
    message: err.message || "Something went wrong",
  });
}
