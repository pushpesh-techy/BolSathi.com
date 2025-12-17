import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      if (response.data.success) {
        setSuccessMessage("OTP sent to your email.");
        setTimeout(() => {
            navigate("/reset-password", { state: { email } });
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 relative overflow-hidden">
        {/* Background Decorative Circles */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl z-10 border border-gray-100/50 backdrop-blur-sm">
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6C5DD3] to-[#8B7FE8] bg-clip-text text-transparent">
             Forgot Password?
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Enter your email to receive a reset OTP.
            </p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-100 flex items-center">
             ⚠️ {error}
            </div>
        )}
        
        {successMessage && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm border border-green-100 flex items-center">
             ✅ {successMessage}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2 ml-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 focus:border-[#6C5DD3] transition-all"
              placeholder="example@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6C5DD3] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#5b4eb5] transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-[#6C5DD3] font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
