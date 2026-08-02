// "use client";
// import { useEffect, useState } from "react";
// import {listHistory, restoreSnapshot} from "../../lib/api/history";
// import {useCanvasStore} from "../../stores/canvasStore";
// import {toast} from "sonner";
// import { DrawingObject } from "@repo/websocket";

// type HistoryEntry = { id: string; createdAt: string; createdBy: string | null };

// export function HistoryPanel({ boardId }: { boardId: string }) {
//   const [history, setHistory] = useState<HistoryEntry[]>([]);
//   const clearObjects = useCanvasStore((s) => s.clearObjects);
//   const addObject = useCanvasStore((s) => s.addObject);

//   useEffect(() => {
//     listHistory(boardId).then((data) => setHistory(data.history));
//   }, [boardId]);

//   const handleRestore = async (historyId: string) => {
//     if (!confirm("Restore this version? Current state will be saved as a safety snapshot.")) return;

//     // const result = await restoreSnapshot(boardId, historyId);
//     // clearObjects();
//     // (result.objects || []).forEach((obj: any) => addObject(obj));
//     // toast("Board restored");
//     const result = await restoreSnapshot(boardId, historyId);
//     clearObjects();
//     (result.objects || []).forEach((obj: DrawingObject) => addObject(obj));
//     toast("Board restored");
//   };

//   return (
//     <div className="p-3 w-72 border-l shrink-0 bg-white overflow-y-auto">
//       <h2 className="font-medium mb-2">Version History</h2>
//       <div className="space-y-2">
//         {history.map((entry) => (
//           <div key={entry.id} className="flex items-center justify-between text-sm">
//             <span>{new Date(entry.createdAt).toLocaleString()}</span>
//             <button onClick={() => handleRestore(entry.id)} className="text-blue-500 text-xs">
//               Restore
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";
import { useEffect, useState } from "react";
import {listHistory, restoreSnapshot} from "../../lib/api/history";
import {useCanvasStore} from "../../stores/canvasStore";
import {toast} from "sonner";
import { DrawingObject } from "@repo/websocket";
import { ConfirmModal } from "../ui/ConfirmModal";

type HistoryEntry = { id: string; createdAt: string; createdBy: string | null };

export function HistoryPanel({ boardId }: { boardId: string }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [pendingRestoreId, setPendingRestoreId] = useState<string | null>(null);
  const clearObjects = useCanvasStore((s) => s.clearObjects);
  const addObject = useCanvasStore((s) => s.addObject);

  useEffect(() => {
    listHistory(boardId).then((data) => setHistory(data.history));
  }, [boardId]);

  const handleRestore = async (historyId: string) => {
    setPendingRestoreId(historyId);
  };

  const confirmRestore = async () => {
    if (!pendingRestoreId) return;

    // const result = await restoreSnapshot(boardId, historyId);
    // clearObjects();
    // (result.objects || []).forEach((obj: any) => addObject(obj));
    // toast("Board restored");
    const result = await restoreSnapshot(boardId, pendingRestoreId);
    clearObjects();
    (result.objects || []).forEach((obj: DrawingObject) => addObject(obj));
    toast("Board restored");
    setPendingRestoreId(null);
  };

  return (
    <div className="p-3 w-72 border-l shrink-0 bg-white overflow-y-auto">
      <h2 className="font-medium mb-2">Version History</h2>
      <div className="space-y-2">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between text-sm"
            style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}
          >
            <span>{new Date(entry.createdAt).toLocaleString()}</span>
            <button onClick={() => handleRestore(entry.id)} className="text-blue-500 text-xs">
              Restore
            </button>
          </div>
        ))}
      </div>

      <ConfirmModal
        open={!!pendingRestoreId}
        title="Restore this version?"
        message="Current state will be saved as a safety snapshot."
        confirmLabel="Restore"
        onConfirm={confirmRestore}
        onCancel={() => setPendingRestoreId(null)}
        style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}
      />
    </div>
  );
}