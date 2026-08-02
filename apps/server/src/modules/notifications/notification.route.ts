import {Router} from "express"
import { authGuard } from "../../middleware/authGuard";
import * as notificationService from "./notification.service";

const router: Router = Router();
router.use(authGuard)


router.get("/", async (req, res) => {
  const list = await notificationService.getNotifications(req.user.id);
  res.json({ notifications: list });
});


router.patch("/:id/read", async (req, res) => {
  await notificationService.markAsRead(req.params.id);
  res.json({ id: req.params.id, isRead: true });
});

export default router;
