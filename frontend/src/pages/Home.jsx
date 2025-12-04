import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import DashboardView from "../components/DashboardView";
import SettingsView from "../components/SettingsView";

const Home = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#D6F4ED] to-[#87BAC3]">
        <div className="text-center">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--primary)" }}
          >
            Welcome to BolSaathi
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            You are not authenticated. Please log in to access your dashboard.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 rounded-lg font-bold text-white transition"
            style={{ backgroundColor: "var(--secondary)" }}
            onMouseEnter={(e) => (e.style.backgroundColor = "var(--primary)")}
            onMouseLeave={(e) => (e.style.backgroundColor = "var(--secondary)")}
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Sidebar */}
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      {/* Main Content - Offset for fixed sidebar */}
      <div className="flex-1 ml-64">
        {/* Dashboard View */}
        {activeMenu === "dashboard" && <DashboardView user={user} />}

        {/* Courses View */}
        {activeMenu === "courses" && (
          <div className="p-8">
            <h1
              className="text-4xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              📚 Courses
            </h1>
            <p className="text-gray-600 mt-4">
              Your courses will appear here soon...
            </p>
          </div>
        )}

        {/* Achievements View */}
        {activeMenu === "achievements" && (
          <div className="p-8">
            <h1
              className="text-4xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              🏆 Achievements
            </h1>
            <p className="text-gray-600 mt-4">
              Your achievements will appear here soon...
            </p>
          </div>
        )}

        {/* Community View */}
        {activeMenu === "community" && (
          <div className="p-8">
            <h1
              className="text-4xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              👥 Community
            </h1>
            <p className="text-gray-600 mt-4">
              Connect with other learners coming soon...
            </p>
          </div>
        )}

        {/* Settings View */}
        {activeMenu === "settings" && <SettingsView user={user} />}
      </div>
    </div>
  );
};

export default Home;
