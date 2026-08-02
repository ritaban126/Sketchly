import {Router} from 'express';
import * as boardService from './board.service.js';
import {authGuard} from '../../middleware/authGuard.js';

// Explicitly define Router type because TypeScript cannot infer the type when generating declaration files or(in short)
// Add type annotation to avoid declaration generation type error
const router: Router = Router();
router.use(authGuard);

router.post("/", async (req, res) => {
  const board = await boardService.createBoard(req.user.id, req.body.title);
  res.status(201).json(board);
});

router.get("/", async (req, res) => {
  const boards = await boardService.listBoards(req.user.id, req.query.query as string);
  res.json({ boards });
});

router.get("/:id", async (req, res) => {
  const board = await boardService.getBoardById(req.params.id);
  if (!board) return res.status(404).json({ message: "Board not found" });
  res.json(board);
});

router.patch("/:id", async (req, res) => {
  const board = await boardService.renameBoard(req.params.id, req.body.title);
  res.json(board);
});

router.delete("/:id", async (req, res) => {
  await boardService.deleteBoard(req.params.id);
  res.status(204).send();
});

router.post("/:id/share", async (req, res) => {
  const shareToken = await boardService.generateShareLink(req.params.id);
  res.json({ shareToken, shareUrl: `${process.env.CLIENT_URL}/join/${shareToken}` });
});

router.post("/join/:shareToken", async (req, res) => {
  const board = await boardService.joinBoardByToken(req.params.shareToken, req.user.id);
  res.json({ boardId: board.id });
});

export default router;

