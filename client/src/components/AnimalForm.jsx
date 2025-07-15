import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AnimalForm({ animalType }) {
  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // breed options per animal type
  const breedOptions = {
    Cows: ["Friesian", "Jersey", "Holstein", "Angus"],
    Goats: ["Boer", "Kalahari", "Angora", "Alpine"],
    Chicken: ["Leghorn", "Rhode Island Red", "Plymouth Rock"],
    Pigs: ["Berkshire", "Yorkshire", "Hampshire", "Duroc"],
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.breed || !form.age || !form.weight) {
      setError("All fields except notes are required.");
      return;
    }
    setError("");
    try {
      const token = localStorage.getItem("token");
      const owner = localStorage.getItem("userId");

      const response = await axios.post(
        "http://localhost:5000/api/farm-animals",
        {
          ...form,
          type: animalType,
          owner,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Animal created:", response.data);

      alert("Animal added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Create animal failed:", err.response || err);
      setError(err.response?.data?.message || "Failed to save animal.");
    }
  }

  return (
    <form
      className="p-4 bg-gray-100 rounded-lg shadow w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-bold mb-4">Add {animalType} Record</h3>
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700">
          Name / Tag Number:
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="px-2 py-1 border rounded placeholder:text-gray-400"
          placeholder="e.g. Daisy or Tag 123"
        />
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700">Breed:</label>
        <select
          name="breed"
          value={form.breed}
          onChange={handleChange}
          className="px-2 py-1 border rounded bg-white"
        >
          <option value="">Select breed</option>
          {breedOptions[animalType]?.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700">
          Age (months):
        </label>
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          className="px-2 py-1 border rounded placeholder:text-gray-400"
          placeholder="e.g. 24"
        />
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700">
          Weight (kg):
        </label>
        <input
          name="weight"
          type="number"
          value={form.weight}
          onChange={handleChange}
          className="px-2 py-1 border rounded placeholder:text-gray-400"
          placeholder="e.g. 350"
        />
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700">Notes:</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="px-2 py-1 border rounded placeholder:text-gray-400"
          placeholder="Any additional info"
        />
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <button className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition">
        Save
      </button>
    </form>
  );
}


