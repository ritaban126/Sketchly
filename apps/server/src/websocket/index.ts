import {Server, Socket} from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import {redisClient} from "../config/redis";
import {auth} from "@repo/auth";
import { fromNodeHeaders } from "better-auth/node";
import * as drawingService from "../modules/drawing/drawing.service";
import * as boardService from "../modules/board/board.service";
import * as notificationService from "../modules/notifications/notification.service";
import { SOCKET_EVENTS } from "@repo/websocket";


// Exported so jobs/*.job.ts can emit events (file:ready, export:ready)
export let io: Server;

type PresenceUser = { userId: string; name: string; color: string };
const boardPresence = new Map<string, Map<string, PresenceUser>>();


const COLORS = ["#F87171", "#60A5FA", "#34D399", "#FBBF24", "#A78BFA", "#F472B6"];
function randomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)]!;
}

export async function initWebSocket(server: Server) {
  io = server;

  // Redis adapter — enables horizontal scaling across multiple server instances
  const pubClient = redisClient.duplicate();
  const subClient = redisClient.duplicate();
  io.adapter(createAdapter(pubClient, subClient));

  // Authenticate every socket connection using the same session as REST
  io.use(async (socket, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(socket.handshake.headers),
      });
      if (!session?.user) return next(new Error("Unauthorized"));
      socket.data.user = session.user;
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const user = socket.data.user as { id: string; name: string };

    // BOARD JOIN
    socket.on(SOCKET_EVENTS.BOARD_JOIN, async ({ boardId }: { boardId: string }) => {
      socket.join(`board:${boardId}`);
      socket.data.boardId = boardId;

      if (!boardPresence.has(boardId)) boardPresence.set(boardId, new Map());
      const presence = boardPresence.get(boardId)!;
      const color = randomColor();
      presence.set(socket.id, { userId: user.id, name: user.name, color });

      socket.emit("presence:sync", Array.from(presence.values()));
      socket.to(`board:${boardId}`).emit("presence:join", { userId: user.id, name: user.name, color });

      // Persisted notification (fire-and-forget, doesn't block real-time flow)
      const board = await boardService.getBoardById(boardId).catch(() => null);
      if (board && board.ownerId !== user.id) {
        notificationService.createNotification(board.ownerId, boardId, "user-joined", { name: user.name }).catch(() => {});
      }
    });

    // CURSOR
    socket.on(SOCKET_EVENTS.CURSOR_MOVE, ({ boardId, x, y }: { boardId: string; x: number; y: number }) => {
      const presence = boardPresence.get(boardId);
      const me = presence?.get(socket.id);
      if (!me) return;
      socket.to(`board:${boardId}`).emit("cursor:move", { userId: me.userId, name: me.name, color: me.color, x, y });
    });

    // DRAWING SYNC
    socket.on(SOCKET_EVENTS.DRAWING_CREATE, async ({ boardId, object }: { boardId: string; object: any }) => {
      const saved = await drawingService.createObject(boardId, user.id, object);
      socket.to(`board:${boardId}`).emit("drawing:create", { object: saved });
    });

    socket.on(SOCKET_EVENTS.DRAWING_UPDATE, async ({ boardId, objectId, changes }: { boardId: string; objectId: string; changes: any }) => {
      await drawingService.updateObject(objectId, changes);
      socket.to(`board:${boardId}`).emit("drawing:update", { objectId, changes });
    });

    socket.on(SOCKET_EVENTS.DRAWING_DELETE, async ({ boardId, objectId }: { boardId: string; objectId: string }) => {
      await drawingService.deleteObject(objectId);
      socket.to(`board:${boardId}`).emit("drawing:delete", { objectId });
    });

    // CLEAR BOARD
    socket.on(SOCKET_EVENTS.BOARD_CLEAR, async ({ boardId }: { boardId: string }) => {
      await drawingService.clearBoard(boardId);
      io.to(`board:${boardId}`).emit("board:cleared", { boardId, clearedAt: new Date().toISOString() });
    });

    // CHAT
    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, ({ boardId, text }: { boardId: string; text: string }) => {
      const message = {
        id: crypto.randomUUID(),
        userId: user.id,
        name: user.name,
        text,
        createdAt: new Date().toISOString(),
      };
      io.to(`board:${boardId}`).emit("chat:message", message);
    });

    // DISCONNECT
    socket.on("disconnect", async () => {
      const boardId = socket.data.boardId;
      if (!boardId) return;

      const presence = boardPresence.get(boardId);
      const me = presence?.get(socket.id);
      if (!me) return;

      presence!.delete(socket.id);
      socket.to(`board:${boardId}`).emit(SOCKET_EVENTS.PRESENCE_LEAVE, { userId: me.userId, name: me.name });

      const board = await boardService.getBoardById(boardId).catch(() => null);
      if (board && board.ownerId !== me.userId) {
        notificationService.createNotification(board.ownerId, boardId, "user-left", { name: me.name }).catch(() => {});
      }
    });
  });
}