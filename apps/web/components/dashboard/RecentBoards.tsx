"use client";
import { useEffect, useState } from "react";
import {listBoards} from "../../lib/api/boards";
import {BoardCard} from "./BoardCard";


type Board = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  updatedAt: string;
};

export function RecentBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listBoards()
      .then((data) => setBoards(data.boards))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleted = (id: string) => {
    setBoards((prev) => prev.filter((b) => b.id !== id));
  };

  if (loading) return <p className="text-neutral-500">Loading boards...</p>;
  if (boards.length === 0) return <p className="text-neutral-500">No boards yet — create one to get started.</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {boards.map((board) => (
        <BoardCard key={board.id} board={board} onDeleted={handleDeleted} />
      ))}
    </div>
  );
}