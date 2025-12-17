import StatsCard from "./StatsCard";
import ActivityItem from "./ActivityItem";

export default function DashboardView({ user }) {
  const stats = [
    {
      icon: "📚",
      title: "Active Courses",
      value: 5,
      change: "+12%",
      isPositive: true,
    },
    {
      icon: "🏆",
      title: "Achievements",
      value: 23,
      change: "+8%",
      isPositive: true,
    },
    {
      icon: "🔥",
      title: "Study Streak",
      value: "12 Days",
      change: "+25%",
      isPositive: true,
    },
    {
      icon: "⏱️",
      title: "Hours Studied",
      value: "48h",
      change: "+5%",
      isPositive: true,
    },
  ];

  const activities = [
    { activity: "Completed Hindi Lesson 1", xp: "+50 XP", time: "2 hours ago" },
    { activity: "Completed Tamil Lesson 2", xp: "+50 XP", time: "2 hours ago" },
    { activity: "Achieved 7-day streak", xp: "+100 XP", time: "1 day ago" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-2 text-lg" style={{ color: "var(--text-secondary)" }}>
            Your learning momentum is impressive today.
          </p>
        </div>
        <button className="px-6 py-3 rounded-2xl text-white font-semibold shadow-lg shadow-purple-200 transition transform hover:scale-105"
          style={{ backgroundColor: "var(--primary)" }}>
          Resume Learning
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
          />
        ))}
      </div>

      {/* Dashboard Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Activity & Recommended (Span 2) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                Recent Activity
              </h2>
              <button className="text-sm font-semibold hover:opacity-80 transition" style={{ color: "var(--primary)" }}>
                View All
              </button>
            </div>
           
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <ActivityItem
                  key={index}
                  activity={activity.activity}
                  xp={activity.xp}
                  time={activity.time}
                />
              ))}
            </div>
          </div>
          
           {/* Placeholder for Graph or Learning Path could go here */}
        </div>

        {/* Right Column: Leaderboard/Progress (Span 1) */}
        <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#6C5DD3] to-[#8B7FE8] rounded-3xl p-8 text-white shadow-xl shadow-purple-200 relative overflow-hidden">
                {/* Decorative Circle */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                
                <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
                <p className="opacity-90 mb-6 text-sm">Unlock unlimited practice and AI feedback.</p>
                <button className="w-full py-3 bg-white text-[#6C5DD3] rounded-xl font-bold text-sm hover:bg-gray-50 transition">
                    Upgrade Now
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}
