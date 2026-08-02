"use client";
import { useState } from "react";

export function PromptModal({
  open,
  title,
  defaultValue = "",
  confirmLabel = "Save",
  onConfirm,
  onCancel,
  style,
}: {
  open: boolean;
  title: string;
  defaultValue?: string;
  confirmLabel?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  style?: React.CSSProperties;
}) {
  if (!open) return null;

  return (
    <PromptModalInner
      title={title}
      defaultValue={defaultValue}
      confirmLabel={confirmLabel}
      onConfirm={onConfirm}
      onCancel={onCancel}
      style={style}
    />
  );
}

function PromptModalInner({
  title,
  defaultValue,
  confirmLabel,
  onConfirm,
  onCancel,
  style,
}: {
  title: string;
  defaultValue: string;
  confirmLabel: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  style?: React.CSSProperties;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl" style={style}>
        <h2 className="text-[16px] font-semibold text-[#15172B]">{title}</h2>

        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && value.trim() && onConfirm(value)}
          className="mt-3 w-full rounded-md border border-[#E7E3D8] px-3 py-2 text-[13px] text-[#15172B] outline-none focus:border-[#15172B]/40"
          style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="rounded-md px-3 py-1.5 text-[13px] text-neutral-600 hover:bg-neutral-100"
            style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}
          >
            Cancel
          </button>
          <button
           onClick={(e) => {
              e.stopPropagation();
              if (value.trim()) onConfirm(value);
            }}
            className="rounded-md bg-[#15172B] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[#232640]"
            style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}