import {Router} from "express";
import {authGuard} from '../../middleware/authGuard';
import * as historyService from "./history.service";

const router: Router = Router();
router.use(authGuard);

router.get("/:id/history", async (req, res) => {
  const history = await historyService.listHistory(req.params.id);
  res.json({ history });
});

router.post("/:id/history", async (req, res) => {
  const snapshot = await historyService.takeSnapshot(req.params.id, req.user.id);
  res.status(201).json(snapshot);
});

router.post("/:id/history/:historyId/restore", async (req, res) => {
  const result = await historyService.restoreSnapshot(req.params.id, req.params.historyId, req.user.id);
  res.json(result);
});

export default router;
