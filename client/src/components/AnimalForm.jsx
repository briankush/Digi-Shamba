import React, { useState } from "react";

export default function AnimalForm({ animalType, onSubmit }) {
  const [form, setForm] = useState({ breed: "", age: "", health: "" });
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.breed || !form.age || !form.health) {
      setError("All fields are required.");
      return;
    }
    setError("");
    if (onSubmit) onSubmit(form);
    // You can add API integration here using Axios or fetch
  }

  return (
    <form className="p-4 bg-gray-100 rounded-lg shadow w-full max-w-md" onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold mb-4">Add {animalType} Record</h3>
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700">Breed:</label>
        <input
          name="breed"
          value={form.breed}
          onChange={handleChange}
          className="px-2 py-1 border rounded placeholder:text-gray-400"
          placeholder="e.g. Friesian"
        />
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700">Age:</label>
        <input
          name="age"
          value={form.age}
          onChange={handleChange}
          className="px-2 py-1 border rounded placeholder:text-gray-400"
          placeholder="e.g. 2 years"
        />
      </div>
      <div className="flex flex-col gap-2 mb-2">
        <label className="text-sm font-medium text-gray-700">Health Status:</label>
        <input
          name="health"
          value={form.health}
          onChange={handleChange}
          className="px-2 py-1 border rounded placeholder:text-gray-400"
          placeholder="e.g. Healthy"
        />
      </div>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      <button className="mt-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition">
        Save
      </button>
    </form>
  );
}
