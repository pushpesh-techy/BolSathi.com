import React, { createContext, useState, useEffect } from "react";

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
      // Simulate API call - replace with actual API
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "OTP sent to your email",
          });
        }, 1000);
      });

      if (response.success) {
        // Store signup data temporarily (not verified yet)
        localStorage.setItem("tempSignup", JSON.stringify(userData));
        return { success: true, message: response.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const completeSignup = async (userData) => {
    try {
      // After OTP verification, save the user data
      const verifiedUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        verifiedAt: new Date().toISOString(),
      };

      // Store verified signup data with password
      const registeredUser = {
        ...verifiedUser,
        password: userData.password,
      };

      localStorage.setItem("verifiedSignup", JSON.stringify(registeredUser));
      localStorage.removeItem("tempSignup");

      return { success: true, message: "Email verified successfully" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      // Simulate API call - verify credentials exist
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          const verifiedSignup = localStorage.getItem("verifiedSignup");
          if (verifiedSignup) {
            const signupData = JSON.parse(verifiedSignup);
            if (
              signupData.email === email &&
              signupData.password === password
            ) {
              resolve({
                success: true,
                needsOTP: true,
                user: {
                  id: signupData.id,
                  email: email,
                  name: signupData.name,
                  phone: signupData.phone,
                  verifiedAt: signupData.verifiedAt,
                },
              });
            } else {
              resolve({ success: false, error: "Invalid credentials" });
            }
          } else {
            resolve({
              success: false,
              error: "User not found. Please signup first.",
            });
          }
        }, 1000);
      });

      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const completeLogin = async (email, password) => {
    try {
      // After OTP verification, complete the login
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          const verifiedSignup = localStorage.getItem("verifiedSignup");
          if (verifiedSignup) {
            const signupData = JSON.parse(verifiedSignup);
            if (
              signupData.email === email &&
              signupData.password === password
            ) {
              resolve({
                success: true,
                user: {
                  id: signupData.id,
                  email: email,
                  name: signupData.name,
                  phone: signupData.phone,
                  verifiedAt: signupData.verifiedAt,
                },
                token: "auth_token_" + Date.now(),
              });
            } else {
              resolve({ success: false, error: "Invalid credentials" });
            }
          } else {
            resolve({
              success: false,
              error: "User not found. Please signup first.",
            });
          }
        }, 1000);
      });

      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("loginTime", new Date().toISOString());
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
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
