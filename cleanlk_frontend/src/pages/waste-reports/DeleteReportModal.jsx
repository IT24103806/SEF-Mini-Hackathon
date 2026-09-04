import { useEffect } from "react";
import { AlertTriangleIcon } from "../../components/icons";

export default function DeleteReportModal({
  open,
  reportLabel,
  onCancel,
  onConfirm,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <div
        onClick={onCancel}
        className="absolute inset-0 bg-brand-900/40 animate-[fadeIn_0.18s_ease-out]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="relative w-full max-w-md rounded-card bg-white p-6 shadow-modal animate-[popIn_0.2s_ease-out]"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-clay-50 text-clay-500">
          <AlertTriangleIcon className="h-5 w-5" />
        </span>
        <h2 id="delete-modal-title" className="mt-4 text-xl font-bold text-ink">
          Delete Waste Report?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Are you sure you want to delete this waste report? This action
          cannot be undone.
        </p>
        {reportLabel && (
          <p className="mt-3 rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm font-medium text-ink-soft">
            {reportLabel}
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:border-line-strong hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-clay-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-clay-600"
          >
            Delete Report
          </button>
        </div>
      </div>
    </div>
  );
}
