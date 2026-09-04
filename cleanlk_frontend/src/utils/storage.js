// Generic localStorage helpers.
// Kept intentionally simple so it's easy to explain in a demo.

/**
 * Read a value from localStorage and parse it as JSON.
 * Returns `fallback` if the key doesn't exist or JSON.parse fails.
 */
export function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load "${key}" from localStorage`, err);
    return fallback;
  }
}

/**
 * Save a value to localStorage as JSON.
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save "${key}" to localStorage`, err);
  }
}
