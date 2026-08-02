"use client";
import {usePresenceStore } from "../../stores/presenceStore";


export function LiveCursors() {
  const cursors = usePresenceStore((s) => s.cursors);

  return (
    <>
      {Object.values(cursors).map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute pointer-events-none transition-all duration-75"
          style={{ left: cursor.x, top: cursor.y }}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cursor.color }} />
          <span
            className="text-xs text-white px-1.5 py-0.5 rounded ml-2"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </span>
        </div>
      ))}
    </>
  );
}