import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Add debug logs
  console.log("Profile page rendering, current user:", user);

  useEffect(() => {
    // Don't add any navigation logic here that might cause premature redirects
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
        console.log("Fetching profile from:", `${baseUrl}/auth/me`);

        const res = await axios.get(`${baseUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Profile data received:", res.data);
        const data = res.data.user || res.data;

        setProfileData({
          name: data.name || localStorage.getItem("userName") || "Guest",
          email: data.email || localStorage.getItem("userEmail") || "Not Provided",
          role: data.role || localStorage.getItem("userRole") || "User",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);

        // Fallback to localStorage
        setProfileData({
          name: localStorage.getItem("userName") || "Guest",
          email: localStorage.getItem("userEmail") || "Not Provided",
          role: localStorage.getItem("userRole") || "User",
        });
        setError("Could not fetch profile from server. Showing local data.");
      } finally {
        // Always set loading to false regardless of success/failure
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Show loading spinner while loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  // Ensure profileData is fetched and email is displayed
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 sm:p-10 pt-20">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-green-800">Your Profile</h1>

        {profileData && (
          <>
            <div className="flex items-center mb-8">
              <div
                className={`w-16 h-16 ${
                  profileData.role?.toLowerCase() === "admin"
                    ? "bg-red-400"
                    : "bg-green-400"
                } text-white rounded-full flex items-center justify-center text-2xl font-bold mr-4`}
              >
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.role}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">
                  {/* Show email from profileData, fallback to user or localStorage */}
                  {profileData?.email && profileData.email.trim() !== ""
                    ? profileData.email
                    : user?.email && user.email.trim() !== ""
                    ? user.email
                    : localStorage.getItem("userEmail") &&
                      localStorage.getItem("userEmail").trim() !== ""
                    ? localStorage.getItem("userEmail")
                    : "Not Provided"}
                </p>
              </div>
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{profileData.role}</p>
              </div>
            </div>
          </>
        )}

        <div className="pt-4 flex flex-col sm:flex-row justify-between mt-4 gap-2">
          <button
            onClick={() =>
              navigate(
                profileData?.role?.toLowerCase() === "admin"
                  ? "/admin"
                  : "/dashboard"
              )
            }
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate("/change-password")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Change Password
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
        {/* Show error if present */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}