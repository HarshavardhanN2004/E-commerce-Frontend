import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const { token, role } = useSelector((state) => state.auth);

  // No JWT token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check JWT expiration
  try {
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));

    const currentTime = Date.now() / 1000;

    if (tokenPayload.exp && tokenPayload.exp < currentTime) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Invalid JWT
    return <Navigate to="/login" replace />;
  }

  // Check role if the route has role restrictions
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

