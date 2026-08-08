const BASE = process.env.NEXT_PUBLIC_SERVER_URL || "";

export async function listHistory(boardId: string) {
  const res = await fetch(`${BASE}/api/boards/${boardId}/history`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function saveSnapshot(boardId: string) {
  const res = await fetch(`${BASE}/api/boards/${boardId}/history`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to save snapshot");
  return res.json();
}

export async function restoreSnapshot(boardId: string, historyId: string) {
  const res = await fetch(`${BASE}/api/boards/${boardId}/history/${historyId}/restore`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to restore snapshot");
  return res.json();
}