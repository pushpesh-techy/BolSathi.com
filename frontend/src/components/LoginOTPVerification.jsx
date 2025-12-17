import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginOTPVerification = ({ email, onBack, credentials, deviceId }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const navigate = useNavigate();
  const { completeLogin } = useContext(AuthContext);

  // Helper to format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    // ... (validations)

    setLoading(true);
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo: accept any 6-digit code
      if (/^\d{6}$/.test(otp)) {
        const result = await completeLogin(
          credentials.email,
          otp,
          deviceId
        );
        if (result.success) {
          navigate("/");
        } else {
          setError("Failed to complete login");
        }
      } else {
        setError("Invalid OTP format");
      }
    } catch (err) {
      setError("An error occurred during OTP verification");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setOtp("");
    setLoading(true);
    try {
      // Simulate resending OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimeLeft(300);
      // In real app, send OTP to email again
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #D6F4ED 0%, #87BAC3 100%)",
      }}
    >
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2
          className="text-3xl font-bold mb-2 text-center"
          style={{ color: "#473472" }}
        >
          Verify Login
        </h2>
        <p className="text-center mb-6" style={{ color: "#53629E" }}>
          Enter the OTP sent to <strong>{email}</strong>
        </p>

        {error && (
          <div
            className="border px-4 py-3 rounded-lg mb-4"
            style={{
              backgroundColor: "#FFE5E5",
              borderColor: "#FF6B6B",
              color: "#CC0000",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            <label
              className="block font-semibold mb-2"
              style={{ color: "#473472" }}
            >
              Enter OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="000000"
              maxLength="6"
              className="w-full px-4 py-3 text-center text-2xl border-2 rounded-lg focus:outline-none transition tracking-widest"
              style={{ borderColor: "#D6F4ED", color: "#473472" }}
              onFocus={(e) => (e.target.style.borderColor = "#87BAC3")}
              onBlur={(e) => (e.target.style.borderColor = "#D6F4ED")}
            />
          </div>

          <div className="text-center" style={{ color: "#53629E" }}>
            <p className="text-sm">
              OTP expires in:{" "}
              <strong style={{ color: timeLeft < 60 ? "#CC0000" : "#473472" }}>
                {formatTime(timeLeft)}
              </strong>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || timeLeft === 0}
            className="w-full text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50"
            style={{ backgroundColor: "#53629E" }}
            onMouseEnter={(e) =>
              !loading && (e.target.style.backgroundColor = "#473472")
            }
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#53629E")}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 space-y-2">
          <button
            onClick={handleResendOTP}
            disabled={loading}
            className="w-full text-center font-semibold py-2 rounded-lg transition"
            style={{
              color: "#53629E",
              backgroundColor: "transparent",
              border: "2px solid #53629E",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#D6F4ED")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            Resend OTP
          </button>

          <button
            onClick={onBack}
            disabled={loading}
            className="w-full text-center font-semibold py-2 rounded-lg transition"
            style={{
              color: "#473472",
              backgroundColor: "transparent",
              border: "2px solid #473472",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#D6F4ED")}
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = "transparent")
            }
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginOTPVerification;
