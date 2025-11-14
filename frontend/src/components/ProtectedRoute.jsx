// src/components/ProtectedRoute.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);

  // Not logged in? Redirect to login
  if (!user) {
    return <Navigate to="/adminlogin" replace />;
  }

  // If adminOnly flag present, restrict further
  if (adminOnly && user.role !== "admin") {
    // You might adjust role logic to match your API/user schema
    return <Navigate to="/" replace />;
  }

  // Authenticated (and admin, if needed)
  return children;
};

export default ProtectedRoute;
