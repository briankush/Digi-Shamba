import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typedName, setTypedName] = useState("");
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail") || "";
  const userName = userEmail.split("@")[0] || "Farmer";
  const fullName = localStorage.getItem("userName") || "Farmer";

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      setTypedName(fullName.slice(0, idx + 1));
      idx++;
      if (idx > fullName.length) clearInterval(interval);
    }, 200); // slowed to 200ms
    return () => clearInterval(interval);
  }, [fullName]);

  useEffect(() => {
    const fetchAnimals = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      try {
        const res = await axios.get("http://localhost:5000/api/farm-animals", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAnimals(res.data);
      } catch (err) {
        setError("Unable to load animals");
      } finally {
        setLoading(false);
      }
    };
    fetchAnimals();
  }, [navigate]);

  const handleAddAnimal = () => {
    navigate("/add-animal");
  };

  if (loading) {
    return <div className="text-center p-8">Loading your animals...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome back, {typedName}
          <span className="blinking-cursor">|</span>
        </h2>
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
            {animals.map((animal) => (
              <div
                key={animal._id}
                className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold text-green-700">
                  {animal.name}
                </h3>
                <p>
                  <span className="font-medium">Type:</span> {animal.type}
                </p>
                <p>
                  <span className="font-medium">Breed:</span> {animal.breed}
                </p>
                <p>
                  <span className="font-medium">Age:</span> {animal.age} months
                </p>
                <p>
                  <span className="font-medium">Weight:</span> {animal.weight} kg
                </p>
                {animal.notes && (
                  <p className="mt-2 text-gray-600">
                    <span className="font-medium">Notes:</span> {animal.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;




