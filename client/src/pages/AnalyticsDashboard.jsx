import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";

export default function AnalyticsDashboard() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    month: "", feedKg: "", milkL: "", feedCost: "", produceValue: ""
  });
  const [error, setError] = useState("");

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/analytics", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEntries(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/analytics", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ month: "", feedKg: "", milkL: "", feedCost: "", produceValue: "" });
      fetchData();
    } catch (err) {
      setError("Failed to save entry");
    }
  };

  // prepare chart data from entries
  const feedData = entries.map(e => ({ month: e.month, feedKg: e.feedKg }));
  const produceData = entries.map(e => ({ month: e.month, milkL: e.milkL }));

  // safe last values
  const latestFeedKg = feedData.length > 0 ? feedData[feedData.length - 1].feedKg : 0;
  const latestMilkL = produceData.length > 0 ? produceData[produceData.length - 1].milkL : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      {/* Manual Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Monthly Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {["month","feedKg","milkL","feedCost","produceValue"].map(key => (
            <div key={key} className="flex flex-col">
              <label className="mb-1 font-medium">{key}</label>
              <input
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="border rounded px-2 py-1"
                required
              />
            </div>
          ))}
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        <button type="submit" className="mt-4 px-4 py-2 bg-green-700 text-white rounded">
          Save Entry
        </button>
      </form>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">This Month Feed</h2>
          <p className="text-2xl mt-2">{latestFeedKg} kg</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">This Month Milk</h2>
          <p className="text-2xl mt-2">{latestMilkL} L</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Profit / Loss</h2>
          <p className="text-2xl mt-2">+ $500</p>
        </div>
      </div>

      {/* Feed Consumption Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Feed Consumption</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={feedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="feedKg" fill="#4ade80" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Produce Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Monthly Milk Production</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={produceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="milkL" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
