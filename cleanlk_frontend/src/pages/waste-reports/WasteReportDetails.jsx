import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon, MapPinIcon, PencilIcon } from "../../components/icons";
import { PriorityBadge, StatusBadge, SeverityBadge } from "./Badges";
import FlashBanner from "./FlashBanner";
import { getWasteReport } from "../../api/wasteReports";
import { formatReportDate } from "../../utils/format";

export default function WasteReportDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [report, setReport] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [flash, setFlash] = useState(location.state?.flash ?? null);
  const [error, setError] = useState("");

  useEffect(() => {
    getWasteReport(id)
      .then(setReport)
      .catch((err) => setError(err.message))
      .finally(() => setLoaded(true));
  }, [id]);

  useEffect(() => {
    if (location.state?.flash) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded) return null;

  if (!report) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <h1 className="text-2xl font-bold text-ink">Report not found</h1>
        <p className="mt-2 text-sm text-ink-muted">
          {error || "This waste report may have been deleted."}
        </p>
        <button
          type="button"
          onClick={() => navigate("/waste-reports")}
          className="mt-6 inline-flex rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Waste Reports
        </button>
      </main>
    );
  }

  const details = [
    { label: "Reporter", value: report.fullName },
    { label: "Area", value: report.area },
    { label: "Reported Date", value: formatReportDate(report.date) },
    { label: "Status", value: report.status },
    { label: "Severity", value: report.severity },
    { label: "Report ID", value: report.id },
  ];

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <FlashBanner message={flash} onDismiss={() => setFlash(null)} />

      <button
        type="button"
        onClick={() => navigate("/waste-reports")}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors duration-150 hover:text-brand-700"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Waste Reports
      </button>

      <h1 className="mt-5 text-[28px] font-bold leading-tight text-ink sm:text-[34px]">
        Waste Report Details
      </h1>

      <section className="mt-7 rounded-card border border-line bg-white shadow-card">
        {report.imageData && (
          <img
            src={report.imageData}
            alt={`${report.issueType} in ${report.area}`}
            className="h-72 w-full rounded-t-card object-cover sm:h-96"
          />
        )}
        <div className="flex flex-col gap-4 border-b border-line p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
          <div>
            <h2 className="text-xl font-bold text-ink sm:text-2xl">
              {report.issueType}
            </h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPinIcon className="h-4 w-4 flex-none text-brand-500" />
              {report.area}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={report.status} />
            <SeverityBadge severity={report.severity} />
            <PriorityBadge priority={report.priority} />
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 sm:grid-cols-3 sm:p-7">
          {details.map((item) => (
            <div key={item.label}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-ink-faint">
                {item.label}
              </dt>
              <dd className="mt-1.5 text-[15px] font-medium text-ink">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="border-t border-line p-6 sm:p-7">
          <h3 className="text-sm font-bold text-ink">Issue Description</h3>
          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">
            {report.description}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-line bg-canvas/60 p-6 sm:flex-row sm:justify-end sm:p-7">
          <button
            type="button"
            onClick={() => navigate("/waste-reports")}
            className="rounded-xl border border-line bg-white px-5 py-3 text-center text-sm font-semibold text-ink-soft transition-colors duration-150 hover:border-line-strong hover:text-ink"
          >
            Back to Reports
          </button>
          <button
            type="button"
            onClick={() => navigate(`/waste-reports/${report.id}/edit`)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition-[background-color,transform] duration-150 hover:bg-brand-800 active:translate-y-px"
          >
            <PencilIcon className="h-4 w-4" />
            Edit Report
          </button>
        </div>
      </section>
    </main>
  );
}
