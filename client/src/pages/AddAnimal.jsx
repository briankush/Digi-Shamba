import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { FaCow } from "react-icons/fa6";
import { GiGoat, GiPig, GiChicken } from "react-icons/gi";

export default function AddAnimal() {
  const [selectedType, setSelectedType] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    birthDate: "",
    weight: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const userName = localStorage.getItem("userName") || "User";
  const fullMessage = `Hello, ${userName}!`;
  const [typedMsg, setTypedMsg] = useState("");
  
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setTypedMsg(fullMessage.slice(0, idx + 1));
      idx++;
      if (idx > fullMessage.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [fullMessage]);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    if (!token) {
      navigate("/login");
      return;
    }
    if (userRole === "Admin") {
      navigate("/admin");
      return;
    }
  }, [navigate]);

  // Original breed options per type
  const breedOptions = {
    Cow: ["Holstein", "Jersey", "Guernsey", "Angus"],
    Goat: ["Boer", "Nubian", "Kiko"],
    Pig: ["Yorkshire", "Berkshire", "Duroc"],
    Chicken: ["Leghorn", "Rhode Island Red", "Sussex"]
  };
  // Merge all options into one set
  const allBreeds = [...new Set([...breedOptions.Cow, ...breedOptions.Goat, ...breedOptions.Pig, ...breedOptions.Chicken])];

  const handleCardClick = (type) => {
    setSelectedType(type);
    // Reset form
    setFormData({
      name: "",
      breed: "",
      birthDate: "",
      weight: "",
      notes: "",
    });
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const { name, breed, type, birthDate, weight, notes } = formData;
    try {
      const API = import.meta.env.VITE_API_BASE_URL;
      // Remove any trailing slash from the API base URL
      const base = API.replace(/\/$/, "");
      // Use the correct route: POST /api/farm-animals
      const url = `${base}/api/farm-animals`;
      const animalData = { name, breed, type, birthDate, weight, notes };
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const res = await axios.post(url, animalData, { headers });
      console.log("Animal created:", res.data);
      setSuccess("Animal added successfully!");
      setFormData({
        name: "",
        breed: "",
        birthDate: "",
        weight: "",
        notes: "",
      });
    } catch (err) {
      console.error("Failed to create animal:", err);
      setError(
        err.response?.data?.message ||
        "An error occurred while adding the animal."
      );
    } finally {
      setLoading(false);
    }
  };

  // If error and no success, show error message
  if (error && !success)
    return (
      <div className="p-8 text-center text-red-600 font-semibold flex justify-center items-center gap-2">
        <AlertCircle className="w-6 h-6" /> {error}
      </div>
    );

  // View 1: Selection Cards
  if (!selectedType) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 p-6 sm:p-10 pt-20">
        {/* Greeting */}
        <div className="mb-6 mt-10 text-center">
          <h2 className="text-2xl font-medium text-green-700">
            {typedMsg}
            {typedMsg.length <= fullMessage.length && (
              <span className="blinking-cursor">|</span>
            )}
          </h2>
          <h1 className="text-4xl font-bold text-green-800 mt-4">
            Select Animal Type
          </h1>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">
          {/* Enlarged Card Styles via increased padding and min-h */}
          <div
            onClick={() => handleCardClick("Cow")}
            className="cursor-pointer bg-white shadow-lg rounded-xl p-8 flex flex-col items-center justify-center min-h-[12rem] hover:shadow-xl transition-all"
          >
            <FaCow className="text-green-600 w-20 h-20 mb-4" />
            <h3 className="text-2xl font-bold">Cow</h3>
          </div>
          <div
            onClick={() => handleCardClick("Goat")}
            className="cursor-pointer bg-white shadow-lg rounded-xl p-8 flex flex-col items-center justify-center min-h-[12rem] hover:shadow-xl transition-all"
          >
            <GiGoat className="text-green-600 w-20 h-20 mb-4" />
            <h3 className="text-2xl font-bold">Goat</h3>
          </div>
          <div
            onClick={() => handleCardClick("Pig")}
            className="cursor-pointer bg-white shadow-lg rounded-xl p-8 flex flex-col items-center justify-center min-h-[12rem] hover:shadow-xl transition-all"
          >
            <GiPig className="text-green-600 w-20 h-20 mb-4" />
            <h3 className="text-2xl font-bold">Pig</h3>
          </div>
          <div
            onClick={() => handleCardClick("Chicken")}
            className="cursor-pointer bg-white shadow-lg rounded-xl p-8 flex flex-col items-center justify-center min-h-[12rem] hover:shadow-xl transition-all"
          >
            <GiChicken className="text-green-600 w-20 h-20 mb-4" />
            <h3 className="text-2xl font-bold">Chicken</h3>
          </div>
        </div>
      </div>
    );
  }

  // View 2: Form - reduced form size (max-w-lg and p-4)
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 sm:p-10 pt-20">
      {/* Greeting */}
      <div className="mb-6 mt-10 text-center">
        <h2 className="text-2xl font-medium text-green-700">
          {typedMsg}
          {typedMsg.length <= fullMessage.length && (
            <span className="blinking-cursor">|</span>
          )}
        </h2>
        <h1 className="text-3xl font-bold text-green-800 mt-4">
          Add New {selectedType}
        </h1>
      </div>
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-4">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Name/Tag Number*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Breed*</label>
              <select
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                required
              >
                <option value="">Select breed</option>
                {allBreeds.map((breed, idx) => (
                  <option key={idx} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            ></textarea>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition-colors duration-300 flex justify-center items-center text-sm"
            >
              {loading ? "Adding..." : "Add " + selectedType}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
