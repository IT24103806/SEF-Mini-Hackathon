export const REQUEST_TYPES = [
  "New Waste Bin",
  "Extra Collection",
  "Cleanup Request",
  "Missing Collection Point",
];

export const PRIORITIES = ["Low", "Medium", "High"];

export const STATUS_OPTIONS = [
  "Pending",
  "Under Review",
  "Approved",
  "Completed",
];

export const SAMPLE_AREAS = [
  "Colombo",
  "Kandy",
  "Galle",
  "Gampaha",
  "Kegalle",
  "Kurunegala",
  "Jaffna",
  "Matara",
  "Negombo",
  "Ratnapura",
];

export const initialRequests = [
  {
    id: 1,
    name: "Kasun Perera",
    area: "Kegalle",
    requestType: "New Waste Bin",
    priority: "High",
    status: "Pending",
    description: "Requesting a public bin near the central bus stand.",
    createdAt: "2026-09-01"
  },
  {
    id: 2,
    name: "Nimali Silva",
    area: "Colombo",
    requestType: "Extra Collection",
    priority: "Medium",
    status: "Approved",
    description: "Need an additional recycling pickup on weekend.",
    createdAt: "2026-09-02"
  },
  {
    id: 3,
    name: "Sunil Shantha",
    area: "Galle",
    requestType: "Cleanup Request",
    priority: "Low",
    status: "Completed",
    description: "Beach side cleanup drive support needed.",
    createdAt: "2026-09-03"
  }
];

