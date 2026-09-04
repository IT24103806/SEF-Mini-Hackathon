import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircleIcon } from "../../components/icons";
import SeverityOptions from "./SeverityOptions";
import {
  createWasteReport,
  getWasteReport,
  updateWasteReport,
} from "../../api/wasteReports";
import { validateWasteReport } from "../../utils/validation";
import { AREAS, ISSUE_TYPES, STATUSES } from "./constants";

const emptyForm = {
  fullName: "",
  area: "",
  issueType: "",
  description: "",
  severity: "",
  status: "Reported",
  date: new Date().toISOString().slice(0, 10),
};

const fieldBase =
  "w-full rounded-xl border bg-white px-3.5 py-3 text-[15px] text-ink placeholder:text-ink-faint transition-colors duration-150 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15";

function fieldClass(hasError) {
  return `${fieldBase} ${
    hasError
      ? "border-clay-500 bg-clay-50/40"
      : "border-line hover:border-line-strong"
  }`;
}

const selectArrow =
  "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236B7A73%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:18px_18px] bg-[right_0.9rem_center] bg-no-repeat pr-11";

function Field({ label, htmlFor, error, hint, required = true, children }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
          {label}
          {required && <span className="ml-0.5 text-brand-500">*</span>}
        </label>
        {hint && !error && (
          <span className="text-xs text-ink-faint">{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-clay-600">
          <AlertCircleIcon className="h-4 w-4 flex-none" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function WasteReportForm() {
  const { id } = useParams(); // present only when editing
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [similarReports, setSimilarReports] = useState([]);

  // In edit mode, load the existing report's data into the form.
  useEffect(() => {
    if (!isEditMode) return;

    getWasteReport(id)
      .then(setFormData)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, isEditMode]);

  function setField(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setField(name, value);
  }

  async function saveReport(submitAnyway = false) {

    const validationErrors = validateWasteReport(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Scroll the first invalid field into view, like the reference design.
      const firstErrorField = Object.keys(validationErrors)[0];
      document
        .getElementById(firstErrorField)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return; // stop here — show friendly messages instead of saving
    }

    setSubmitting(true);
    setServerError("");

    try {
      if (isEditMode) {
        await updateWasteReport(id, formData);
        navigate(`/waste-reports/${id}`, {
          state: { flash: "Waste report updated successfully." },
        });
      } else {
        await createWasteReport(
          { ...formData, status: "Reported" },
          submitAnyway,
        );
        navigate("/waste-reports", {
          state: { flash: "Waste issue reported successfully." },
        });
      }
    } catch (err) {
      if (err.code === "SIMILAR_REPORTS_FOUND") {
        setSimilarReports(err.similarReports);
        setServerError("");
        return;
      }
      const apiErrors = { ...err.fields };
      if (apiErrors.name) {
        apiErrors.fullName = apiErrors.name;
        delete apiErrors.name;
      }
      setErrors(apiErrors);
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateWasteReport(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorField = Object.keys(validationErrors)[0];
      document
        .getElementById(firstErrorField)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    saveReport(false);
  }

  if (loading) {
    return <main className="px-5 py-20 text-center text-ink-muted">Loading report...</main>;
  }

  if (notFound) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <h1 className="text-2xl font-bold text-ink">Report not found</h1>
        <p className="mt-2 text-sm text-ink-muted">
          This waste report may have been deleted.
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

  return (
    <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="mb-8 text-center">
        <h1 className="text-[28px] font-bold leading-tight text-ink sm:text-[34px]">
          {isEditMode ? "Update Waste Report" : "Report a Waste Issue"}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-ink-muted">
          {isEditMode
            ? "Review and update the details of this waste report."
            : "Help keep your neighbourhood clean by reporting a local waste problem."}
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
      >
        {serverError && (
          <div className="mb-6 rounded-xl border border-clay-500 bg-clay-50 p-4 text-sm font-medium text-clay-600">
            {serverError}
          </div>
        )}
        {similarReports.length > 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-bold text-amber-800">
              A similar issue has already been reported in this area.
            </h2>
            <p className="mt-2 text-sm text-amber-700">
              We found {similarReports.length} possible similar {similarReports.length === 1 ? "report" : "reports"} for {formData.issueType} in {formData.area}.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/waste-reports?area=${encodeURIComponent(formData.area)}&issueType=${encodeURIComponent(formData.issueType)}`,
                  )
                }
                className="rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-semibold text-amber-800"
              >
                View Similar Reports
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => saveReport(true)}
                className="rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Anyway"}
              </button>
            </div>
          </div>
        )}
        <div className="space-y-7">
          <Field label="Full Name" htmlFor="fullName" error={errors.fullName}>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Nimal Perera"
              aria-invalid={Boolean(errors.fullName)}
              className={fieldClass(Boolean(errors.fullName))}
            />
          </Field>

          <div className="grid gap-7 sm:grid-cols-2">
            <Field label="Area" htmlFor="area" error={errors.area}>
              <select
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                aria-invalid={Boolean(errors.area)}
                className={`${fieldClass(Boolean(errors.area))} ${selectArrow}`}
              >
                <option value="">Select an area</option>
                {AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Issue Type"
              htmlFor="issueType"
              error={errors.issueType}
            >
              <select
                id="issueType"
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                aria-invalid={Boolean(errors.issueType)}
                className={`${fieldClass(Boolean(errors.issueType))} ${selectArrow}`}
              >
                <option value="">Select an issue type</option>
                {ISSUE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field
            label="Description"
            htmlFor="description"
            error={errors.description}
            hint={`${formData.description.trim().length}/10 characters minimum`}
          >
            <textarea
              id="description"
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the waste problem and where it is located..."
              aria-invalid={Boolean(errors.description)}
              className={`${fieldClass(Boolean(errors.description))} resize-y leading-relaxed`}
            />
          </Field>

          <Field label="Severity" error={errors.severity}>
            <SeverityOptions
              value={formData.severity}
              onChange={(severity) => setField("severity", severity)}
              invalid={Boolean(errors.severity)}
            />
          </Field>

          {/* Status can only be changed when editing an existing report */}
          {isEditMode && (
            <Field label="Status" required={false}>
              <div
                role="radiogroup"
                aria-label="Status"
                className="flex flex-wrap gap-2.5"
              >
                {STATUSES.map((status) => {
                  const isSelected = formData.status === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setField("status", status)}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors duration-150 ${
                        isSelected
                          ? "border-brand-600 bg-brand-50 text-brand-700"
                          : "border-line bg-white text-ink-soft hover:border-line-strong"
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </Field>
          )}

          <Field label="Date" htmlFor="date" required={false}>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={fieldClass(false)}
            />
          </Field>
        </div>

        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate(isEditMode ? `/waste-reports/${id}` : "/waste-reports")
            }
            className="rounded-xl border border-line bg-white px-5 py-3 text-sm font-semibold text-ink-soft transition-colors duration-150 hover:border-line-strong hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-card transition-[background-color,transform] duration-150 hover:bg-brand-800 active:translate-y-px"
          >
            {submitting
              ? "Saving..."
              : isEditMode
                ? "Update Report"
                : "Submit Report"}
          </button>
        </div>
      </form>
    </main>
  );
}
