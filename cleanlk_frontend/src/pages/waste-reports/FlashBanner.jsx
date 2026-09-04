import { useEffect } from "react";
import { CheckIcon, XIcon } from "../../components/icons";

export default function FlashBanner({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-6 flex items-start gap-3 rounded-card border border-fresh-100 bg-fresh-50 px-4 py-3.5 animate-[fadeIn_0.2s_ease-out]"
    >
      <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-fresh-500 text-white">
        <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      <p className="flex-1 text-sm font-medium text-brand-700">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss message"
        className="text-brand-600/70 transition-colors duration-150 hover:text-brand-700"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
