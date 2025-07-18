import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineDashboard, AiOutlinePlus, AiOutlineLogin, AiOutlineLogout, AiOutlineUser, AiOutlineBarChart, AiOutlineCalendar } from "react-icons/ai";
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

  const isAdmin = localStorage.getItem("userRole") === "Admin";

  const links = [
    { to: "/", label: "Home" },
    { to: "/analytics", label: "Analytics" },
    { to: "/daily-records", label: "Daily Records" },
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Sign Up" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-green-700 text-white shadow z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* brand on left */}
        <span className="font-bold text-xl">Digi-Shamba</span>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* navigation on right */}
        <div className={`flex items-center gap-6 md:static absolute bg-green-700 w-full left-0 md:w-auto md:bg-transparent transition-all duration-300 ease-in
          ${open ? "top-full opacity-100" : "top-[-300px] opacity-0"}`}>
          <Link to="/" className="flex items-center gap-1 hover:underline">
            <AiOutlineHome size={20}/> Home
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-1 hover:underline">
                <AiOutlineDashboard size={20}/> Dashboard
              </Link>
              <Link to="/add-animal" className="flex items-center gap-1 hover:underline">
                <AiOutlinePlus size={20}/> Add Animal
              </Link>
              <Link to="/daily-records" className="flex items-center gap-1 hover:underline">
                <AiOutlineCalendar size={20}/> Daily Records
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 hover:underline">
                <AiOutlineLogout size={20}/> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1 hover:underline">
                <AiOutlineLogin size={20}/> Login
              </Link>
              <Link to="/signup" className="flex items-center gap-1 hover:underline">
                <AiOutlineUser size={20}/> Sign Up
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1 hover:underline">
              <AiOutlineDashboard size={20}/> Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
