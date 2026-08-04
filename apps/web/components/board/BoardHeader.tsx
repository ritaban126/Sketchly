"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShareButton } from "./ShareButton";
import { uploadExport } from "@/lib/api/files";
import { useCanvasStore } from "@/stores/canvasStore";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export function BoardHeader({
  boardId,
  title,
  onCollaborate,
  showHistory,
  onToggleHistory,
}: {
  boardId: string;
  title: string;
  onCollaborate: () => void;
  showHistory: boolean;
  onToggleHistory: () => void;
}) {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const canvasElement = useCanvasStore((s) => s.canvasElement);

  const getCanvasBlob = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!canvasElement) return reject(new Error("Canvas not ready"));
      canvasElement.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to capture canvas"));
      }, "image/png");
    });
  };

  const handleExportPng = async () => {
    setExporting(true);
    try {
      const blob = await getCanvasBlob();

      // 1. Turant local download
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${title || "board"}.png`;
      a.click();
      URL.revokeObjectURL(downloadUrl);

      toast("PNG downloaded!");

      // 2. Cloudinary pe bhi save karo — fail ho to bhi download success maano
      try {
        await uploadExport(boardId, blob, "png");
      } catch {
        console.warn("Cloud backup upload failed, but download succeeded");
      }
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      const blob = await getCanvasBlob();
      const imageUrl = URL.createObjectURL(blob);

      // Browser ka native print dialog — user "Save as PDF" choose kar sakta hai
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>${title}</title></head>
            <body style="margin:0">
              <img src="${imageUrl}" style="width:100%" />
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
        };
      }

      toast("Print dialog opened — choose 'Save as PDF'");

      // Cloudinary pe bhi PNG version save karo — fail ho to bhi print dialog success maano
      try {
        await uploadExport(boardId, blob, "pdf");
      } catch {
        console.warn("Cloud backup upload failed, but print dialog opened successfully");
      }
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b bg-neutral-950 p-3"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/dashboard")} className="text-neutral-400 transition-colors hover:text-white">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-medium text-neutral-100">{title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleHistory}
          className={`min-w-fit rounded-md px-4 py-2 font-mono text-[13px] tracking-tight transition-colors ${
            showHistory ? "bg-blue-600 text-white" : "bg-neutral-800 text-neutral-100 hover:bg-neutral-700"
          }`}
        >
          History
        </button>
        <button
          type="button"
          onClick={handleExportPng}
          disabled={exporting}
          className="min-w-fit rounded-md bg-neutral-800 px-4 py-2 font-mono text-[13px] tracking-tight text-neutral-100 transition-colors hover:bg-neutral-700"
        >
          Export PNG
        </button>
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={exporting}
          className="min-w-fit rounded-md bg-neutral-800 px-4 py-2 font-mono text-[13px] tracking-tight text-neutral-100 transition-colors hover:bg-neutral-700"
        >
          Export PDF
        </button>
        <ShareButton boardId={boardId} onConnect={onCollaborate} />
      </div>
    </div>
  );
}