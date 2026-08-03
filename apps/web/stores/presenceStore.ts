import {create} from 'zustand';
import type {PresenceUser,CursorPosition,ChatMessage} from "@repo/websocket";



type PresenceState = {
  onlineUsers: Record<string, PresenceUser>;
  cursors: Record<string, CursorPosition>;
  messages: ChatMessage[];

  setOnlineUsers: (users: PresenceUser[]) => void;
  addUser: (user: PresenceUser) => void;
  removeUser: (userId: string) => void;

  updateCursor: (cursor: CursorPosition) => void;
  removeCursor: (userId: string) => void;

  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
};


export const usePresenceStore = create<PresenceState>((set) => ({
  onlineUsers: {},
  cursors: {},
  messages: [],

  setOnlineUsers: (users) =>
    set({ onlineUsers: Object.fromEntries(users.map((u) => [u.userId, u])) }),

  addUser: (user) =>
    set((state) => ({ onlineUsers: { ...state.onlineUsers, [user.userId]: user } })),

//   removeUser: (userId) =>
//     set((state) => {
//       const { [userId]: _, ...rest } = state.onlineUsers;
//       const { [userId]: __, ...restCursors } = state.cursors;
//       return { onlineUsers: rest, cursors: restCursors };
//     }),
    removeUser: (userId) =>
    set((state) => {
        const restUsers = { ...state.onlineUsers };
        delete restUsers[userId];
        const restCursors = { ...state.cursors };
        delete restCursors[userId];
        return { onlineUsers: restUsers, cursors: restCursors };
    }),

  updateCursor: (cursor) =>
    set((state) => ({ cursors: { ...state.cursors, [cursor.userId]: cursor } })),

//   removeCursor: (userId) =>
//     set((state) => {
//       const { [userId]: _, ...rest } = state.cursors;
//       return { cursors: rest };
//     }),
    removeCursor: (userId) =>
    set((state) => {
        const rest = { ...state.cursors };
        delete rest[userId];
        return { cursors: rest };
    }),

addMessage: (msg) =>
  set((state) => {
    if (state.messages.some((m) => m.id === msg.id)) return state; // already exists, skip
    return { messages: [...state.messages, msg] };
  }),

  clearMessages: () => set({ messages: [] }),
}));