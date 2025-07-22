import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // Check for any redirections like this:
  const userRole = localStorage.getItem("userRole");
  if (userRole === "Admin" && !location.pathname.includes("/admin")) {
    // Change from "/admin-dashboard" to "/admin"
    return <Navigate to="/admin" replace />;
  }

  return token ? children : <Navigate to="/login" replace />;
}
