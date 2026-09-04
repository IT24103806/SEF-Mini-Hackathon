const API_BASE_URL = "http://localhost:5000/api/waste-reports";

export async function getWasteReports(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "All") params.append(key, value);
  });
  const response = await fetch(`${API_BASE_URL}${params.toString() ? `?${params}` : ""}`);
  if (!response.ok) throw new Error("Failed to load waste reports.");
  return response.json();
}

export async function getWasteReport(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Failed to load waste report.");
  return response.json();
}

export async function createWasteReport(report) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(report)
  });
  const data = await response.json();
  if (!response.ok) throw data;
  return data;
}

export async function updateWasteReport(id, report) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(report)
  });
  const data = await response.json();
  if (!response.ok) throw data;
  return data;
}

export async function deleteWasteReport(id) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {method:"DELETE"});
  const data = await response.json();
  if (!response.ok) throw data;
  return data;
}