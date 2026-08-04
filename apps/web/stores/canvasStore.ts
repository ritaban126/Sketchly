// import {create} from "zustand";
// import type {DrawingObject} from "@repo/websocket";



// export type Tool = "pen" | "eraser" | "rect" | "circle" | "line" | "arrow" | "text" | "select";

// type CanvasState = {
//   selectedTool: Tool;
//   color: string;
//   brushSize: number;
//   objects: Record<string, DrawingObject>;
//   selectedObjectId: string | null;
//   history: Record<string, DrawingObject>[];
//   redoStack: Record<string, DrawingObject>[];

//   setTool: (tool: Tool) => void;
//   setColor: (color: string) => void;
//   setBrushSize: (size: number) => void;

//   addObject: (obj: DrawingObject) => void;
//   updateObject: (id: string, changes: Partial<DrawingObject["data"]>) => void;
//   removeObject: (id: string) => void;
//   clearObjects: () => void;

//   setSelectedObjectId: (id: string | null) => void;

//   pushHistory: () => void;
//   undo: () => void;
//   redo: () => void;
// };


// export const useCanvasStore = create<CanvasState>((set, get) => ({
//   selectedTool: "pen",
//   color: "#111111",
//   brushSize: 4,
//   objects: {},
//   selectedObjectId: null,
//   history: [],
//   redoStack: [],

//   setTool: (tool) => set({ selectedTool: tool }),
//   setColor: (color) => set({ color }),
//   setBrushSize: (size) => set({ brushSize: size }),

//   addObject: (obj) =>
//     set((state) => ({ objects: { ...state.objects, [obj.id]: obj } })),

//   updateObject: (id, changes) =>
//     set((state) => ({
//       objects: {
//         ...state.objects,
//         [id]: { ...state.objects[id], data: { ...state.objects[id]?.data, ...changes } },
//       },
//     })),

//   // removeObject: (id) =>
//   //   set((state) => {
//   //     const { [id]: _, ...rest } = state.objects;
//   //     return { objects: rest };
//   //   }),
//   removeObject: (id) =>
//   set((state) => {
//     const rest = { ...state.objects };
//     delete rest[id];
//     return { objects: rest };
//   }),

//   clearObjects: () => set({ objects: {} }),

//   setSelectedObjectId: (id) => set({ selectedObjectId: id }),

//   pushHistory: () =>
//     set((state) => ({ history: [...state.history, state.objects], redoStack: [] })),

//   undo: () => {
//     const { history } = get();
//     if (history.length === 0) return;
//     const prev = history[history.length - 1];
//     set((state) => ({
//       objects: prev,
//       history: state.history.slice(0, -1),
//       redoStack: [...state.redoStack, state.objects],
//     }));
//   },

//   redo: () => {
//     const { redoStack } = get();
//     if (redoStack.length === 0) return;
//     const next = redoStack[redoStack.length - 1];
//     set((state) => ({
//       objects: next,
//       redoStack: state.redoStack.slice(0, -1),
//       history: [...state.history, state.objects],
//     }));
//   },
// }));


import {create} from "zustand";
import type {DrawingObject} from "@repo/websocket";



export type Tool = "pen" | "eraser" | "rect" | "circle" | "line" | "arrow" | "text" | "select";

type CanvasState = {
  selectedTool: Tool;
  color: string;
  brushSize: number;
  objects: Record<string, DrawingObject>;
  selectedObjectId: string | null;
  history: Record<string, DrawingObject>[];
  redoStack: Record<string, DrawingObject>[];
  canvasElement: HTMLCanvasElement | null;

  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;

  addObject: (obj: DrawingObject) => void;
  updateObject: (id: string, changes: Partial<DrawingObject["data"]>) => void;
  removeObject: (id: string) => void;
  clearObjects: () => void;

  setSelectedObjectId: (id: string | null) => void;
  setCanvasElement: (el: HTMLCanvasElement | null) => void;

  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
};


export const useCanvasStore = create<CanvasState>((set, get) => ({
  selectedTool: "pen",
  color: "#111111",
  brushSize: 4,
  objects: {},
  selectedObjectId: null,
  history: [],
  redoStack: [],
  canvasElement: null,

  setTool: (tool) => set({ selectedTool: tool }),
  setColor: (color) => set({ color }),
  setBrushSize: (size) => set({ brushSize: size }),

  addObject: (obj) =>
    set((state) => ({ objects: { ...state.objects, [obj.id]: obj } })),

  updateObject: (id, changes) =>
    set((state) => ({
      objects: {
        ...state.objects,
        [id]: { ...state.objects[id], data: { ...state.objects[id]?.data, ...changes } },
      },
    })),

  // removeObject: (id) =>
  //   set((state) => {
  //     const { [id]: _, ...rest } = state.objects;
  //     return { objects: rest };
  //   }),
  removeObject: (id) =>
  set((state) => {
    const rest = { ...state.objects };
    delete rest[id];
    return { objects: rest };
  }),

  clearObjects: () => set({ objects: {} }),

  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
  setCanvasElement: (el) => set({ canvasElement: el }),

  pushHistory: () =>
    set((state) => ({ history: [...state.history, state.objects], redoStack: [] })),

  undo: () => {
    const { history } = get();
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    set((state) => ({
      objects: prev,
      history: state.history.slice(0, -1),
      redoStack: [...state.redoStack, state.objects],
    }));
  },

  redo: () => {
    const { redoStack } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    set((state) => ({
      objects: next,
      redoStack: state.redoStack.slice(0, -1),
      history: [...state.history, state.objects],
    }));
  },
}));
