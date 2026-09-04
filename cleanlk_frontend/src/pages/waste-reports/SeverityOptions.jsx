import { CheckIcon } from "../../components/icons";

const options = [
  {
    value: "Low",
    hint: "Minor issue",
    selected: "border-fresh-500 bg-fresh-50 ring-1 ring-fresh-500",
    dot: "bg-fresh-500",
  },
  {
    value: "Medium",
    hint: "Needs attention",
    selected: "border-amber-500 bg-amber-50 ring-1 ring-amber-500",
    dot: "bg-amber-500",
  },
  {
    value: "High",
    hint: "Urgent issue",
    selected: "border-clay-500 bg-clay-50 ring-1 ring-clay-500",
    dot: "bg-clay-500",
  },
];

export default function SeverityOptions({ value, onChange, invalid }) {
  return (
    <div
      role="radiogroup"
      aria-label="Severity"
      className={`grid gap-3 sm:grid-cols-3 ${
        invalid ? "rounded-2xl ring-1 ring-clay-100" : ""
      }`}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(option.value)}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-colors duration-150 ${
              isSelected
                ? option.selected
                : "border-line bg-white hover:border-line-strong"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 flex-none rounded-full ${option.dot}`}
              />
              <span>
                <span className="block text-sm font-semibold text-ink">
                  {option.value}
                </span>
                <span className="block text-xs text-ink-muted">
                  {option.hint}
                </span>
              </span>
            </span>
            {isSelected && (
              <CheckIcon
                className="h-4 w-4 flex-none text-ink-soft"
                strokeWidth={3}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
