import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setName(localStorage.getItem("userName") || "Guest");
    setEmail(localStorage.getItem("userEmail") || "guest@example.com");
    setRole(localStorage.getItem("userRole") || "User");
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* Profile Circle */}
      <button
        onClick={toggleDropdown}
        className="w-10 h-10 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center font-bold"
      >
        {name.charAt(0).toUpperCase()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="mb-2 border-b pb-2">
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-500">{email}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 hover:text-green-600"
              >
                🏠 Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:text-green-600"
              >
                ⚙️ Settings
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="flex items-center gap-2 hover:text-green-600"
              >
                🔔 Notifications
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-red-600 w-full text-left"
              >
                🚪 Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
