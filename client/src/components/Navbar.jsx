import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLanding, setIsLanding] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLanding(location.pathname === "/");
  }, [location]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav
      className={`fixed top-0 w-full z-20 p-4 flex justify-between items-center ${
        isLanding
          ? "bg-green-700/80 backdrop-blur-md text-white"
          : "bg-green-700 text-white"
      }`}
    >
      <span className="font-bold text-xl">Digi-Shamba</span>
      <div className="flex gap-4">
        <Link to="/" className="hover:underline">Home</Link>

        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/add-animal" className="hover:underline">Add Animal</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
