"use client";
import { useState } from "react";
import { usePresenceStore } from "@/stores/presenceStore";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";

export function ChatPanel({
  socket,
}: {
  boardId: string;
  collaborating: boolean;
  socket: ReturnType<typeof useSocket>;
}) {
  const messages = usePresenceStore((s) => s.messages);
  // const { sendChatMessage } = useSocket(boardId, collaborating);
  const { sendChatMessage } = socket;
  const { user } = useAuth();
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    sendChatMessage(text);
    setText("");
  };

  return (
    <div
      className="flex h-full w-72 shrink-0 flex-col border-l bg-white"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className="text-[13px] text-neutral-400">No messages yet — say hi 👋</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.userId === user?.id;

          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {!isMe && (
                <span className="mb-0.5 px-1 text-[11px] font-medium text-neutral-500">{msg.name}</span>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-snug ${
                  isMe
                    ? "rounded-br-sm bg-blue-600 text-white"
                    : "rounded-bl-sm bg-neutral-100 text-black"
                }`}
              >
                {msg.text}
              </div>
              <span className="mt-0.5 px-1 text-[10px] text-neutral-400">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 border-t p-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 rounded-full bg-neutral-100 px-3 py-1.5 text-[13px] text-black outline-none"
        />
        <button
          onClick={handleSend}
          className="rounded-full bg-blue-600 px-4 py-1.5 text-[13px] font-medium text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}