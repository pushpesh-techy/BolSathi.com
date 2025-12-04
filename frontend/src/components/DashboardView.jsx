import StatsCard from "./StatsCard";
import ActivityItem from "./ActivityItem";

export default function DashboardView({ user }) {
  const stats = [
    {
      icon: "📚",
      title: "Active Courses",
      value: 5,
      change: 12,
      isPositive: true,
    },
    {
      icon: "🏆",
      title: "Achievements",
      value: 23,
      change: 8,
      isPositive: true,
    },
    {
      icon: "🔥",
      title: "Study Streak",
      value: 12,
      change: 25,
      isPositive: true,
    },
    {
      icon: "⏱️",
      title: "Hours Studied",
      value: 48,
      change: 5,
      isPositive: true,
    },
  ];

  const activities = [
    { activity: "Completed Hindi Lesson 1", xp: 50, time: "2 hours ago" },
    { activity: "Completed Tamil Lesson 2", xp: 50, time: "2 hours ago" },
    { activity: "Achieved 7-day streak", xp: 100, time: "1 day ago" },
  ];

  return (
    <div className="p-8">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold" style={{ color: "var(--primary)" }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Keep up the momentum with your language learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--primary)" }}
        >
          Recent Activity
        </h2>
        <div className="space-y-4">
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
    </div>
  );
}
