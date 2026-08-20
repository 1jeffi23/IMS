import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useContext(AuthContext);

  // Session abhi load ho rahi hai
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Login nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;