/**
 * CleanLK — Collection Schedules Data Model & Initial Data
 * Module: M2 Collection Schedules
 *
 * Schema:
 * {
 *   id: number | string,
 *   area: string,
 *   wasteType: string,
 *   collectionDay: string,
 *   collectionTime: string,
 *   notes: string
 * }
 */

export const WASTE_TYPES = [
  'Household Waste',
  'Organic Waste',
  'Recyclable Waste',
  'Plastic Waste',
  'Glass Waste',
  'E-Waste',
  'Mixed Waste',
]

export const COLLECTION_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const SAMPLE_AREAS = [
  'Kegalle',
  'Colombo',
  'Kandy',
  'Gampaha',
  'Kurunegala',
  'Ratnapura',
  'Galle',
  'Matara',
]

export const initialCollectionSchedules = [
  {
    id: 1,
    area: 'Kegalle',
    wasteType: 'Household Waste',
    collectionDay: 'Monday',
    collectionTime: '8:00 AM',
    notes: 'Collection takes place every Monday morning.',
  },
  {
    id: 2,
    area: 'Kandy',
    wasteType: 'Organic Waste',
    collectionDay: 'Tuesday',
    collectionTime: '7:30 AM',
    notes: 'Organic waste collection.',
  },
  {
    id: 3,
    area: 'Colombo',
    wasteType: 'Recyclable Waste',
    collectionDay: 'Wednesday',
    collectionTime: '9:00 AM',
    notes: 'Separate recyclable materials before collection.',
  },
  {
    id: 4,
    area: 'Gampaha',
    wasteType: 'Household Waste',
    collectionDay: 'Thursday',
    collectionTime: '8:30 AM',
    notes: 'Place waste outside before collection time.',
  },
  {
    id: 5,
    area: 'Kurunegala',
    wasteType: 'Plastic Waste',
    collectionDay: 'Friday',
    collectionTime: '10:00 AM',
    notes: 'Plastic waste collection.',
  },
  {
    id: 6,
    area: 'Galle',
    wasteType: 'Mixed Waste',
    collectionDay: 'Saturday',
    collectionTime: '8:00 AM',
    notes: 'General mixed waste collection.',
  },
  {
    id: 7,
    area: 'Ratnapura',
    wasteType: 'E-Waste',
    collectionDay: 'Sunday',
    collectionTime: '9:30 AM',
    notes: 'Electronic items and battery disposal drop-off drive.',
  },
  {
    id: 8,
    area: 'Matara',
    wasteType: 'Glass Waste',
    collectionDay: 'Wednesday',
    collectionTime: '2:00 PM',
    notes: 'Glass bottles and jars collection afternoon.',
  },
]

/**
 * Returns total collection schedules count from localStorage if available,
 * falling back to initial sample data count.
 */
export function getCollectionScheduleCount() {
  try {
    const raw = localStorage.getItem('cleanlk_collection_schedules')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.length
      }
    }
  } catch (err) {
    console.error('Error reading collection schedule count:', err)
  }
  return initialCollectionSchedules.length
}
