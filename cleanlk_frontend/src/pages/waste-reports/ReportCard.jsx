import { Link } from "react-router-dom";
import {
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
  Trash2Icon,
} from "../../components/icons";
import { PriorityBadge, StatusBadge, SeverityBadge } from "./Badges";
import { formatReportDate } from "../../utils/format";

export default function ReportCard({ report, onDelete }) {
  return (
    <article className="group flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-card transition-[box-shadow,transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[17px] font-bold leading-snug text-ink">
            {report.issueType}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPinIcon className="h-4 w-4 flex-none text-brand-500" />
            {report.area}
          </p>
        </div>
        <span className="flex-none text-xs font-semibold text-ink-faint">
          {report.id}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={report.status} />
        <SeverityBadge severity={report.severity} />
        <PriorityBadge priority={report.priority} />
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-soft">
        {report.description}
      </p>

      {report.similarReportCount > 0 && (
        <p className="mt-3 text-xs font-semibold text-amber-700">
          {report.similarReportCount} similar {report.similarReportCount === 1 ? "report" : "reports"} in this area
        </p>
      )}

      <div className="mt-auto pt-5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-ink-faint">
          <CalendarIcon className="h-3.5 w-3.5" />
          Reported {formatReportDate(report.date)}
        </p>
        <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
          <Link
            to={`/waste-reports/${report.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-700 px-3.5 py-2 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-brand-800 active:translate-y-px"
          >
            View
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            to={`/waste-reports/${report.id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3.5 py-2 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:border-line-strong hover:text-ink"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(report)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium text-ink-faint transition-colors duration-150 hover:bg-clay-50 hover:text-clay-600"
          >
            <Trash2Icon className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
