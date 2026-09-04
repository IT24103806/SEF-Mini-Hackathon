// Formats a "YYYY-MM-DD" date string (our storage format) into a readable
// label like "28 Aug 2026". Falls back to the raw string if parsing fails.

export function formatReportDate(dateString) {
  if (!dateString) return "";

  const parsed = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateString;

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
