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
      const result = await login(formData.email, formData.password);
      if (result.success && result.needsOTP) {
        setShowOTP(true);
      } else if (result.success) {
        navigate("/");
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
        background: "linear-gradient(135deg, #D6F4ED 0%, #87BAC3 100%)",
      }}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: "#473472" }}
        >
          Login
        </h2>

        {successMessage && (
          <div
            className="border px-4 py-3 rounded-lg mb-4"
            style={{
              backgroundColor: "#D6F4ED",
              borderColor: "#87BAC3",
              color: "#473472",
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
              style={{ color: "#473472" }}
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
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition"
              style={{ borderColor: "#D6F4ED", color: "#473472" }}
              onFocus={(e) => (e.target.style.borderColor = "#87BAC3")}
              onBlur={(e) => (e.target.style.borderColor = "#D6F4ED")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-semibold py-2 rounded-lg transition duration-200"
            style={{ backgroundColor: "#53629E" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#473472")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#53629E")}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6" style={{ color: "#53629E" }}>
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold"
            style={{ color: "#473472" }}
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
