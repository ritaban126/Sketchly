// "use client";
// import { useState } from "react";
// import {ShareButton} from "./ShareButton";
// import {requestExport} from "../../lib/api/files";
// import { toast } from "sonner";


// export function BoardHeader({
//   boardId,
//   title,
//   onCollaborate,
// }: {
//   boardId: string;
//   title: string;
//   onCollaborate: () => void;
// }) {
//   const [exporting, setExporting] = useState(false);

//   const handleExport = async (format: "png" | "pdf") => {
//     setExporting(true);
//     try {
//       await requestExport(boardId, format);
//       toast(`Export requested — you'll be notified when it's ready`);
//     } catch {
//       toast.error("Export failed");
//     } finally {
//       setExporting(false);
//     }
//   };

//   return (
//     <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-2 border-b bg-neutral-950 p-3">
//       <h1 className="font-medium text-neutral-100">{title}</h1>

//       <div className="flex flex-wrap items-center gap-2">
//         <button
//           type="button"
//           onClick={() => handleExport("png")}
//           disabled={exporting}
//           className="min-w-fit rounded bg-neutral-800 px-3 py-1.5 text-sm text-neutral-100 hover:bg-neutral-700"
//         >
//           Export PNG
//         </button>
//         <button
//           type="button"
//           onClick={() => handleExport("pdf")}
//           disabled={exporting}
//           className="min-w-fit rounded bg-neutral-800 px-3 py-1.5 text-sm text-neutral-100 hover:bg-neutral-700"
//         >
//           Export PDF
//         </button>
//         <ShareButton boardId={boardId} onConnect={onCollaborate} />
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShareButton } from "./ShareButton";
import { requestExport } from "@/lib/api/files";
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

  const handleExport = async (format: "png" | "pdf") => {
    setExporting(true);
    try {
      await requestExport(boardId, format);
      toast(`Export requested — you'll be notified when it's ready`);
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
          onClick={() => handleExport("png")}
          disabled={exporting}
          className="min-w-fit rounded-md bg-neutral-800 px-4 py-2 font-mono text-[13px] tracking-tight text-neutral-100 transition-colors hover:bg-neutral-700"
        >
          Export PNG
        </button>
        <button
          type="button"
          onClick={() => handleExport("pdf")}
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