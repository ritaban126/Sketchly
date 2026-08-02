// "use client";

// import React, { useEffect, useState } from "react";
// import { useStore } from "@nanostores/react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import {client} from "@/lib/auth-client";
// import Image from "next/image";
// import {
//   ChevronDown,
//   LayoutDashboard,
//   Search,
//   ArrowUpDown,
//   LayoutGrid,
//   List,
//   MoreHorizontal,
//   Plus,
// } from "lucide-react";
// import { createBoard, deleteBoard, listBoards, renameBoard } from "@/lib/api/boards";

// /* ---------------------------------------------------------
//   Types
// --------------------------------------------------------- */

// interface Board {
//   id: string;
//   title: string;
//   thumbnailUrl: string | null;
//   updatedAt: string;
//   role: string;
// }

// /* ---------------------------------------------------------
//   Navbar
// --------------------------------------------------------- */

// interface DashboardNavbarProps {
//   userName: string;
//   boardCount: number;
// }

// function DashboardNavbar({ userName, boardCount }: DashboardNavbarProps) {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const initials = userName
//     .split(" ")
//     .map((n) => n[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

//   return (
//     <header className="sticky top-0 z-50 border-b border-[#E7E3D8] bg-[#FAF9F4]/90 backdrop-blur-md">
//       <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
//         <Link href="/" className="flex items-center gap-2">
//           <span
//             className="text-2xl leading-none text-[#15172B]"
//             style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
//           >
//             sketchly
//           </span>
//           <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6B57]" />
//         </Link>

//         <div className="flex items-center gap-4">
//           <div className="hidden items-center gap-1.5 rounded-full border border-[#E7E3D8] bg-white px-3 py-1.5 font-mono text-[12px] text-[#5B5D6E] sm:flex">
//             <LayoutDashboard className="h-3.5 w-3.5 text-[#1FADA0]" strokeWidth={1.75} />
//             {boardCount} boards
//           </div>

//           <span className="hidden h-6 w-px bg-[#E7E3D8] sm:block" />

//           <button
//             onClick={() => setMenuOpen((v) => !v)}
//             className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-[#F0EEE5]"
//           >
//             <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#15172B] text-[12px] font-semibold text-[#FAF9F4]">
//               {initials}
//             </span>
//             <span className="hidden text-left leading-tight sm:block">
//               <span className="block text-[11px] text-[#9C9A8E]">Welcome back</span>
//               <span className="block text-[13px] font-medium text-[#15172B]">{userName}</span>
//             </span>
//             <ChevronDown className={`h-3.5 w-3.5 text-[#9C9A8E] transition-transform ${menuOpen ? "rotate-180" : ""}`} />
//           </button>
//         </div>
//       </nav>
//     </header>
//   );
// }

// /* ---------------------------------------------------------
//   Search + filters toolbar
// --------------------------------------------------------- */

// function BoardsToolbar({
//   query,
//   setQuery,
//   view,
//   setView,
//   recentOnly,
//   setRecentOnly,
// }: {
//   query: string;
//   setQuery: (q: string) => void;
//   view: "grid" | "list";
//   setView: (v: "grid" | "list") => void;
//   recentOnly: boolean;
//   setRecentOnly: (v: boolean) => void;
// }) {
//   return (
//     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//       <div className="relative w-full sm:max-w-sm">
//         <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9C9A8E]" />
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search whiteboards..."
//           className="w-full rounded-full border border-[#E7E3D8] bg-white py-2.5 pl-10 pr-4 text-[#15172B] outline-none placeholder:text-[#9C9A8E] focus:border-[#15172B]/30"
//           style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '15px' }}
//         />
//       </div>

//       <div className="flex items-center gap-2">
//         <button
//           onClick={() => setRecentOnly(true)}
//           className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] transition-colors ${recentOnly ? "border-[#15172B] bg-[#15172B] text-[#FAF9F4]" : "border-[#E7E3D8] bg-white text-[#5B5D6E] hover:bg-[#F0EEE5]"}`}
//           style={{ fontFamily: 'Inter, Arial, sans-serif' }}
//         >
//           <ArrowUpDown className="h-3.5 w-3.5" />
//           Recent
//         </button>

