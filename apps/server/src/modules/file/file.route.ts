import {Router} from "express";
import multer from "multer";
import { authGuard } from "../../middleware/authGuard";
import * as fileService from "./file.service";

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

router.get("/:id", async (req, res) => {
  const file = await fileService.getFileStatus(req.params.id);
  res.json(file);
});

router.post("/boards/:id/export", async (req, res) => {
  const fileId = await fileService.requestExport(req.params.id, req.body.format, req.user.id);
  res.status(202).json({ fileId, status: "queued" });
});

export default router;