import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AnimalForm from "../components/AnimalForm";
import AnalyticsDashboard from "./AnalyticsDashboard";

const API = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typedName, setTypedName] = useState("");
  const [typedMsg, setTypedMsg] = useState("");
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "Farmer"
  );
  const navigate = useNavigate();

  const fullMessage = `Welcome back, ${userName}!`;

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setTypedMsg(fullMessage.slice(0, idx + 1));
      idx++;
      if (idx > fullMessage.length) {
        clearInterval(interval);
      }
    }, 100); // normal speed
    return () => clearInterval(interval);
  }, [fullMessage]);

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/farm-animals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnimals(res.data);
    } catch (err) {
      setError("Failed to load animals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  // Delete with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/farm-animals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAnimals();
    } catch {
      setError("Failed to delete animal");
    }
  };

  const handleAddAnimal = () => {
    navigate("/add-animal");
  };

  if (loading) {
    return <div className="text-center p-8">Loading your animals...</div>;
  }

  // Editing state
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

export default Dashboard;




