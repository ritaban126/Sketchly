"use client";

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  style,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  style?: React.CSSProperties;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl" style={style}>
        <h2 className="text-[16px] font-semibold text-[#15172B]">{title}</h2>
        <p className="mt-2 text-[13px] text-neutral-500">{message}</p>

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
              onConfirm();
            }}
            className="rounded-md bg-red-600 px-3 py-1.5 text-[13px] font-medium text-white hover:bg-red-700"
            style={{ fontFamily: 'Inter, Arial, sans-serif', fontSize: '17px' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}