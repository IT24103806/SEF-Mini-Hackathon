export const WASTE_TYPES = [
  'Household Waste',
  'Recyclable Waste',
  'Organic Waste',
  'Plastic Waste',
  'Glass Waste',
  'E-Waste',
  'Mixed Waste',
];

export const COLLECTION_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const SAMPLE_AREAS = [
  'Colombo',
  'Kandy',
  'Kegalle',
  'Gampaha',
  'Galle',
  'Kurunegala',
  'Matara',
  'Negombo',
];

export const SAMPLE_COLLECTION_SCHEDULES = [
  {
    id: 1,
    area: 'Colombo',
    wasteType: 'Household Waste',
    collectionDay: 'Monday',
    collectionTime: '8:00 AM – 11:00 AM',
    notes: 'Covering Colombo Municipal Ward 1 to 5. Please seal bags and keep curbside.',
  },
  {
    id: 2,
    area: 'Colombo',
    wasteType: 'Recyclable Waste',
    collectionDay: 'Wednesday',
    collectionTime: '9:00 AM – 12:00 PM',
    notes: 'Paper, cardboard, clean metal cans, and dry plastics accepted.',
  },
  {
    id: 3,
    area: 'Kandy',
    wasteType: 'Household Waste',
    collectionDay: 'Tuesday',
    collectionTime: '7:00 AM – 10:00 AM',
    notes: 'Kandy Municipal Council limits and central town streets.',
  },
  {
    id: 4,
    area: 'Kegalle',
    wasteType: 'Household Waste',
    collectionDay: 'Thursday',
    collectionTime: '8:00 AM – 11:00 AM',
    notes: 'Urban council collection truck covers main road and hospital road.',
  },
  {
    id: 5,
    area: 'Gampaha',
    wasteType: 'Organic Waste',
    collectionDay: 'Friday',
    collectionTime: '8:00 AM – 11:00 AM',
    notes: 'Kitchen waste and garden foliage collected for municipal composting.',
  },
  {
    id: 6,
    area: 'Galle',
    wasteType: 'Household Waste',
    collectionDay: 'Saturday',
    collectionTime: '7:00 AM – 10:00 AM',
    notes: 'Galle Fort, Dutch Market, and Coastal residential line.',
  },
  {
    id: 7,
    area: 'Kurunegala',
    wasteType: 'Plastic Waste',
    collectionDay: 'Sunday',
    collectionTime: '8:30 AM – 11:30 AM',
    notes: 'PET bottles, rigid plastics, and clean polythene wrappers.',
  },
];
