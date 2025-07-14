import React from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <h1 className="text-4xl font-bold mb-4">Digi-Shamba</h1>
      <p className="mb-8 max-w-xl text-center">
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
  );
}

export default LandingPage;
