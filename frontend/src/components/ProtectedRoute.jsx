// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  // 1. Extract loading state from Context (Ensure your Context provides this!)
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 2. Prevent premature redirect while checking auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
if (!user) {
   
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
}


if (adminOnly && user.role !== "admin") {

  const role = (user.role || "").toString().toLowerCase();
  if (role !== "admin") {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
}


  return children;
};

export default ProtectedRoute;