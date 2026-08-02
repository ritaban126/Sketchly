"use client";
import { useState } from "react";
import {createShareLink} from "../../lib/api/boards";


export function ShareButton({ boardId, onConnect }: { boardId: string; onConnect: () => void }) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [collaborating, setCollaborating] = useState(false);

  const handleClick = async () => {
    if (collaborating) return;

    const { shareUrl } = await createShareLink(boardId);
    setShareUrl(shareUrl);

    onConnect();
    setCollaborating(true);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleClick}
        className="min-w-fit rounded-md bg-blue-600 px-4 py-2 font-mono text-[13px] tracking-tight text-white transition-colors hover:bg-blue-700"
      >
        {collaborating ? "Collaborating" : "Collaborate"}
      </button>
      {shareUrl && (
        <input
          readOnly
          value={shareUrl}
          onClick={(e) => e.currentTarget.select()}
          className="text-xs bg-neutral-800 px-2 py-1 rounded w-56"
        />
      )}
    </div>
  );
}