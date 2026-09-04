// Status and Severity badges, styled as small pills with a colored dot.
// Visual reference: Magic Patterns' components/Badges.tsx

const statusStyles = {
  Reported: "bg-clay-50 text-clay-600 ring-clay-100",
  "In Progress": "bg-amber-50 text-amber-600 ring-amber-100",
  Resolved: "bg-fresh-50 text-fresh-600 ring-fresh-100",
};

const statusDot = {
  Reported: "bg-clay-500",
  "In Progress": "bg-amber-500",
  Resolved: "bg-fresh-500",
};

const severityStyles = {
  High: "bg-clay-50 text-clay-600 ring-clay-100",
  Medium: "bg-amber-50 text-amber-600 ring-amber-100",
  Low: "bg-fresh-50 text-fresh-600 ring-fresh-100",
};

const priorityStyles = {
  URGENT: "bg-clay-500 text-white ring-clay-500",
  HIGH: "bg-amber-50 text-amber-700 ring-amber-200",
  NORMAL: "bg-brand-50 text-brand-700 ring-brand-100",
  RESOLVED: "bg-fresh-50 text-fresh-700 ring-fresh-100",
};

const base =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset";

export function StatusBadge({ status }) {
  return (
    <span className={`${base} ${statusStyles[status] ?? ""}`}>
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${statusDot[status] ?? "bg-gray-400"}`}
      />
      {status}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  return (
    <span className={`${base} ${severityStyles[severity] ?? ""}`}>
      {severity} severity
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`${base} ${priorityStyles[priority] ?? priorityStyles.NORMAL}`}>
      {priority} priority
    </span>
  );
}
