import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "courses", label: "Courses", icon: "📚" },
    { id: "achievements", label: "Achievements", icon: "🏆" },
    { id: "community", label: "Community", icon: "👥" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div
      className="w-64 p-6 shadow-lg fixed h-screen overflow-y-auto"
      style={{ backgroundColor: "var(--primary)" }}
    >
      {/* Logo */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">BolSaathi</h2>
        <p style={{ color: "var(--light)" }} className="text-sm mt-2">
          Language Learning
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className="w-full text-left px-4 py-3 rounded-lg transition font-semibold flex items-center gap-3"
            style={{
              backgroundColor:
                activeMenu === item.id ? "var(--secondary)" : "transparent",
              color: "white",
            }}
            onMouseEnter={(e) => {
              if (activeMenu !== item.id) {
                e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== item.id) {
                e.target.style.backgroundColor = "transparent";
              }
            }}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-3 rounded-lg transition font-semibold mt-8 text-white flex items-center gap-3"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)")
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
        }
      >
        <span>🚪</span>
        Logout
      </button>
    </div>
  );
}
