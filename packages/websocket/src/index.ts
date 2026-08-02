
// event name constants
export const SOCKET_EVENTS = {
  // Board / room lifecycle
  BOARD_JOIN: "board:join",
  BOARD_LEAVE: "board:leave",
  BOARD_CLEAR: "board:clear",
  BOARD_CLEARED: "board:cleared",
  BOARD_RENAMED: "board:renamed",
  BOARD_DELETED: "board:deleted",
  BOARD_RESTORED: "board:restored",

  // Drawing sync
  DRAWING_CREATE: "drawing:create",
  DRAWING_UPDATE: "drawing:update",
  DRAWING_DELETE: "drawing:delete",
  DRAWING_UNDO: "drawing:undo",
  DRAWING_REDO: "drawing:redo",

  // Presence / awareness
  PRESENCE_SYNC: "presence:sync",
  PRESENCE_JOIN: "presence:join",
  PRESENCE_LEAVE: "presence:leave",
  CURSOR_MOVE: "cursor:move",
  SELECTION_UPDATE: "selection:update",

  // Chat
  CHAT_MESSAGE: "chat:message",

  // Files / export (server -> client only)
  FILE_READY: "file:ready",
  EXPORT_READY: "export:ready",

  // Errors
  ERROR: "error",
} as const;

// shared types
export type DrawingObjectType =
  | "pen" | "rectangle" | "circle" | "line" | "arrow" | "text" | "image";

export type DrawingObject = {
  id: string;
  boardId: string;
  authorId: string;
  type: DrawingObjectType;
  data: Record<string, any>;
  zIndex: number;
};

export type PresenceUser = {
  userId: string;
  name: string;
  color: string;
};

export type CursorPosition = {
  userId: string;
  name: string;
  color: string;
  x: number;
  y: number;
};

export type ChatMessage = {
  id: string;
  userId: string;
  name: string;
  text: string;
  createdAt: string;
};

// CLIENT -> SERVER PAYLOADS 
export type BoardJoinPayload = { boardId: string };
export type BoardLeavePayload = { boardId: string };
export type BoardClearPayload = { boardId: string };

export type DrawingCreatePayload = { boardId: string; object: Omit<DrawingObject, "id" | "authorId"> };
export type DrawingUpdatePayload = { boardId: string; objectId: string; changes: Record<string, any> };
export type DrawingDeletePayload = { boardId: string; objectId: string };
export type DrawingUndoPayload = { boardId: string };
export type DrawingRedoPayload = { boardId: string };

export type CursorMovePayload = { boardId: string; x: number; y: number };
export type SelectionUpdatePayload = { boardId: string; objectIds: string[] };

export type ChatMessagePayload = { boardId: string; text: string };

//SERVER -> CLIENT PAYLOADS 
export type BoardClearedPayload = { boardId: string; clearedAt: string };
export type BoardRenamedPayload = { boardId: string; title: string };
export type BoardDeletedPayload = { boardId: string };
export type BoardRestoredPayload = { boardId: string; objects: DrawingObject[] };

export type PresenceSyncPayload = PresenceUser[];
export type PresenceJoinPayload = PresenceUser;
export type PresenceLeavePayload = { userId: string; name: string };

export type FileReadyPayload = { fileId: string; url: string; type: "image" | "pdf" };
export type ExportReadyPayload = { jobId: string; url: string; format: "png" | "pdf" };

export type ErrorPayload = { code: string; message: string };