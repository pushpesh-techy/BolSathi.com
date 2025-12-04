export default function StatsCard({ icon, title, value, change, isPositive }) {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md border-l-4 hover:shadow-lg transition"
      style={{ borderColor: "#87BAC3" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold">{title}</p>
          <p className="text-3xl font-bold mt-2" style={{ color: "#473472" }}>
            {value}
          </p>
          <p
            className="text-xs mt-2"
            style={{
              color: isPositive ? "#10b981" : "#ef4444",
            }}
          >
            {isPositive ? "↑" : "↓"} {change}% from last month
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
