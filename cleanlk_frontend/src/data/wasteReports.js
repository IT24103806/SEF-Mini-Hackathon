// Sample waste reports used to seed localStorage the first time the app runs.
// Feel free to edit these — they only load if "wasteReports" is empty.

const wasteReports = [
  {
    id: "wr-1",
    fullName: "Nimal Perera",
    area: "Colombo",
    issueType: "Overflowing Bin",
    description:
      "The public bin near Galle Face Green has been overflowing for three days and is attracting stray dogs.",
    severity: "High",
    status: "Reported",
    date: "2026-08-28",
  },
  {
    id: "wr-2",
    fullName: "Kumari Fernando",
    area: "Kandy",
    issueType: "Illegal Dumping",
    description:
      "Someone has been dumping construction debris along the road near Peradeniya junction, blocking part of the walkway.",
    severity: "Medium",
    status: "In Progress",
    date: "2026-08-25",
  },
  {
    id: "wr-3",
    fullName: "Sanath Wickramasinghe",
    area: "Gampaha",
    issueType: "Uncollected Garbage",
    description:
      "Household garbage has not been collected on the scheduled day for two weeks in a row in our neighborhood.",
    severity: "Medium",
    status: "Resolved",
    date: "2026-08-15",
  },
];

export default wasteReports;
