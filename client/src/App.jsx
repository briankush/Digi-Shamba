import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Loader from "./components/Loader";

// Lazy-load pages
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const DailyRecords = lazy(() => import("./pages/DailyRecords"));
const ResourceHub = lazy(() => import("./pages/ResourceHub"));
const LoanResources = lazy(() => import("./components/LoanResources"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/AdminDashboard"));
const AddAnimal = lazy(() => import("./pages/AddAnimal"));
const Profile = lazy(() => import("./pages/Profile"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public Routes */}
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

              {/* Analytics - accessible to non-admin users */}
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

              {/* Add Animal */}
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
              <Route
                path="/admin-dashboard"
                element={<Navigate to="/admin" replace />}
              />

              {/* Profile */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />

              {/* Change Password */}
              <Route
                path="/change-password"
                element={
                  <PrivateRoute>
                    <ChangePassword />
                  </PrivateRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}

export default App;

