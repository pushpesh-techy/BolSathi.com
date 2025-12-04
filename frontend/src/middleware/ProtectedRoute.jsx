import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          background: "linear-gradient(135deg, #D6F4ED 0%, #87BAC3 100%)",
        }}
      >
        <div className="text-xl font-semibold" style={{ color: "#473472" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
