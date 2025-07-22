import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setName(localStorage.getItem("userName") || "Guest");
    setEmail(localStorage.getItem("userEmail") || "guest@example.com");
    setRole(localStorage.getItem("userRole") || "User");
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown if clicked outside
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
    role.toLowerCase() === "admin"
      ? "bg-red-400"
      : role.toLowerCase() === "manager"
      ? "bg-blue-400"
      : "bg-green-400";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Circle */}
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
        <div className="mb-3 border-b pb-2 text-center">
          <p className="font-semibold text-lg">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-xs text-gray-400 italic">{role}</p>
        </div>
        <ul className="space-y-2 text-gray-700">
          <li>
            <Link
              to="/dashboard"
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
              ⚙️ Settings
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
