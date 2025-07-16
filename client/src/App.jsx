import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddAnimal from "./pages/AddAnimal";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";

function App() {
  const isAdmin = localStorage.getItem("userRole") === "Admin"; // <— dynamic

  return (
    <Router>
      <Navbar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-animal" element={<AddAnimal />} />
          <Route
            path="/admin"
            element={
              isAdmin
                ? <AdminDashboard />
                : <Navigate to="/login" replace />
            }
          />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

