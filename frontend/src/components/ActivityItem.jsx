export default function ActivityItem({ activity, xp, time }) {
  return (
    <div
      className="p-4 rounded-lg flex items-center justify-between border-l-4"
      style={{
        backgroundColor: "var(--light)",
        borderColor: "var(--accent)",
      }}
    >
      <div>
        <p className="font-semibold" style={{ color: "var(--primary)" }}>
          {activity}
        </p>
        <p className="text-sm text-gray-600">{time}</p>
      </div>
      <div
        className="px-4 py-2 rounded-full font-bold text-white"
        style={{ backgroundColor: "var(--secondary)" }}
      >
        +{xp} XP
      </div>
    </div>
  );
}
