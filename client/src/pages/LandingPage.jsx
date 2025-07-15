import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import cowImage from "../Images/cows.jfif";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${cowImage})` }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* page content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <Navbar />
        {/* increased heading size */}
        <h1 className="text-5xl font-bold mb-4">Digi-Shamba</h1>
        {/* increased paragraph font size */}
        <p className="mb-8 max-w-xl text-center text-lg">
          Digi-Shamba is a modern livestock record keeping platform for farmers.
          Easily manage your animals, track health, and streamline your farm
          operations.
        </p>
        <div className="flex gap-4">
          <button
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
