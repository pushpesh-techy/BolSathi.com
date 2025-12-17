import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
        setEmail(location.state.email);
    } else {
        // Redirect if came here without email (security/UX)
        navigate("/forgot-password");
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
            navigate("/login", { state: { message: "Password reset successful! Please login." }});
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 relative overflow-hidden">
       {/* Background Decorative Circles (Shared Theme) */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl z-10 border border-gray-100/50 backdrop-blur-sm">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6C5DD3] to-[#8B7FE8] bg-clip-text text-transparent">
             Reset Password
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Enter the OTP sent to <strong>{email}</strong>
            </p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100 flex items-center">
             ⚠️ {error}
            </div>
        )}

        {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm border border-green-100 flex items-center">
             ✅ Password reset successfully! Redirecting...
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2 ml-1">OTP Code</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all text-center tracking-widest text-lg"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 ml-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all"
              placeholder="New secure password"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 ml-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#6C5DD3] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#5b4eb5] transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-200 disabled:opacity-50 mt-4"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <Link to="/login" className="text-[#6C5DD3] font-bold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
