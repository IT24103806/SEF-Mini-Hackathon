/**
 * CleanLK — Validation Utility
 * Validates collection schedule form inputs with friendly, user-facing error messages.
 */

/**
 * Validates a collection schedule form data object.
 * @param {Object} formData
 * @param {string} formData.area
 * @param {string} formData.wasteType
 * @param {string} formData.collectionDay
 * @param {string} formData.collectionTime
 * @param {string} [formData.notes]
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateCollectionSchedule(formData) {
  const errors = {}

  // Area: Required and cannot be blank
  if (!formData.area || !formData.area.trim()) {
    errors.area = 'Please enter an area.'
  } else if (formData.area.trim().length < 2) {
    errors.area = 'Area name must be at least 2 characters.'
  } else if (formData.area.trim().length > 60) {
    errors.area = 'Area name cannot exceed 60 characters.'
  }

  // Waste Type: Required
  if (!formData.wasteType || !formData.wasteType.trim()) {
    errors.wasteType = 'Please select a waste type.'
  }

  // Collection Day: Required
  if (!formData.collectionDay || !formData.collectionDay.trim()) {
    errors.collectionDay = 'Please select a collection day.'
  }

  // Collection Time: Required
  if (!formData.collectionTime || !formData.collectionTime.trim()) {
    errors.collectionTime = 'Please select a collection time.'
  } else if (formData.collectionTime.trim().length > 30) {
    errors.collectionTime = 'Collection time cannot exceed 30 characters.'
  }

  // Notes: Optional, but if provided, validate length
  if (formData.notes && formData.notes.trim().length > 300) {
    errors.notes = 'Notes cannot exceed 300 characters.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