//         <div className="flex items-center gap-0.5 rounded-full border border-[#E7E3D8] bg-white p-1">
//           <button
//             onClick={() => setView("grid")}
//             aria-label="Grid view"
//             className={`rounded-full p-1.5 transition-colors ${view === "grid" ? "bg-[#15172B] text-[#FAF9F4]" : "text-[#9C9A8E] hover:bg-[#F0EEE5]"}`}
//           >
//             <LayoutGrid className="h-3.5 w-3.5" />
//           </button>
//           <button
//             onClick={() => setView("list")}
//             aria-label="List view"
//             className={`rounded-full p-1.5 transition-colors ${view === "list" ? "bg-[#15172B] text-[#FAF9F4]" : "text-[#9C9A8E] hover:bg-[#F0EEE5]"}`}
//           >
//             <List className="h-3.5 w-3.5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------------------
//   New board (blank, "+") card — now actually creates a board
// --------------------------------------------------------- */

// function NewBoardCard({ onCreated }: { onCreated: (board: Board) => void }) {
//   const router = useRouter();
//   const [creating, setCreating] = useState(false);

//   const handleClick = async () => {
//     if (creating) return;
//     setCreating(true);
//     try {
//       const board = await createBoard("Untitled Board");
//       onCreated(board); // adds it to the Recent Boards list immediately
//       router.push(`/board/${board.id}`); // then navigate into it
//     } finally {
//       setCreating(false);
//     }
//   };

//   return (
//     <button
//       onClick={handleClick}
//       disabled={creating}
//       className="group flex h-full min-h-59 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#E7E3D8] bg-white/60 transition-colors hover:border-[#FF6B57]/50 hover:bg-white"
//     >
//       <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#15172B] text-[#FAF9F4] transition-transform group-hover:scale-110">
//         <Plus className="h-5 w-5" strokeWidth={2.25} />
//       </span>
//       <span
//         className="font-medium text-[#5B5D6E] group-hover:text-[#15172B]"
//         style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}
//       >
//         {creating ? "Creating..." : "Create new board"}
//       </span>
//     </button>
//   );
// }

// /* ---------------------------------------------------------
//    Board card — real data + rename/delete
// --------------------------------------------------------- */

// function BoardCard({ board, onDeleted }: { board: Board; onDeleted: (id: string) => void }) {
//   const router = useRouter();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const timeAgo = new Intl.DateTimeFormat("en-US", {
//     month: "numeric",
//     day: "numeric",
//     year: "numeric",
//   }).format(new Date(board.updatedAt));

//   const handleRename = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     const newTitle = prompt("New board title:", board.title);
//     if (!newTitle) return;
//     await renameBoard(board.id, newTitle);
//     window.location.reload(); // simple refresh; can be replaced with local state update
//   };

//   const handleDelete = async (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (!confirm(`Delete "${board.title}"?`)) return;
//     await deleteBoard(board.id);
//     onDeleted(board.id);
//   };

//   return (
//     <div
//       onClick={() => router.push(`/board/${board.id}`)}
//       className="group cursor-pointer overflow-hidden rounded-2xl border border-[#E7E3D8] bg-white transition-shadow hover:shadow-[0_12px_30px_-14px_rgba(21,23,43,0.2)]"
//     >
//       <div
//         className="relative h-36 w-full overflow-hidden"
//         style={{
//           backgroundImage: `radial-gradient(#ffffff55 1px, transparent 1px), linear-gradient(135deg, #FF6B5722, #FF6B5755)`,
//           backgroundSize: "16px 16px, cover",
//         }}
//       >
//         {board.thumbnailUrl && (
//           // <Image src={board.thumbnailUrl} alt={board.title} className="absolute inset-0 w-full h-full object-cover" />
//           <Image src={board.thumbnailUrl} alt={board.title} className="object-cover"/>
//         )}
//       </div>

