export default function StatCard({ label, value, accent = "green" }) {
  const accentClasses = {
    green: "bg-green-50 text-green-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
    blue: "bg-blue-50 text-blue-700",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p
        className={`mt-1 inline-block rounded-md px-2 py-1 text-2xl font-bold ${accentClasses[accent]}`}
      >
        {value}
      </p>
    </div>
  );
}
