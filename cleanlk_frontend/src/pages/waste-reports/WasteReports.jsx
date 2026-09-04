import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PlusIcon, SearchIcon, Trash2Icon } from "../../components/icons";
import ReportCard from "./ReportCard";
import DeleteReportModal from "./DeleteReportModal";
import FlashBanner from "./FlashBanner";
import StatCard from "../../components/StatCard";
import {
  deleteWasteReport,
  getWasteReports,
  getWasteReportStats,
} from "../../api/wasteReports";
import { STATUSES, SEVERITIES } from "./constants";

const selectClass =
  "w-full appearance-none rounded-xl border border-line bg-white bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236B7A73%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px_18px] bg-[right_0.9rem_center] bg-no-repeat py-3 pl-3.5 pr-11 text-[15px] font-medium text-ink transition-colors duration-150 hover:border-line-strong focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/15";

export default function WasteReports() {
  const navigate = useNavigate();
  const location = useLocation();

  const [reports, setReports] = useState([]);
  const query = new URLSearchParams(location.search);
  const similarArea = query.get("area") || "";
  const similarIssueType = query.get("issueType") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [flash, setFlash] = useState(location.state?.flash ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    urgent: 0,
    resolved: 0,
    areasAffected: 0,
  });

  useEffect(() => {
    Promise.all([getWasteReports(), getWasteReportStats()])
      .then(([reportData, statsData]) => {
        setReports(reportData);
        setStats(statsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Clear the "flash" navigation state so refreshing the page
  // (or navigating away and back) doesn't re-show the banner.
  useEffect(() => {
    if (location.state?.flash) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteWasteReport(deleteTarget.id);
      setReports((current) =>
        current.filter((report) => report.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
      setFlash("Waste report deleted.");
      setStats(await getWasteReportStats());
    } catch (err) {
      setDeleteTarget(null);
      setError(err.message);
    }
  }

  // Search + filter is recalculated whenever the reports or filters change.
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        report.area.toLowerCase().includes(term) ||
        report.issueType.toLowerCase().includes(term) ||
        report.description.toLowerCase().includes(term);

      const matchesStatus = !statusFilter || report.status === statusFilter;
      const matchesSeverity =
        !severityFilter || report.severity === severityFilter;
      const matchesSimilar =
        (!similarArea || report.area === similarArea) &&
        (!similarIssueType || report.issueType === similarIssueType);

      return matchesSearch && matchesStatus && matchesSeverity && matchesSimilar;
    });
  }, [
    reports,
    searchTerm,
    statusFilter,
    severityFilter,
    similarArea,
    similarIssueType,
  ]);

  const hasActiveFilters =
    searchTerm ||
    statusFilter ||
    severityFilter ||
    similarArea ||
    similarIssueType;

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("");
    setSeverityFilter("");
    navigate("/waste-reports", { replace: true });
  }

  return (
    <main className="mx-auto max-w-shell px-5 py-10 sm:px-8 sm:py-14">
      <FlashBanner message={flash} onDismiss={() => setFlash(null)} />

      {error && (
        <div className="mb-6 rounded-xl border border-clay-500 bg-clay-50 p-4 text-sm font-medium text-clay-600">
          {error} Make sure the backend is running on port 5000.
        </div>
      )}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-ink sm:text-[36px]">
            Community Waste Reports
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-muted sm:text-base">
            View, search and track waste issues reported by residents across
            Sri Lanka.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/waste-reports/new")}
          className="inline-flex flex-none items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-card transition-[background-color,transform] duration-150 hover:bg-brand-800 active:translate-y-px"
        >
          <PlusIcon className="h-4 w-4" />
          Report Waste Issue
        </button>
      </div>

      <section
        aria-label="Community impact summary"
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard label="Total Reports" value={stats.total} accent="blue" />
        <StatCard label="Urgent Issues" value={stats.urgent} accent="red" />
        <StatCard label="Resolved" value={stats.resolved} accent="green" />
        <StatCard
          label="Areas Affected"
          value={stats.areasAffected}
          accent="yellow"
        />
      </section>

      {(similarArea || similarIssueType) && (
        <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-700">
          Showing similar {similarIssueType} reports in {similarArea}.
        </p>
      )}

      {/* Search + filters */}
      <section
        aria-label="Search and filter reports"
        className="mt-8 rounded-card border border-line bg-white p-4 shadow-card sm:p-5"
      >
        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="relative">
            <label htmlFor="search" className="sr-only">
              Search reports
            </label>
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
            <input
              id="search"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by area or issue type..."
              className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-3.5 text-[15px] text-ink placeholder:text-ink-faint transition-colors duration-150 hover:border-line-strong focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/15"
            />
          </div>

          <div>
            <label htmlFor="status" className="sr-only">
              Filter by status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={selectClass}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="severity" className="sr-only">
              Filter by severity
            </label>
            <select
              id="severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className={selectClass}
            >
              <option value="">All Severities</option>
              {SEVERITIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <p className="text-sm font-medium text-ink-muted" aria-live="polite">
          Showing {filteredReports.length}{" "}
          {filteredReports.length === 1 ? "report" : "reports"}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-brand-600 transition-colors duration-150 hover:text-brand-800"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <p className="mt-8 text-center text-sm text-ink-muted">Loading reports...</p>
      ) : filteredReports.length > 0 ? (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {filteredReports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-card border border-dashed border-line-strong bg-white px-6 py-16 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
            <Trash2Icon className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <h2 className="mt-5 text-lg font-bold text-ink">
            No waste reports found
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Try changing your search or filters.
          </p>
        </div>
      )}

      <DeleteReportModal
        open={Boolean(deleteTarget)}
        reportLabel={
          deleteTarget
            ? `${deleteTarget.issueType} — ${deleteTarget.area}`
            : undefined
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
}
