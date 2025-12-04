import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import OTPVerification from "../components/OTPVerification";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Valid email is required");
      return false;
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      setError("Phone number must be 10 digits");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
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
      const result = await signup(formData);
      if (result.success) {
        setShowOTP(true);
      } else {
        setError(result.error || "Signup failed");
      }
    } catch (err) {
      setError("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  if (showOTP) {
    return (
      <OTPVerification
        email={formData.email}
        signupData={formData}
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
          Sign Up
        </h2>

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
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
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
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10 digit phone number"
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
              placeholder="Enter password (min 6 characters)"
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
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition"
              style={{ borderColor: "var(--light)", color: "var(--primary)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--light)")}
            />
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6" style={{ color: "var(--secondary)" }}>
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold"
            style={{ color: "var(--primary)" }}
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
