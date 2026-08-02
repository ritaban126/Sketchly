"use client";

import { deleteBoard, renameBoard } from "@/lib/api/boards";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";


type Board = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  updatedAt: string;
};

export function BoardCard({ board, onDeleted }: { board: Board; onDeleted: (id: string) => void }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(new Date(board.updatedAt));

  const handleRename = async () => {
    const newTitle = prompt("New board title:", board.title);
    if (!newTitle) return;
    await renameBoard(board.id, newTitle);
    toast("Board renamed");
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${board.title}"?`)) return;
    await deleteBoard(board.id);
    onDeleted(board.id);
    toast("Board deleted");
  };

  return (
    <div
      className="relative border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg"
      onClick={() => router.push(`/board/${board.id}`)}
    >
      <div className="h-32 bg-neutral-800 relative">
    {board.thumbnailUrl && (
      <Image
        src={board.thumbnailUrl}
        alt={`${board.title} thumbnail`}
        fill
        className="object-cover"
      />
      )}
    </div>

      <div className="p-3 flex justify-between items-center">
        <div>
          <p className="font-medium">{board.title}</p>
          <p className="text-xs text-neutral-500">{formattedDate}</p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
        >
          ⋮
        </button>
      </div>

      {menuOpen && (
        <div
          className="absolute right-2 top-10 bg-white border rounded shadow-md z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleRename}
            className="block w-full text-left px-4 py-2 hover:bg-neutral-100"
          >
            Rename
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="block w-full text-left px-4 py-2 hover:bg-neutral-100 text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}