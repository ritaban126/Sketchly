
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { joinBoard } from "@/lib/api/boards";
import { useAuth } from "@/hooks/useAuth";

export default function JoinBoardPage() {
  const router = useRouter();
  const { shareToken } = useParams<{ shareToken: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(`/login?redirect=/join/${shareToken}`);
      return;
    }

    joinBoard(shareToken)
      .then(({ boardId }) => router.replace(`/board/${boardId}`))
      .catch(() => setError("This invite link is invalid or has expired."));
  }, [shareToken, isAuthenticated, isLoading, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-lg font-medium">{error}</p>
          <button onClick={() => router.push("/dashboard")} className="mt-4 text-blue-500 underline">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-neutral-500">Joining board...</p>
    </div>
  );
}