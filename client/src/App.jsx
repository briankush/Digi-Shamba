import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Loader from "./components/Loader";

// lazy‐load pages
const LandingPage       = lazy(() => import("./pages/LandingPage"));
const Login             = lazy(() => import("./pages/Login"));
const Signup            = lazy(() => import("./pages/Signup"));
const AnalyticsDashboard= lazy(() => import("./pages/AnalyticsDashboard"));
const DailyRecords      = lazy(() => import("./pages/DailyRecords"));
const ResourceHub       = lazy(() => import("./pages/ResourceHub"));
const LoanResources     = lazy(() => import("./components/LoanResources"));
const Dashboard         = lazy(() => import("./pages/Dashboard"));

function App() {
  const isAdmin = localStorage.getItem("userRole") === "Admin"; // <— dynamic

  return (
    <Router>
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* redirect old /dashboard to /analytics */}
            <Route path="/dashboard" element={<Navigate to="/analytics" replace />} />
            <Route 
              path="/analytics" 
              element={
                <PrivateRoute>
                  <AnalyticsDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/daily-records" 
              element={
                <PrivateRoute>
                  <DailyRecords />
                </PrivateRoute>
              } 
            />
            <Route path="/loans" element={<LoanResources />} />      {/* <--- new */}
            <Route path="/resource-hub" element={<ResourceHub />} />   {/* new */}
            <Route path="/dashboard" element={<Dashboard />} />                {/* <--- new */}
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;


