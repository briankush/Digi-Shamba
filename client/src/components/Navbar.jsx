import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineBarChart,
  AiOutlineCalendar,
  AiOutlineBook,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineLogout,
  AiOutlineUser,
} from "react-icons/ai";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("userRole") || "");
  const navigate = useNavigate();
  const location = useLocation();

  // Ensure this runs every time the location changes to update login status
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setRole(localStorage.getItem("userRole") || "");
  }, [location.pathname]);

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.clear();
    setIsLoggedIn(false); // Update state immediately
    setProfileOpen(false); // Close dropdown if open
    setOpen(false); // Close mobile menu if open
    navigate("/login");
  };

  const isAdmin = role === "Admin";
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  // Active link style
  const activeStyle = "bg-green-700 text-white";
  const normalStyle = "text-white hover:bg-green-700 hover:text-white";

  return (
    <nav className="fixed w-full bg-green-600 shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-white text-2xl font-bold">
          Digi-Shamba
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Common links */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md ${isActive ? activeStyle : normalStyle}`
            }
          >
            <span className="flex items-center gap-2">
              <AiOutlineHome /> Home
            </span>
          </NavLink>

          {isLoggedIn && (
            <>
              {/* Dashboard - different route for admin vs farmer */}
              <NavLink
                to={isAdmin ? "/admin" : "/dashboard"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md ${
                    isActive ? activeStyle : normalStyle
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <AiOutlineBarChart /> Dashboard
                </span>
              </NavLink>

              {/* Analytics - visible to everyone */}
              {!isAdmin && (
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md ${
                      isActive ? activeStyle : normalStyle
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    <AiOutlineBarChart /> Analytics
                  </span>
                </NavLink>
              )}

              {/* Links only visible to farmers (non-admins) */}
              {!isAdmin && (
                <>
                  <NavLink
                    to="/daily-records"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md ${
                        isActive ? activeStyle : normalStyle
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      <AiOutlineCalendar /> Daily Records
                    </span>
                  </NavLink>

                  <NavLink
                    to="/add-animal"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md ${
                        isActive ? activeStyle : normalStyle
                      }`
                    }
                  >
                    <span className="flex items-center gap-2">
                      <AiOutlineCalendar /> Add Animal
                    </span>
                  </NavLink>
                </>
              )}
            </>
          )}

          {/* Resource hub - visible to everyone */}
          <NavLink
            to="/resource-hub"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md ${isActive ? activeStyle : normalStyle}`
            }
          >
            <span className="flex items-center gap-2">
              <AiOutlineBook /> Resources
            </span>
          </NavLink>

          {/* Authentication links */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="px-3 py-2 rounded-md text-white hover:bg-green-700"
                aria-label="User menu"
              >
                <span className="flex items-center gap-2">
                  <AiOutlineUser /> {userName || "Profile"}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{userName}</p>
                    <p className="text-sm text-gray-500">{userEmail}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    My Profile
                  </Link>
                  {/* Make sure logout button is prominent */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-gray-100 border-t border-gray-100"
                  >
                    <span className="flex items-center gap-2">
                      <AiOutlineLogout /> Logout
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md ${
                    isActive ? "bg-green-700 text-white" : "text-white hover:bg-green-700"
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <AiOutlineLogin /> Login
                </span>
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md ${
                    isActive ? "bg-green-700 text-white" : "text-white hover:bg-green-700"
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <AiOutlineUserAdd /> Sign Up
                </span>
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="md:hidden text-white"
        >
          {open ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `block px-4 py-3 ${
                isActive ? "bg-green-100 text-green-700" : "text-gray-800 hover:bg-gray-100"
              }`
            }
            onClick={() => setOpen(false)}
          >
            <span className="flex items-center gap-2">
              <AiOutlineHome /> Home
            </span>
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink
                to={isAdmin ? "/admin" : "/dashboard"}
                className={({ isActive }) =>
                  `block px-4 py-3 ${
                    isActive ? "bg-green-100 text-green-700" : "text-gray-800 hover:bg-gray-100"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <AiOutlineBarChart /> Dashboard
                </span>
              </NavLink>

              {/* Analytics link only for non-admins */}
              {!isAdmin && (
                <NavLink
                  to="/analytics"
                  className={({ isActive }) =>
                    `block px-4 py-3 ${
                      isActive ? "bg-green-100 text-green-700" : "text-gray-800 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <AiOutlineBarChart /> Analytics
                  </span>
                </NavLink>
              )}

              {/* Links only for farmers */}
              {!isAdmin && (
                <>
                  <NavLink
                    to="/daily-records"
                    className={({ isActive }) =>
                      `block px-4 py-3 ${
                        isActive ? "bg-green-100 text-green-700" : "text-gray-800 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <AiOutlineCalendar /> Daily Records
                    </span>
                  </NavLink>

                  <NavLink
                    to="/add-animal"
                    className={({ isActive }) =>
                      `block px-4 py-3 ${
                        isActive ? "bg-green-100 text-green-700" : "text-gray-800 hover:bg-gray-100"
                      }`
                    }
                    onClick={() => setOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <AiOutlineCalendar /> Add Animal
                    </span>
                  </NavLink>
                </>
              )}
            </>
          )}

          <NavLink
            to="/resource-hub"
            className={({ isActive }) =>
              `block px-4 py-3 ${
                isActive ? "bg-green-100 text-green-700" : "text-gray-800 hover:bg-gray-100"
              }`
            }
            onClick={() => setOpen(false)}
          >
            <span className="flex items-center gap-2">
              <AiOutlineBook /> Resources
            </span>
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `block px-4 py-3 ${
                    isActive ? "bg-green-100 text-green-700" : "text-gray-800 hover:bg-gray-100"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <AiOutlineUser /> My Profile
                </span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-100"
              >
                <span className="flex items-center gap-2">
                  <AiOutlineLogout /> Logout
                </span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `block px-4 py-3 ${
                    isActive ? "bg-green-100 text-green-700" : "text-gray-800 hover:bg-gray-100"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <AiOutlineLogin /> Login
                </span>
              </NavLink>
              <NavLink
                to="/signup"
                className={({ isActive }) =>
                  `block px-4 py-3 ${
                    isActive ? "bg-green-100 text-green-700" : "text-gray-800 hover:bg-gray-100"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <AiOutlineUserAdd /> Sign Up
                </span>
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}




