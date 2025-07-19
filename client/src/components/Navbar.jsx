import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineBarChart,
  AiOutlineCalendar,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineLogout,
  AiOutlineBook
} from "react-icons/ai";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("userId"));
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navBg = "bg-green-600";
  const textColor = "text-white";

  const mainLinks = [
    { to: "/", label: "Home", icon: <AiOutlineHome /> },
    ...(isLoggedIn ? [
      { to: "/analytics", label: "Analytics", icon: <AiOutlineBarChart /> },
      { to: "/daily-records", label: "Daily Records", icon: <AiOutlineCalendar /> }
    ] : [])
  ];

  const authLinks = isLoggedIn
    ? [
        { to: "/resource-hub", label: "Resource Hub", icon: <AiOutlineBook /> },
        { action: handleLogout, label: "Logout", icon: <AiOutlineLogout /> }
      ]
    : [
        { to: "/login", label: "Login", icon: <AiOutlineLogin /> },
        { to: "/signup", label: "Sign Up", icon: <AiOutlineUserAdd /> }
      ];

  return (
    <nav className={`fixed top-0 w-full ${navBg} shadow z-30`}>
      <div className="max-w-6xl mx-auto flex items-center px-4 py-3">
        {/* Brand */}
        <Link to="/" className={`${textColor} text-2xl font-bold`}>
          Digi-Shamba
        </Link>

        {/* Unified desktop menu aligned right */}
        <div className="hidden sm:flex sm:ml-auto sm:items-center sm:space-x-8">
          {mainLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`${textColor} flex items-center space-x-1 hover:underline`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
          {authLinks.map((link, idx) =>
            link.to ? (
              <Link
                key={idx}
                to={link.to}
                className={`${textColor} flex items-center space-x-1 hover:underline`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ) : (
              <button
                key={idx}
                onClick={link.action}
                className={`${textColor} flex items-center space-x-1 hover:underline`}
              >
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