//       <div className="p-4">
//         <div className="flex items-start justify-between gap-2">
//           <div>
//             <h3 className="font-semibold text-[#15172B]" style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}>{board.title}</h3>
//             <p className="mt-0.5 text-[#9C9A8E]" style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '13px' }}>Updated {timeAgo}</p>
//           </div>
//           <button
//             onClick={(e) => {
//               e.stopPropagation();
//               setMenuOpen((v) => !v);
//             }}
//             aria-label="Board options"
//             className="rounded-md p-1 text-[#9C9A8E] opacity-0 transition-opacity hover:bg-[#F0EEE5] hover:text-[#15172B] group-hover:opacity-100"
//           >
//             <MoreHorizontal className="h-4 w-4" />
//           </button>
//         </div>

//         {menuOpen && (
//           <div className="mt-2 flex gap-3">
//             <button
//               onClick={handleRename}
//               className="text-[#1FADA0]"
//               style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '14px' }}
//             >
//               Rename
//             </button>
//             <button
//               onClick={handleDelete}
//               className="text-red-500"
//               style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '14px' }}
//             >
//               Delete
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ---------------------------------------------------------
//   Page
// --------------------------------------------------------- */

// export default function DashboardPage() {
//   const session = useStore(client.useSession);
//   const userName = session?.data?.user?.name ?? "";
//   const [boards, setBoards] = useState<Board[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [query, setQuery] = useState("");
//   const [view, setView] = useState<"grid" | "list">("grid");
//   const [recentOnly, setRecentOnly] = useState(true);

//   const handleQueryChange = (nextQuery: string) => {
//     setLoading(true);
//     setQuery(nextQuery);
//   };

//   useEffect(() => {
//     listBoards(query)
//       .then((data) => setBoards(data.boards))
//       .finally(() => setLoading(false));
//   }, [query]);

//   const handleCreated = (board: Board) => {
//     setBoards((prev) => [board, ...prev]); // new board appears in Recent Boards instantly
//   };

//   const handleDeleted = (id: string) => {
//     setBoards((prev) => prev.filter((b) => b.id !== id));
//   };

//   const visibleBoards = [...boards].sort((a, b) => {
//     const timeA = new Date(a.updatedAt).getTime();
//     const timeB = new Date(b.updatedAt).getTime();
//     return recentOnly ? timeB - timeA : timeA - timeB;
//   });

//   return (
//     <div className="min-h-screen w-full bg-[#FAF9F4] text-[#15172B]">
//       <DashboardNavbar userName={userName || "...."} boardCount={boards.length} />

//       <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
//         <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
//           <div>
//             <h1 className="font-semibold tracking-tight" style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '30px' }}>My Whiteboards</h1>
//             <p className="mt-1 text-[#5B5D6E]" style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}>Manage your collaborative boards and templates</p>
//           </div>
//           <div className="flex items-center gap-1.5 font-mono text-[#9C9A8E]" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
//             {boards.length} boards
//             <span className="mx-1 h-1.5 w-1.5 rounded-full bg-[#1FADA0]" />
//             All synced
//           </div>
//         </div>

//         <BoardsToolbar
//           query={query}
//           setQuery={handleQueryChange}
//           view={view}
//           setView={setView}
//           recentOnly={recentOnly}
//           setRecentOnly={setRecentOnly}
//         />

//         <section className="mt-9">
//           <div className="mb-4 flex items-center justify-between">
//             <h2
//               className="text-[18px] font-semibold"
//               style={{ fontFamily: "'Caveat', cursive", fontSize: "30px", fontWeight: 700 }}
//             >
//               Recent Boards
//             </h2>
//           </div>

//           {loading ? (
//             <p className="text-[#9C9A8E]">Loading boards...</p>
//           ) : (
//             <div className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
//               {view === "grid" && <NewBoardCard onCreated={handleCreated} />}
//               {visibleBoards.map((board) => (
//                 <BoardCard key={board.id} board={board} onDeleted={handleDeleted} />
//               ))}
//               {view === "list" && <NewBoardCard onCreated={handleCreated} />}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {client} from "@/lib/auth-client";
import Image from "next/image";
import {
  ChevronDown,
  LayoutDashboard,
  Search,
  ArrowUpDown,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import { createBoard, deleteBoard, listBoards, renameBoard } from "@/lib/api/boards";
import { useDebounce } from "@/hooks/useDebounce";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PromptModal } from "@/components/ui/PromptModal";

