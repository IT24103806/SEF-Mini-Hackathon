const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/waste-reports";

function normalizeReport(report) {
  return {
    ...report,
    fullName: report.fullName ?? report.name ?? "",
  };
}

function toApiReport(report) {
  return {
    name: report.fullName,
    area: report.area,
    issueType: report.issueType,
    description: report.description,
    severity: report.severity,
    status: report.status,
    date: report.date,
    imageData: report.imageData || "",
  };
}

async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || "The server request failed.");
    error.fields = data.errors || {};
    error.code = data.code;
    error.similarReports = (data.similarReports || []).map(normalizeReport);
    throw error;
  }

  return data;
}

export async function getWasteReports() {
  const reports = await request(API_BASE_URL);
  return reports.map(normalizeReport);
}

export async function getWasteReport(id) {
  return normalizeReport(await request(`${API_BASE_URL}/${id}`));
}

export function getWasteReportStats() {
  return request(`${API_BASE_URL}/stats`);
}

export async function createWasteReport(report, submitAnyway = false) {
  return normalizeReport(
    await request(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...toApiReport(report), submitAnyway }),
    }),
  );
}

export async function updateWasteReport(id, report) {
  return normalizeReport(
    await request(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toApiReport(report)),
    }),
  );
}

export async function deleteWasteReport(id) {
  return request(`${API_BASE_URL}/${id}`, { method: "DELETE" });
}
