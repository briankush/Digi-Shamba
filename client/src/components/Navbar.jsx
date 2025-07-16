import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineDashboard, AiOutlinePlus, AiOutlineLogin, AiOutlineLogout, AiOutlineUser } from "react-icons/ai";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  return (
    <nav className="fixed top-0 w-full bg-green-700 text-white shadow z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* brand on left */}
        <span className="font-bold text-xl">Digi-Shamba</span>

        {/* navigation on right */}
        <div className="flex items-center gap-6">
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

