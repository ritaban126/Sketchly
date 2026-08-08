const BASE = process.env.NEXT_PUBLIC_SERVER_URL || "";



export async function createBoard(title: string) {
  const res = await fetch(`${BASE}/api/boards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create board");
  return res.json();
}

export async function listBoards(query?: string) {
  const url = new URL(`${BASE}/api/boards`);
  if (query) url.searchParams.set("query", query);

  const res = await fetch(url.toString(), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch boards");
  return res.json();
}

export async function saveDrawingObject(
  boardId: string,
  object: { type: string; data: Record<string, unknown>; zIndex: number }
) {
  const res = await fetch(`${BASE}/api/boards/${boardId}/objects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(object),
  });
  if (!res.ok) throw new Error("Failed to save drawing object");
  return res.json();
}

export async function getBoard(boardId: string) {
  const res = await fetch(`${BASE}/api/boards/${boardId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch board");
  return res.json();
}

export async function getBoardObjects(boardId: string) {
  const res = await fetch(`${BASE}/api/boards/${boardId}/objects`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch board objects");
  return res.json();
}

export async function renameBoard(boardId: string, title: string) {
  const res = await fetch(`${BASE}/api/boards/${boardId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to rename board");
  return res.json();
}

export async function deleteBoard(boardId: string) {
  const res = await fetch(`${BASE}/api/boards/${boardId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete board");
}

export async function createShareLink(boardId: string) {
  const res = await fetch(`${BASE}/api/boards/${boardId}/share`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create share link");
  return res.json();
}

export async function joinBoard(shareToken: string) {
  const res = await fetch(`${BASE}/api/boards/join/${shareToken}`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to join board");
  return res.json();
}