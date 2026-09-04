/**
 * CleanLK — Local Storage Utility for Collection Schedules
 * Provides persistence and recovery mechanisms for prototype data.
 */

import { initialCollectionSchedules } from '../data/collectionSchedules.js'

export const SCHEDULES_STORAGE_KEY = 'cleanlk_collection_schedules'

/**
 * Loads collection schedules from localStorage.
 * If data does not exist or is corrupted, initializes with sample data.
 * @returns {Array} List of collection schedule objects
 */
export function loadCollectionSchedules() {
  try {
    const rawData = localStorage.getItem(SCHEDULES_STORAGE_KEY)
    if (!rawData) {
      saveCollectionSchedules(initialCollectionSchedules)
      return initialCollectionSchedules
    }

    const parsed = JSON.parse(rawData)
    if (!Array.isArray(parsed)) {
      console.warn('Invalid schedules data found in localStorage. Resetting to sample data.')
      saveCollectionSchedules(initialCollectionSchedules)
      return initialCollectionSchedules
    }

    return parsed
  } catch (error) {
    console.error('Failed to parse collection schedules from localStorage:', error)
    saveCollectionSchedules(initialCollectionSchedules)
    return initialCollectionSchedules
  }
}

/**
 * Saves collection schedules list to localStorage.
 * @param {Array} schedules
 * @returns {boolean} True if successful
 */
export function saveCollectionSchedules(schedules) {
  try {
    localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(schedules))
    return true
  } catch (error) {
    console.error('Failed to persist collection schedules to localStorage:', error)
    return false
  }
}

/**
 * Resets collection schedules back to the original sample data.
 * Useful for demo and testing.
 * @returns {Array} Reset sample data
 */
export function resetCollectionSchedules() {
  saveCollectionSchedules(initialCollectionSchedules)
  return initialCollectionSchedules
}
