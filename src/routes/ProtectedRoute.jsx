import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) =>
   {
      const { token, role } = useSelector((state) => state.auth);
      if (!token) 
        {
          return <Navigate to="/login" replace />;
        }
      try 
      {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      if (tokenPayload.exp && tokenPayload.exp < currentTime) 
        {
        return <Navigate to="/login" replace />;
      }
    } 
  catch (error) 
  {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(role)) 
  {
      return <Navigate to="/unauthorized" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;

