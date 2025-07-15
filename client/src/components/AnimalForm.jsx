import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AnimalForm({ animalType, animal, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Populate form when editing
  useEffect(() => {
    if (animal) {
      setForm({
        name: animal.name,
        breed: animal.breed,
        age: animal.age,
        weight: animal.weight,
        notes: animal.notes || "",
      });
    }
  }, [animal]);

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
    const token = localStorage.getItem("token");
    try {
      if (animal) {
        // update existing
        await axios.put(
          `http://localhost:5000/api/farm-animals/${animal._id}`,
          { ...form, type: animalType },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // create new
        const owner = localStorage.getItem("userId");
        await axios.post(
          "http://localhost:5000/api/farm-animals",
          { ...form, type: animalType, owner },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      if (onSubmit) onSubmit();
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save animal.");
    }
  }

  const breedOptions = {
    Cows: [
      "Friesian",
      "Jersey",
      "Holstein",
      "Angus",
      "Guernsey",
      "Brown Swiss",
      "Hereford",
      "Charolais",
      "Simmental",
      "Brahman",
    ],
    Goats: [
      "Boer",
      "Kalahari",
      "Angora",
      "Alpine",
      "Nubian",
      "Saanen",
      "Toggenburg",
      "LaMancha",
      "Oberhasli",
      "Spanish",
    ],
    Chicken: [
      "Leghorn",
      "Rhode Island Red",
      "Plymouth Rock",
      "Sussex",
      "Wyandotte",
      "Silkie",
      "Orpington",
      "Australorp",
      "Marans",
      "Brahma",
    ],
    Pigs: [
      "Berkshire",
      "Yorkshire",
      "Hampshire",
      "Duroc",
      "Large White",
      "Landrace",
      "Tamworth",
      "Chester White",
      "Poland China",
      "Spot",
    ],
  };

  return (
    <form
      className="p-4 bg-gray-100 rounded-lg shadow w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <h3 className="text-xl font-bold mb-4">
        {animal ? "Edit" : "Add"} {animalType} Record
      </h3>
      {/* Name / Tag */}
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium">Name / Tag Number:</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="px-2 py-1 border rounded"
          placeholder="e.g. Daisy or Tag 123"
        />
      </div>
      {/* Breed */}
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium">Breed:</label>
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
      {/* Age */}
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium">Age (months):</label>
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          className="px-2 py-1 border rounded"
          placeholder="e.g. 24"
        />
      </div>
      {/* Weight */}
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium">Weight (kg):</label>
        <input
          name="weight"
          type="number"
          value={form.weight}
          onChange={handleChange}
          className="px-2 py-1 border rounded"
          placeholder="e.g. 350"
        />
      </div>
      {/* Notes */}
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium">Notes:</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="px-2 py-1 border rounded"
          placeholder="Any additional info"
        />
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-green-700 text-white rounded"
        >
          {animal ? "Update" : "Save"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-black rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}


