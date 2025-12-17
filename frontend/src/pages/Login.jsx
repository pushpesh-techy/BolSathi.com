import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import LoginOTPVerification from "../components/LoginOTPVerification";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const successMessage = location.state?.message;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      setError("Valid email is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Get or Generate Device ID
      let deviceId = localStorage.getItem("deviceId");
      if (!deviceId) {
          // Robust fallback for device ID generation
          deviceId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          localStorage.setItem("deviceId", deviceId);
      }

      const result = await login(formData.email, formData.password, deviceId);
      
      if (result.success) {
         if (result.needsOTP) {
             setShowOTP(true);
         } else {
             // Trusted Device found - Direct Login
             navigate("/"); 
         }
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  if (showOTP) {
    return (
      <LoginOTPVerification
        email={formData.email}
        credentials={formData}
        deviceId={localStorage.getItem("deviceId")}
        onBack={() => {
          setShowOTP(false);
          setError("");
        }}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, var(--light) 0%, var(--accent) 100%)",
      }}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: "var(--primary)" }}
        >
          Login
        </h2>

        {successMessage && (
          <div
            className="border px-4 py-3 rounded-lg mb-4"
            style={{
              backgroundColor: "var(--light)",
              borderColor: "var(--accent)",
              color: "var(--primary)",
            }}
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block font-semibold mb-2"
              style={{ color: "var(--primary)" }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition"
              style={{ borderColor: "var(--light)", color: "var(--primary)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--light)")}
            />
          </div>

          <div>
            <label
              className="block font-semibold mb-2"
              style={{ color: "var(--primary)" }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition"
              style={{ borderColor: "var(--light)", color: "var(--primary)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--light)")}
            />
          </div>

          <div className="flex justify-end">
            <a href="/forgot-password" className="text-sm font-semibold hover:underline" style={{ color: "var(--primary)" }}>
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-2 rounded-lg transition duration-200"
            style={{ backgroundColor: "var(--secondary)" }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "var(--primary)")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "var(--secondary)")
            }
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6" style={{ color: "var(--secondary)" }}>
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold"
            style={{ color: "var(--primary)" }}
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
