import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // Fetch entries with auth header
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      const res = await axios.get("http://localhost:5000/api/analytics", {
        headers: { Authorization: `Bearer ${token}` }  // <— add header
      });
      setEntries(res.data);
    } catch (err) {
      console.error("GET /api/analytics error:", err);
      // fallback to dummy data
      setEntries([
        { month: "May", feedKg: 1200, milkL: 800, feedCost: 0.5, produceValue: 1.2, totalFeedCost: 1200*0.5, totalProduceRevenue: 800*1.2, profitLoss: 800*1.2 - 1200*0.5 },
        { month: "Jun", feedKg: 1300, milkL: 850, feedCost: 0.5, produceValue: 1.2, totalFeedCost: 1300*0.5, totalProduceRevenue: 850*1.2, profitLoss: 850*1.2 - 1300*0.5 }
      ]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      await axios.post(
        "http://localhost:5000/api/analytics",
        form,
        {
          headers: { Authorization: `Bearer ${token}` }   // add auth header
        }
      );
      setForm({ month: "", feedKg: "", milkL: "", feedCost: "", produceValue: "" });
      fetchData();
    } catch (err) {
      console.error("POST /api/analytics error:", err);
      setError(err.response?.data?.message || "Failed to save entry");
    }
  };

  // prepare chart data from entries
  const feedData = entries.map(e => ({ month: e.month, feedKg: e.feedKg, milkL: e.milkL }));
  const produceData = entries.map(e => ({ month: e.month, milkL: e.milkL }));
  const profitData = entries.map(e => ({ month: e.month, profitLoss: e.profitLoss }));

  // latest vs previous
  const current = entries[entries.length - 1] || {};
  const previous = entries[entries.length - 2] || {};
  const currProfit = current.profitLoss ?? 0;
  const prevProfit = previous.profitLoss ?? 0;
  const diff = currProfit - prevProfit;
  const sign = diff >= 0 ? "+" : "-";
  const diffColor = diff >= 0 ? "text-green-600" : "text-red-600";

  // safe last values
  const latestFeedKg = feedData.length > 0 ? feedData[feedData.length - 1].feedKg : 0;
  const latestMilkL = produceData.length > 0 ? produceData[produceData.length - 1].milkL : 0;

  // derive latest metrics
  const latestEntry = entries[entries.length - 1] || {};
  const latestFeedCost = latestEntry.totalFeedCost || 0;
  const latestProduceRevenue = latestEntry.totalProduceRevenue || 0;
  const latestProfitLoss = latestEntry.profitLoss || 0;

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
          <h2 className="text-xl font-semibold">This Month Feed Cost</h2>
          <p className="text-2xl mt-2">{latestFeedCost} Ksh</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">This Month Milk Revenue</h2>
          <p className="text-2xl mt-2">{latestProduceRevenue} Ksh</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Profit / Loss</h2>
          <p className="text-2xl mt-2">
            {latestProfitLoss >= 0 ? "Profit: " : "Loss: "}
            {Math.abs(latestProfitLoss)} Ksh
          </p>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Profit / Loss Comparison</h2>
        <div className="flex gap-8">
          <div>
            <p className="text-sm text-gray-500">Previous Month</p>
            <p className="text-2xl">{prevProfit} Ksh</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Month</p>
            <p className="text-2xl">{currProfit} Ksh</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Change</p>
            <p className={`text-2xl ${diffColor}`}>{sign}{Math.abs(diff)} Ksh</p>
          </div>
        </div>
      </div>

      {/* Profit/Loss Line Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Profit/Loss Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart 
            data={profitData} 
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />               {/* x-axis tick labels */}
            <YAxis />                                {/* y-axis tick values */}
            <Tooltip formatter={value => `${value} Ksh`} />
            <Legend />                               {/* legend for the line */}
            <Line
              type="monotone"
              dataKey="profitLoss"
              name="Profit/Loss"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Combined Feed & Produce Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Monthly Feed vs Milk</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={feedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="feedKg" name="Feed (kg)" fill="#4ade80" />
            <Bar dataKey="milkL" name="Milk (L)" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
