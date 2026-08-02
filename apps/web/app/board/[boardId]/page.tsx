"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useBoard } from "@/hooks/useBoard";
import { BoardHeader } from "@/components/board/BoardHeader";
import { Toolbar } from "@/components/canvas/Toolbar";
import { PresenceBar } from "@/components/presence/PresenceBar";
import { Canvas } from "@/components/canvas/Canvas";
import { LiveCursors } from "@/components/canvas/LiveCursors";
import { ChatPanel } from "@/components/board/ChatPanel";
import { HistoryPanel } from "@/components/board/HistoryPanel";
import { saveSnapshot } from "@/lib/api/history";

export default function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>();
  const { board, loading, error } = useBoard(boardId);
  const [collaborating, setCollaborating] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    return () => {
      saveSnapshot(boardId).catch((err) => console.error("Snapshot on leave failed:", err));
    };
  }, [boardId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading board...</div>;
  if (error || !board) return <div className="min-h-screen flex items-center justify-center">Board not found.</div>;

  const handleToggleHistory = () => {
    setShowHistory((v) => !v);
    setShowChat(false); // dono ek saath khule to overlap hoga, isliye ek dusre ko band karo
  };

  const handleToggleChat = () => {
    setShowChat((v) => !v);
    setShowHistory(false);
  };

  return (
    <div className="flex flex-col h-screen relative">
      <BoardHeader
        boardId={boardId}
        title={board.title}
        onCollaborate={() => setCollaborating(true)}
        showHistory={showHistory}
        onToggleHistory={handleToggleHistory}
      />

      <div className="flex justify-between items-center px-3 shrink-0 overflow-x-auto">
        <Toolbar />
        <div className="flex items-center gap-3 shrink-0">
          <PresenceBar />
          <button onClick={handleToggleChat} className="text-sm text-neutral-400 whitespace-nowrap">
            {showChat ? "Hide chat" : "Chat"}
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex overflow-hidden min-h-0">
        <div className="relative flex-1 min-h-0 min-w-0">
          <Canvas boardId={boardId} collaborating={collaborating} />
          <LiveCursors />
        </div>

        {showHistory && <HistoryPanel boardId={boardId} />}
        {showChat && <ChatPanel boardId={boardId} collaborating={collaborating} />}
      </div>
    </div>
  );
}
