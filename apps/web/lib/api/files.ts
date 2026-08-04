const BASE = process.env.NEXT_PUBLIC_SERVER_URL;



export async function uploadImage(boardId: string, file: File) {
  const formData = new FormData();
  formData.append("boardId", boardId);
  formData.append("file", file);

  const res = await fetch(`${BASE}/api/files/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload image");
  return res.json();
}

export async function importPdf(boardId: string, file: File) {
  const formData = new FormData();
  formData.append("boardId", boardId);
  formData.append("file", file);

  const res = await fetch(`${BASE}/api/files/import-pdf`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to import PDF");
  return res.json();
}

export async function uploadExport(boardId: string, blob: Blob, format: "png" | "pdf") {
  const formData = new FormData();
  formData.append("boardId", boardId);
  formData.append("format", format);
  formData.append("file", blob, `export.${format === "png" ? "png" : "png"}`);

  const res = await fetch(`${BASE}/api/files/export-upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload export");
  return res.json();
}

export async function getFileStatus(fileId: string) {
  const res = await fetch(`${BASE}/api/files/${fileId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch file status");
  return res.json();
}
