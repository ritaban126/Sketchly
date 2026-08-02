"use client";
import {usePresenceStore} from "../../stores/presenceStore";


export function PresenceBar() {
  const onlineUsers = usePresenceStore((s) => s.onlineUsers);
  const users = Object.values(onlineUsers);

  if (users.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2 p-2">
      {users.map((user) => (
        <div
          key={user.userId}
          title={user.name}
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-neutral-950"
          style={{ backgroundColor: user.color }}
        >
          {user.name.charAt(0).toUpperCase()}
        </div>
      ))}
    </div>
  );
}