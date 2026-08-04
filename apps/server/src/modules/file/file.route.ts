import {Router} from "express";
import multer from "multer";
import { authGuard } from "../../middleware/authGuard";
import * as fileService from "./file.service";
import { uploadImage } from "../../config/multer";

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
router.use(authGuard);


router.post("/upload", upload.single("file"), async (req, res) => {
  const record = await fileService.handleUpload(req.body.boardId, req.user.id, req.file!, "image");
  res.status(202).json({ fileId: record.id, status: record.status, url: record.url });
});

router.post("/import-pdf", upload.single("file"), async (req, res) => {
  const record = await fileService.handleUpload(req.body.boardId, req.user.id, req.file!, "pdf");
  res.status(202).json({ fileId: record.id, status: record.status });
});

router.post("/export-upload", uploadImage.single("file"), async (req, res) => {
  const record = await fileService.saveExportUpload(
    req.body.boardId,
    req.user.id,
    req.file!,
    req.body.format
  );

  if (!record) {
    return res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Failed to save export upload",
    });
  }

  res.status(201).json({ url: record.url });
});

router.get("/:id", async (req, res) => {
  const file = await fileService.getFileStatus(req.params.id);
  res.json(file);
});


export default router;