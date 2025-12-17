export default function StatsCard({ icon, title, value, change, isPositive }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{title}</p>
          <p className="text-2xl font-bold mt-2" style={{ color: "var(--text-primary)" }}>
            {value}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs font-semibold">
           <span className={`px-2 py-0.5 rounded-full ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
             {change}
           </span>
           <span className="text-gray-400 font-normal ml-1">this month</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gray-50">
            {icon}
        </div>
      </div>
    </div>
  );
}
