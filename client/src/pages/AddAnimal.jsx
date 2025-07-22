import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { FaCow } from "react-icons/fa6";

export default function AddAnimal() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
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

  // Typing animation
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
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      const API = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      
      await axios.post(
        `${API}/animals`, 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess("Animal added successfully!");
      setFormData({
        name: "",
        type: "",
        breed: "",
        birthDate: "",
        weight: "",
        notes: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add animal");
    } finally {
      setLoading(false);
    }
  };

  if (error && !success) {
    return (
      <div className="p-8 text-center text-red-600 font-semibold flex justify-center items-center gap-2">
        <AlertCircle className="w-6 h-6" /> {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 sm:p-10">
      {/* Greeting */}
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-green-700">
          {typedMsg}
          {typedMsg.length <= fullMessage.length && (
            <span className="blinking-cursor">|</span>
          )}
        </h2>
        <h1 className="text-4xl font-bold text-center mt-4 text-green-800">
          Add New Animal
        </h1>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <FaCow className="text-green-600 w-10 h-10" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Name/Tag Number*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Type*</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Select type</option>
                <option value="Cow">Cow</option>
                <option value="Goat">Goat</option>
                <option value="Sheep">Sheep</option>
                <option value="Chicken">Chicken</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Breed</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-gray-700 mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            ></textarea>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-md transition-colors duration-300 flex justify-center items-center"
            >
              {loading ? "Adding..." : "Add Animal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
