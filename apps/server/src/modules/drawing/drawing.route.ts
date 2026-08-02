import {Router} from 'express';
import {authGuard} from '../../middleware/authGuard';
import * as drawingService from './drawing.service';

const router: Router = Router();
router.use(authGuard);

router.get("/:id/objects", async (req, res) => {
  const objects = await drawingService.getBoardObjects(req.params.id);
  res.json({ objects });
});

router.post("/:id/objects", async (req, res) => {
  const object = await drawingService.createObject(req.params.id, req.user.id, req.body);
  res.status(201).json(object);
});

router.post("/:id/clear", async (req, res) => {
  await drawingService.clearBoard(req.params.id);
  res.json({ clearedAt: new Date().toISOString() });
});

export default router;

