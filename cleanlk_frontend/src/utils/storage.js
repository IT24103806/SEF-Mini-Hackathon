const STORAGE_KEY = "cleanlk_community_requests";

export const getStoredRequests = (fallbackData) => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackData));
    return fallbackData;
  }
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to parse storage data", err);
    return fallbackData;
  }
};

export const saveRequests = (requests) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};