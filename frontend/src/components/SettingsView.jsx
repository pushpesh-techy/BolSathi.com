import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SettingsView({ user }) {
  const { updateUserData } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    updateUserData(formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="p-8">
      <h1
        className="text-4xl font-bold mb-8"
        style={{ color: "var(--primary)" }}
      >
        Settings & Profile
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--secondary)" }}
          >
            Profile Information
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-lg font-semibold transition text-white"
            style={{ backgroundColor: "var(--accent)" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#53629E")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#87BAC3")}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#473472" }}
            >
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "var(--accent)", borderWidth: "2px" }}
              />
            ) : (
              <p className="text-lg text-gray-700">{user?.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "var(--primary)" }}
            >
              Email Address
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "var(--accent)", borderWidth: "2px" }}
              />
            ) : (
              <p className="text-lg text-gray-700">{user?.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "var(--primary)" }}
            >
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                style={{ borderColor: "var(--accent)", borderWidth: "2px" }}
              />
            ) : (
              <p className="text-lg text-gray-700">{user?.phone}</p>
            )}
          </div>

          {/* Save Button */}
          {isEditing && (
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 rounded-lg font-bold text-white transition"
              style={{ backgroundColor: "var(--secondary)" }}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "var(--primary)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "var(--secondary)")
              }
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
