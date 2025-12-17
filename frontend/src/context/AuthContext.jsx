import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("authToken");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const signup = async (userData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", userData);

      if (response.data.success) {
        // Store signup data temporarily (not verified yet) for email re-use if needed
        // backend doesn't return user data yet, just success msg
        localStorage.setItem("tempSignup", JSON.stringify(userData));
        return { success: true, message: response.data.message };
      } else {
          return { success: false, error: response.data.error || "Signup failed" };
      }
    } catch (error) {
       console.error("Signup error:", error);
       return { success: false, error: error.response?.data?.error || error.message };
    }
  };
  const completeSignup = async (userData) => {
    try {
       // userData coming from generic OTP component usually has { email, otp, ... }
       // But Signup.jsx passes { ...formData, otp } usually.
       // Let's ensure we extract email and otp.
       const { email, otp } = userData;

       const response = await axios.post("http://localhost:5000/api/auth/verify-signup", { email, otp });

       if (response.data.success) {
            const { user, token } = response.data;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("authToken", token);
            localStorage.setItem("loginTime", new Date().toISOString());
            
            setUser(user);
            setIsAuthenticated(true);
            localStorage.removeItem("tempSignup");

            return { success: true, message: "Email verified successfully" };
       } else {
            return { success: false, error: response.data.error };
       }
    } catch (error) {
       console.error("Verification error:", error);
       return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  const login = async (email, password, deviceId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password, deviceId });

      if (response.data.success) {
          // If needsOTP is false, user is logged in (Trusted Device)
          if (response.data.needsOTP === false) {
             const { user, token } = response.data;
             localStorage.setItem("user", JSON.stringify(user));
             localStorage.setItem("authToken", token);
             localStorage.setItem("loginTime", new Date().toISOString());
             
             setUser(user);
             setIsAuthenticated(true);
          }

          return { 
              success: true, 
              needsOTP: response.data.needsOTP, 
              message: response.data.message 
          };
      } else {
          return { success: false, error: response.data.error };
      }
    } catch (error) {
       console.error("Login error:", error);
       return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  const completeLogin = async (email, passwordOrOtp, deviceId) => {
    // Note: The original signature was (email, password), but in the OTP flow for login
    // we typically send (email, otp). Looking at Login.jsx:
    // It uses LoginOTPVerification -> onComplete -> completeLogin(email, otp)
    // So the second argument is actually the OTP.
    const otp = passwordOrOtp;

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-login", { email, otp, deviceId });

      if (response.data.success) {
        const { user, token } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("authToken", token);
        localStorage.setItem("loginTime", new Date().toISOString());
        
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, user: user };
      } else {
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.error("Complete login error:", error);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("loginTime");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserData = (newData) => {
    const updatedUser = { ...user, ...newData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        signup,
        completeSignup,
        login,
        completeLogin,
        logout,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
