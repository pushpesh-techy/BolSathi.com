import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user, logout, updateUserData, isAuthenticated } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {});
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value,
    });
    setError("");
  };

  const validateEditData = () => {
    if (!editData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!editData.phone.match(/^\d{10}$/)) {
      setError("Phone number must be 10 digits");
      return false;
    }
    return true;
  };

  const handleSaveChanges = () => {
    if (!validateEditData()) {
      return;
    }
    updateUserData(editData);
    setIsEditing(false);
    setError("");
  };

  const handleCancel = () => {
    setEditData(user);
    setIsEditing(false);
    setError("");
  };

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #D6F4ED 0%, #87BAC3 100%)",
        }}
      >
        <div className="text-center">
          <p className="text-xl mb-4" style={{ color: "#473472" }}>
            Please login to access this page
          </p>
          <a
            href="/login"
            className="inline-block text-white font-semibold py-2 px-6 rounded-lg transition"
            style={{ backgroundColor: "#53629E" }}
            onMouseEnter={(e) => (e.style.backgroundColor = "#473472")}
            onMouseLeave={(e) => (e.style.backgroundColor = "#53629E")}
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background: "linear-gradient(135deg, #D6F4ED 0%, #87BAC3 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold" style={{ color: "#473472" }}>
              Welcome, {user?.name}!
            </h1>
            <button
              onClick={handleLogout}
              className="text-white font-semibold py-2 px-4 rounded-lg transition"
              style={{ backgroundColor: "#473472" }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Logout
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "#473472" }}>
            User Profile
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {!isEditing ? (
            <div className="space-y-4">
              <div className="border-b pb-4" style={{ borderColor: "#87BAC3" }}>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#53629E" }}
                >
                  Full Name
                </p>
                <p className="text-lg" style={{ color: "#473472" }}>
                  {user?.name}
                </p>
              </div>

              <div className="border-b pb-4" style={{ borderColor: "#87BAC3" }}>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#53629E" }}
                >
                  Email
                </p>
                <p className="text-lg" style={{ color: "#473472" }}>
                  {user?.email}
                </p>
              </div>

              <div className="border-b pb-4" style={{ borderColor: "#87BAC3" }}>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#53629E" }}
                >
                  Phone Number
                </p>
                <p className="text-lg" style={{ color: "#473472" }}>
                  {user?.phone}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditData(user);
                  }}
                  className="text-white font-semibold py-2 px-6 rounded-lg transition"
                  style={{ backgroundColor: "#53629E" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#473472")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#53629E")
                  }
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  className="block font-semibold mb-2"
                  style={{ color: "#473472" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition"
                  style={{ borderColor: "#D6F4ED", color: "#473472" }}
                  onFocus={(e) => (e.target.style.borderColor = "#87BAC3")}
                  onBlur={(e) => (e.target.style.borderColor = "#D6F4ED")}
                />
              </div>

              <div>
                <label
                  className="block font-semibold mb-2"
                  style={{ color: "#473472" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  disabled
                  className="w-full px-4 py-2 border-2 rounded-lg cursor-not-allowed"
                  style={{
                    borderColor: "#D6F4ED",
                    color: "#473472",
                    backgroundColor: "#F0F0F0",
                  }}
                />
                <p className="text-sm mt-1" style={{ color: "#53629E" }}>
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label
                  className="block font-semibold mb-2"
                  style={{ color: "#473472" }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  placeholder="Enter 10 digit phone number"
                  className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition"
                  style={{ borderColor: "#D6F4ED", color: "#473472" }}
                  onFocus={(e) => (e.target.style.borderColor = "#87BAC3")}
                  onBlur={(e) => (e.target.style.borderColor = "#D6F4ED")}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveChanges}
                  className="text-white font-semibold py-2 px-6 rounded-lg transition"
                  style={{ backgroundColor: "#87BAC3" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#53629E")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#87BAC3")
                  }
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="text-white font-semibold py-2 px-6 rounded-lg transition"
                  style={{ backgroundColor: "#53629E" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#473472")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#53629E")
                  }
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