/* ---------------------------------------------------------
  Types
--------------------------------------------------------- */

interface Board {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  updatedAt: string;
  role: string;
}

/* ---------------------------------------------------------
  Navbar
--------------------------------------------------------- */

interface DashboardNavbarProps {
  userName: string;
  boardCount: number;
}

function DashboardNavbar({ userName, boardCount }: DashboardNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-[#E7E3D8] bg-[#FAF9F4]/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="text-2xl leading-none text-[#15172B]"
            style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
          >
            sketchly
          </span>
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FF6B57]" />
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-1.5 rounded-full border border-[#E7E3D8] bg-white px-3 py-1.5 font-mono text-[12px] text-[#5B5D6E] sm:flex">
            <LayoutDashboard className="h-3.5 w-3.5 text-[#1FADA0]" strokeWidth={1.75} />
            {boardCount} boards
          </div>

          <span className="hidden h-6 w-px bg-[#E7E3D8] sm:block" />

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-[#F0EEE5]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#15172B] text-[12px] font-semibold text-[#FAF9F4]">
              {initials}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[11px] text-[#9C9A8E]">Welcome back</span>
              <span className="block text-[13px] font-medium text-[#15172B]">{userName}</span>
            </span>
            <ChevronDown className={`h-3.5 w-3.5 text-[#9C9A8E] transition-transform ${menuOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </nav>
    </header>
  );
}

/* ---------------------------------------------------------
  Search + filters toolbar
--------------------------------------------------------- */

function BoardsToolbar({
  query,
  setQuery,
  view,
  setView,
  recentOnly,
  setRecentOnly,
}: {
  query: string;
  setQuery: (q: string) => void;
  view: "grid" | "list";
  setView: (v: "grid" | "list") => void;
  recentOnly: boolean;
  setRecentOnly: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9C9A8E]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search whiteboards..."
          className="w-full rounded-full border border-[#E7E3D8] bg-white py-2.5 pl-10 pr-4 text-[#15172B] outline-none placeholder:text-[#9C9A8E] focus:border-[#15172B]/30"
          style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '15px' }}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setRecentOnly(true)}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] transition-colors ${recentOnly ? "border-[#15172B] bg-[#15172B] text-[#FAF9F4]" : "border-[#E7E3D8] bg-white text-[#5B5D6E] hover:bg-[#F0EEE5]"}`}
          style={{ fontFamily: 'Inter, Arial, sans-serif' }}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          Recent
        </button>

        <div className="flex items-center gap-0.5 rounded-full border border-[#E7E3D8] bg-white p-1">
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`rounded-full p-1.5 transition-colors ${view === "grid" ? "bg-[#15172B] text-[#FAF9F4]" : "text-[#9C9A8E] hover:bg-[#F0EEE5]"}`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={`rounded-full p-1.5 transition-colors ${view === "list" ? "bg-[#15172B] text-[#FAF9F4]" : "text-[#9C9A8E] hover:bg-[#F0EEE5]"}`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
  New board (blank, "+") card — now actually creates a board
--------------------------------------------------------- */

function NewBoardCard({ onCreated }: { onCreated: (board: Board) => void }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const handleClick = async () => {
    if (creating) return;
    setCreating(true);
    try {
      const board = await createBoard("Untitled Board");
      onCreated(board);
      router.push(`/board/${board.id}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={creating}
      className="group flex h-full min-h-59 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#E7E3D8] bg-white/60 transition-colors hover:border-[#FF6B57]/50 hover:bg-white"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#15172B] text-[#FAF9F4] transition-transform group-hover:scale-110">
        <Plus className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span
        className="font-medium text-[#5B5D6E] group-hover:text-[#15172B]"
        style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}
      >
        {creating ? "Creating..." : "Create new board"}
      </span>
    </button>
  );
}

/* ---------------------------------------------------------
  Board card — real data + rename/delete
--------------------------------------------------------- */

function BoardCard({ board, onDeleted }: { board: Board; onDeleted: (id: string) => void }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRename, setShowRename] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const timeAgo = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(new Date(board.updatedAt));

  const confirmRename = async (newTitle: string) => {
    await renameBoard(board.id, newTitle);
    setShowRename(false);
    window.location.reload();
  };

  const confirmDelete = async () => {
    await deleteBoard(board.id);
    setShowDeleteConfirm(false);
    onDeleted(board.id);
  };

  return (
    <div
      onClick={() => router.push(`/board/${board.id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-[#E7E3D8] bg-white transition-shadow hover:shadow-[0_12px_30px_-14px_rgba(21,23,43,0.2)]"
    >
      <div
        className="relative h-36 w-full overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(#ffffff55 1px, transparent 1px), linear-gradient(135deg, #FF6B5722, #FF6B5755)`,
          backgroundSize: "16px 16px, cover",
        }}
      >
        {board.thumbnailUrl && (
          <Image src={board.thumbnailUrl} alt={board.title} fill className="object-cover" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-[#15172B]" style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}>{board.title}</h3>
            <p className="mt-0.5 text-[#9C9A8E]" style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '13px' }}>Updated {timeAgo}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((v) => !v);
            }}
            aria-label="Board options"
            className="rounded-md p-1 text-[#9C9A8E] opacity-0 transition-opacity hover:bg-[#F0EEE5] hover:text-[#15172B] group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {menuOpen && (
          <div className="mt-2 flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowRename(true);
              }}
              className="text-[#1FADA0]"
              style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '14px' }}
            >
              Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="text-red-500"
              style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '14px' }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <PromptModal
        open={showRename}
        title="Rename board"
        defaultValue={board.title}
        confirmLabel="Rename"
        onConfirm={confirmRename}
        onCancel={() => setShowRename(false)}
        style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}
      />

      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete this board?"
        message={`"${board.title}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}
      />
    </div>
  );
}

/* ---------------------------------------------------------
  Page
--------------------------------------------------------- */

export default function DashboardPage() {
  const session = useStore(client.useSession);
  const userName = session?.data?.user?.name ?? "";
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [recentOnly, setRecentOnly] = useState(true);

  const handleQueryChange = (nextQuery: string) => {
    setLoading(true);
    setQuery(nextQuery);
  };

  useEffect(() => {
    let cancelled = false;

    listBoards(debouncedQuery)
      .then((data) => {
        if (!cancelled) {
          setBoards(data.boards);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBoards([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const handleCreated = (board: Board) => {
    setBoards((prev) => [board, ...prev]);
  };

  const handleDeleted = (id: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== id));
  };

  const visibleBoards = [...boards].sort((a, b) => {
    const timeA = new Date(a.updatedAt).getTime();
    const timeB = new Date(b.updatedAt).getTime();
    return recentOnly ? timeB - timeA : timeA - timeB;
  });

  return (
    <div className="min-h-screen w-full bg-[#FAF9F4] text-[#15172B]">
      <DashboardNavbar userName={userName || "...."} boardCount={boards.length} />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-semibold tracking-tight" style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '30px' }}>My Whiteboards</h1>
            <p className="mt-1 text-[#5B5D6E]" style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}>Manage your collaborative boards and templates</p>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[#9C9A8E]" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
            {boards.length} boards
            <span className="mx-1 h-1.5 w-1.5 rounded-full bg-[#1FADA0]" />
            All synced
          </div>
        </div>

        <BoardsToolbar
          query={query}
          setQuery={handleQueryChange}
          view={view}
          setView={setView}
          recentOnly={recentOnly}
          setRecentOnly={setRecentOnly}
        />

        <section className="mt-9">
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="text-[18px] font-semibold"
              style={{ fontFamily: "'Caveat', cursive", fontSize: "30px", fontWeight: 700 }}
            >
              Recent Boards
            </h2>
          </div>

          {loading ? (
            <p className="text-[#9C9A8E]">Loading boards...</p>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
              {view === "grid" && <NewBoardCard onCreated={handleCreated} />}
              {visibleBoards.map((board) => (
                <BoardCard key={board.id} board={board} onDeleted={handleDeleted} />
              ))}
              {view === "list" && <NewBoardCard onCreated={handleCreated} />}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}