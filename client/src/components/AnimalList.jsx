import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AnimalList({ animalType, onEdit, onDelete }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_BASE_URL;
    axios
      .get(`${API}/animals?type=${animalType}`)
      .then((res) => setRecords(res.data))
      .catch(() => setRecords([]));
  }, [animalType]);

  return (
    <table className="w-full mt-6 bg-gray-100 rounded shadow">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left">Breed</th>
          <th className="px-4 py-2 text-left">Age</th>
          <th className="px-4 py-2 text-left">Health</th>
          <th className="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {records && records.length > 0 ? (
          records.map((rec, idx) => (
            <tr key={idx}>
              <td className="px-4 py-2">{rec.breed}</td>
              <td className="px-4 py-2">{rec.age}</td>
              <td className="px-4 py-2">{rec.health}</td>
              <td className="px-4 py-2">
                <button
                  className="mr-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => onEdit && onEdit(rec)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => onDelete && onDelete(rec)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
              No records found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
