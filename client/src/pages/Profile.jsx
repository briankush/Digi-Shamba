import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function ProfileDropdown() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("Guest");
  const [email, setEmail] = useState("Not Provided");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProfileDropdown useEffect: user =", user);
    if (user) {
      setName(user.name || "Guest");
      setEmail(
        user.email && user.email.trim() !== ""
          ? user.email
          : "Not Provided"
      );
      setRole(user.role || "User");
      setLoading(false);
    } else {
      setName(localStorage.getItem("userName") || "Guest");
      setEmail(
        localStorage.getItem("userEmail") &&
          localStorage.getItem("userEmail").trim() !== ""
          ? localStorage.getItem("userEmail")
          : "Not Provided"
      );
      setRole(localStorage.getItem("userRole") || "User");
      setLoading(false);
    }
  }, [user, authLoading]);

  // Fetch user details from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }
    // Get baseUrl from environment and remove trailing slash.
    let baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
    // If backend expects the endpoint without '/api', remove '/api' from baseUrl.
    if (baseUrl.includes("/api")) {
      baseUrl = baseUrl.replace("/api", "");
    }
    console.log("Using baseUrl for profile fetch:", baseUrl);
    // Adjust the endpoint if necessary; here we call /auth/me
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${baseUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.user || res.data;
        // Check for missing fields from the backend and log warnings.
        const missingFields = [];
        if (!data.name) missingFields.push("name");
        if (!data.email) missingFields.push("email");
        if (!data.role) missingFields.push("role");
        if (missingFields.length > 0) {
          console.warn(
            "Backend response is missing field(s):",
            missingFields.join(", ")
          );
        }
        setName(data.name || "Guest");
        setEmail(
          data.email && data.email.trim() !== ""
            ? data.email
            : "Not Provided"
        );
        setRole(data.role || "User");
      } catch (err) {
        setError(
          "Failed to fetch profile. " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Avatar background color based on role
  const roleColor =
    role.toLowerCase() === "admin" ? "bg-red-400" : "bg-green-400";

  if (loading) {
    return <div className="p-8 text-center">Loading profile...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }
  if (!user) {
    return <div className="p-8 text-center">No user data available.</div>;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar */}
      <button
        onClick={toggleDropdown}
        className={`w-10 h-10 ${roleColor} text-white rounded-full flex items-center justify-center font-bold shadow-md hover:opacity-90 transition`}
        title="Profile"
      >
        {name.charAt(0).toUpperCase()}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-lg p-4 z-50 transform transition-all duration-200 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* User Info */}
        <div className="mb-3 border-b pb-2 text-center">
          <p className="font-semibold text-lg">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-xs text-gray-400 italic">{role}</p>
        </div>

        {/* Menu Links */}
        <ul className="space-y-2 text-gray-700">
          <li>
            <Link
              to={role.toLowerCase() === "admin" ? "/admin" : "/dashboard"}
              className="flex items-center gap-2 hover:text-green-600 transition"
            >
              🏠 Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="flex items-center gap-2 hover:text-green-600 transition"
            >
              ⚙️ Profile
            </Link>
          </li>
          <li>
            <Link
              to="/notifications"
              className="flex items-center gap-2 hover:text-green-600 transition"
            >
              🔔 Notifications
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:text-red-600 w-full text-left transition"
            >
              🚪 Log out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
