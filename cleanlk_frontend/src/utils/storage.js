import { SAMPLE_COLLECTION_SCHEDULES } from '../data/collectionSchedules.js';
import { SAMPLE_WASTE_LOCATIONS } from '../data/wasteLocations.js';
import { initialRequests } from '../data/communityRequests.js';

// Keys
const SCHEDULES_KEY = 'cleanlk_collection_schedules';
const LOCATIONS_KEY = 'cleanlk_waste_locations';
const COMMUNITY_KEY = 'cleanlk_community_requests';

/**
 * Generic read from localStorage with JSON parsing & fallback
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
 * Generic save to localStorage
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save "${key}" to localStorage`, err);
  }
}

// ---------------------------------------------------------------------------
// Collection Schedules Storage Helpers
// ---------------------------------------------------------------------------
export function loadCollectionSchedules() {
  return loadFromStorage(SCHEDULES_KEY, SAMPLE_COLLECTION_SCHEDULES);
}

export function saveCollectionSchedules(schedules) {
  saveToStorage(SCHEDULES_KEY, schedules);
}

export function resetCollectionSchedules() {
  saveToStorage(SCHEDULES_KEY, SAMPLE_COLLECTION_SCHEDULES);
  return SAMPLE_COLLECTION_SCHEDULES;
}

// ---------------------------------------------------------------------------
// Waste Locations Storage Helpers
// ---------------------------------------------------------------------------
export function loadWasteLocations() {
  return loadFromStorage(LOCATIONS_KEY, SAMPLE_WASTE_LOCATIONS);
}

export function saveWasteLocations(locations) {
  saveToStorage(LOCATIONS_KEY, locations);
}

export function resetWasteLocations() {
  saveToStorage(LOCATIONS_KEY, SAMPLE_WASTE_LOCATIONS);
  return SAMPLE_WASTE_LOCATIONS;
}

// ---------------------------------------------------------------------------
// Community Requests Storage Helpers
// ---------------------------------------------------------------------------
export const getStoredRequests = (fallbackData = initialRequests) => {
  return loadFromStorage(COMMUNITY_KEY, fallbackData);
};

export const saveRequests = (requests) => {
  saveToStorage(COMMUNITY_KEY, requests);
};
