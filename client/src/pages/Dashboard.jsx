import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AnimalForm from "../components/AnimalForm";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default function Dashboard() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typedMsg, setTypedMsg] = useState("");
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [userName, setUserName] = useState("Farmer");
  const navigate = useNavigate();

  useEffect(() => {
    // Update userName state on mount so it reflects the value stored from backend.
    setUserName(localStorage.getItem("userName") || "Farmer");
  }, []);

  // Define fullMessage so it is in scope for the render.
  const fullMessage = `Welcome back, ${userName}!`;

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setTypedMsg(fullMessage.slice(0, idx + 1));
      idx++;
      if (idx > fullMessage.length) clearInterval(interval);
    }, 100); // normal speed
    return () => clearInterval(interval);
  }, [fullMessage]);

  // Add a fetchAnimals function that can be called from useEffect and other places
  const fetchAnimals = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
      console.log("Fetching animals from:", `${baseUrl}/farm-animals`);
      console.log("Using token:", token.substring(0, 15) + "...");

      const response = await axios.get(`${baseUrl}/farm-animals`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        }
      });

      console.log("Animals response:", response.data);
      setAnimals(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (fetchError) {
      // Remove fallback sample data logic
      // Only show the real error from the backend
      const errorMessage =
        fetchError.response?.data?.details ||
        fetchError.response?.data?.message ||
        fetchError.message;
      setError(`Server error: ${errorMessage}`);
      setLoading(false);

      // If there's a token issue, redirect to login
      if (fetchError.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  // Fix the handleDelete function to use the fetchAnimals function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");

      await axios.delete(`${baseUrl}/farm-animals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAnimals();
    } catch (err) {
      setError("Failed to delete animal: " + err.message);
    }
  };

  const handleAddAnimal = () => {
    navigate("/add-animal");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Add a retry button if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => {
              setLoading(true);
              setError("");
              window.location.reload();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (editingAnimal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <AnimalForm
          animalType={editingAnimal.type}
          animal={editingAnimal}
          onSubmit={() => {
            setEditingAnimal(null);
            fetchAnimals();
          }}
          onCancel={() => setEditingAnimal(null)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-8 pt-20">
      <h2 className="text-2xl font-semibold mb-4">
        {typedMsg}
        {typedMsg.length <= fullMessage.length && (
          <span className="blinking-cursor">|</span>
        )}
      </h2>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Farm Animals</h1>
          <div className="flex gap-2">
            <button
              onClick={handleAddAnimal}
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
            >
              Add New Animal
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!error && animals.length === 0 ? (
          <div className="text-center p-8 bg-gray-100 rounded-lg">
            <p className="mb-4 font-bold text-xl">
              You haven't added any animals yet.
            </p>
            <p className="mb-4 text-gray-600">
              Your animals will appear here after you add them. Click the button
              below to add your first animal.
            </p>
            <button
              onClick={handleAddAnimal}
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
            >
              Add Your First Animal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map((a) => (
              <div key={a._id} className="bg-gray-100 p-4 rounded shadow">
                <h3 className="text-xl font-bold text-green-700">{a.name}</h3>
                <p>
                  <span className="font-medium">Type:</span> {a.type}
                </p>
                <p>
                  <span className="font-medium">Breed:</span> {a.breed}
                </p>
                <p>
                  <span className="font-medium">Age:</span> {a.age} months
                </p>
                <p>
                  <span className="font-medium">Weight:</span> {a.weight} kg
                </p>
                {a.notes && (
                  <p className="mt-2 text-gray-600">
                    <span className="font-medium">Notes:</span> {a.notes}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setEditingAnimal(a)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
               