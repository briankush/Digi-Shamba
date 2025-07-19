import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineBarChart,
  AiOutlineCalendar,
  AiOutlineBook,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineLogout,
  AiOutlineUser
} from "react-icons/ai";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  // compute logged-in status from the token once on mount
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []); // removed [location] dependency

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navBg = "bg-green-600";
  const textColor = "text-white";

  const isLanding = location.pathname === "/";

  // Always include Home, then add protected links if logged in
  const mainLinks = [
    { to: "/", label: "Home", icon: <AiOutlineHome /> },
    ...(isLoggedIn ? [
      { to: "/dashboard", label: "Dashboard", icon: <AiOutlineBarChart /> },
      { to: "/add-animal", label: "Add Animal", icon: <AiOutlineCalendar /> },
      { to: "/daily-records", label: "Daily Records", icon: <AiOutlineCalendar /> },
      { to: "/resource-hub", label: "Resource Hub", icon: <AiOutlineBook /> }
    ] : [])
  ];

  // If not logged in, show Login & Sign Up; if logged in, show Logout
  const authLinks = isLoggedIn
    ? [{ action: handleLogout, label: "Logout", icon: <AiOutlineLogout /> }]
    : [
        { to: "/login",  label: "Login",   icon: <AiOutlineLogin /> },
        { to: "/signup", label: "Sign Up", icon: <AiOutlineUserAdd /> }
      ];

  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  return (
    <nav className={`fixed top-0 w-full ${navBg} shadow z-30`}>
      <div className="max-w-6xl mx-auto flex items-center px-4 py-3">
        {/* Brand */}
        <Link to="/" className={`${textColor} text-2xl font-bold`}>
          Digi-Shamba
        </Link>

        {/* Unified desktop menu aligned right */}
        <div className="hidden sm:flex sm:ml-auto sm:items-center sm:space-x-6">
          {mainLinks.map(link => (
            <Link key={link.to} to={link.to} className={`${textColor} flex items-center space-x-1 hover:underline`}>
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          {isLoggedIn && (
            <div className="relative">
              <button
                className={`${textColor} flex items-center space-x-1 hover:underline`}
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="User Profile"
              >
                <AiOutlineUser size={22} />
                <span className="hidden md:inline">{userName || "Profile"}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-lg z-50 text-black">
                  <div className="px-4 py-3 border-b">
                    <div className="font-semibold">{userName}</div>
                    <div className="text-sm text-gray-600">{userEmail}</div>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setProfileOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          {authLinks.map((link, idx) =>
            link.to ? (
              <Link key={idx} to={link.to} className={`${textColor} flex items-center space-x-1 hover:underline`}>
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ) : (
              <button key={idx} onClick={link.action} className={`${textColor} flex items-center space-x-1 hover:underline`}>
                {link.icon}
                <span>{link.label}</span>
              </button>
            )
          )}
        </div>

        {/* Mobile hamburger (push to right on small screens) */}
        <button
          className={`sm:hidden ml-auto ${textColor}`}
          onClick={() => setOpen(o => !o)}
        >
          {open ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="sm:hidden bg-white shadow-md">
          {mainLinks.map(link => (
            <li key={link.to} className="border-b">
              <Link
                to={link.to}
                className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                <span className="mr-2 text-xl">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
          {authLinks.map((link, idx) =>
            link.to ? (
              <li key={idx} className="border-b">
                <Link
                  to={link.to}
                  className="flex items-center px-4 py-3 text-gray-800 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <span className="mr-2 text-xl">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ) : (
              <li key={idx} className="border-b">
                <button
                  onClick={() => { link.action(); setOpen(false); }}
                  className="flex items-center w-full px-4 py-3 text-gray-800 hover:bg-gray-100"
                >
                  <span className="mr-2 text-xl">{link.icon}</span>
                  {link.label}
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </nav>
  );
}




