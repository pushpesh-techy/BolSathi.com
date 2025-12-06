import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import { ProtectedRoute } from "../middleware/ProtectedRoute";

const RouteConfig = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={  
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default RouteConfig;
