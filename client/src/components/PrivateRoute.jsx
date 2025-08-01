import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Debug what's happening with routes
  useEffect(() => {
    console.log("PrivateRoute rendered at path:", location.pathname);
    console.log("Token exists:", !!token);
  }, [location.pathname, token]);

  // ONLY check authentication, nothing else
  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Important: Don't do any role-based redirection here
  // Just return the children component
  console.log("User authenticated, rendering children");
  return <>{children}</>;
}
