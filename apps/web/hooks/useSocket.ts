import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import {
  SOCKET_EVENTS,
  type DrawingObject,
  type PresenceUser,
  type CursorPosition,
  type ChatMessage,
} from "@repo/websocket";
import { useCanvasStore } from "../stores/canvasStore";
import { usePresenceStore } from "@/stores/presenceStore";
import { toast } from "sonner";

export function useSocket(boardId: string, enabled: boolean) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const addObject = useCanvasStore((s) => s.addObject);
  const updateObject = useCanvasStore((s) => s.updateObject);
  const removeObject = useCanvasStore((s) => s.removeObject);
  const clearObjects = useCanvasStore((s) => s.clearObjects);

  const setOnlineUsers = usePresenceStore((s) => s.setOnlineUsers);
  const addUser = usePresenceStore((s) => s.addUser);
  const removeUser = usePresenceStore((s) => s.removeUser);
  const updateCursor = usePresenceStore((s) => s.updateCursor);
  const addMessage = usePresenceStore((s) => s.addMessage);

  useEffect(() => {
    if (!enabled) return;

    const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit(SOCKET_EVENTS.BOARD_JOIN, { boardId });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on(SOCKET_EVENTS.PRESENCE_SYNC, (users: PresenceUser[]) => {
      setOnlineUsers(users);
    });

    socket.on(SOCKET_EVENTS.PRESENCE_JOIN, (user: PresenceUser) => {
      addUser(user);
      toast(`${user.name} joined the board`);
    });

    socket.on(
      SOCKET_EVENTS.PRESENCE_LEAVE,
      ({ userId, name }: { userId: string; name: string }) => {
        removeUser(userId);
        toast(`${name} left the board`);
      }
    );

    socket.on(SOCKET_EVENTS.CURSOR_MOVE, (cursor: CursorPosition) => {
      updateCursor(cursor);
    });

    socket.on(
      SOCKET_EVENTS.DRAWING_CREATE,
      ({ object }: { object: DrawingObject }) => {
        addObject(object);
      }
    );

    socket.on(
      SOCKET_EVENTS.DRAWING_UPDATE,
      ({
        objectId,
        changes,
      }: {
        objectId: string;
        changes: Partial<DrawingObject>;
      }) => {
        updateObject(objectId, changes);
      }
    );

    socket.on(
      SOCKET_EVENTS.DRAWING_DELETE,
      ({ objectId }: { objectId: string }) => {
        removeObject(objectId);
      }
    );

    socket.on(SOCKET_EVENTS.BOARD_CLEARED, () => {
      clearObjects();
    });

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (msg: ChatMessage) => {
      addMessage(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, [
    boardId,
    enabled,
    addObject,
    updateObject,
    removeObject,
    clearObjects,
    setOnlineUsers,
    addUser,
    removeUser,
    updateCursor,
    addMessage,
  ]);

  const sendCursorMove = useCallback(
    (x: number, y: number) => {
      socketRef.current?.emit(SOCKET_EVENTS.CURSOR_MOVE, { boardId, x, y });
    },
    [boardId]
  );

  const sendDrawingCreate = useCallback(
    (object: Omit<DrawingObject, "id" | "authorId">) => {
      socketRef.current?.emit(SOCKET_EVENTS.DRAWING_CREATE, { boardId, object });
    },
    [boardId]
  );

  const sendDrawingUpdate = useCallback(
    (objectId: string, changes: Partial<DrawingObject>) => {
      socketRef.current?.emit(SOCKET_EVENTS.DRAWING_UPDATE, {
        boardId,
        objectId,
        changes,
      });
    },
    [boardId]
  );

  const sendDrawingDelete = useCallback(
    (objectId: string) => {
      socketRef.current?.emit(SOCKET_EVENTS.DRAWING_DELETE, { boardId, objectId });
    },
    [boardId]
  );

  const sendClearBoard = useCallback(() => {
    socketRef.current?.emit(SOCKET_EVENTS.BOARD_CLEAR, { boardId });
  }, [boardId]);

  const sendChatMessage = useCallback(
    (text: string) => {
      socketRef.current?.emit(SOCKET_EVENTS.CHAT_MESSAGE, { boardId, text });
    },
    [boardId]
  );

  return {
    isConnected,
    sendCursorMove,
    sendDrawingCreate,
    sendDrawingUpdate,
    sendDrawingDelete,
    sendClearBoard,
    sendChatMessage,
  };
}
