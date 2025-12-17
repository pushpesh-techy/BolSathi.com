export default function ActivityItem({ activity, xp, time }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="text-lg">🎯</span>
        </div>
        <div>
            <p className="font-semibold text-sm group-hover:text-blue-600 transition" style={{ color: "var(--text-primary)" }}>
            {activity}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{time}</p>
        </div>
      </div>
     
      <div className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
        {xp}
      </div>
    </div>
  );
}
