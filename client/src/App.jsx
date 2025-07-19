import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Loader from "./components/Loader";

// lazy‐load pages
const LandingPage        = lazy(() => import("./pages/LandingPage"));
const Login              = lazy(() => import("./pages/Login"));
const Signup             = lazy(() => import("./pages/Signup"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const DailyRecords       = lazy(() => import("./pages/DailyRecords"));
const ResourceHub        = lazy(() => import("./pages/ResourceHub"));
const LoanResources      = lazy(() => import("./components/LoanResources"));
const Dashboard          = lazy(() => import("./pages/Dashboard"));
const Admin              = lazy(() => import("./pages/Admin"));
const AddAnimal          = lazy(() => import("./pages/AddAnimal")); // Add this import

function App() {
  return (
    <Router>
      <Navbar />
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* Analytics */}
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <AnalyticsDashboard />
                </PrivateRoute>
              }
            />

            {/* Daily Records */}
            <Route
              path="/daily-records"
              element={
                <PrivateRoute>
                  <DailyRecords />
                </PrivateRoute>
              }
            />

            {/* Alias /add-animal to the DailyRecords page */}
            <Route
              path="/add-animal"
              element={
                <PrivateRoute>
                  <AddAnimal />
                </PrivateRoute>
              }
            />

            {/* Resource Hub & Loans */}
            <Route path="/resource-hub" element={<ResourceHub />} />
            <Route path="/loans" element={<LoanResources />} />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;


