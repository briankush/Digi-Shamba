import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import { FaCalendarAlt } from "react-icons/fa";

// Move months outside the component to avoid new array reference each render
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AnalyticsDashboard() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ month: "", feedKg: "", milkL: "", feedCost: "", produceValue: "" });
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [milkData, setMilkData] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Normalize month to "Jan", "Feb", etc.
  const normalizeMonth = (m) => {
    const match = months.find(mon => mon.toLowerCase() === m.toLowerCase().slice(0, 3));
    return match || m;
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setLoading(true);
    try {
      // Fetch analytics data
      const res = await axios.get(`/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEntries(res.data);

      // Fetch monthly milk totals for each month
      const currentYear = new Date().getFullYear();
      const milkTotals = {};
      for (let i = 0; i < months.length; i++) {
        try {
          const r = await axios.get(
            `/daily-records/monthly-totals/${currentYear}/${i + 1}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          milkTotals[months[i]] = r.data?.totalMilk || 0;
        } catch {
          milkTotals[months[i]] = 0;
        }
      }
      setMilkData(milkTotals);
    } catch (err) {
      setError("Failed to load analytics");
    }
    setLoading(false);
  }, [navigate]); // Remove months from dependency

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sort entries by month
  const sorted = useMemo(() => {
    return [...entries].sort((a, b) =>
      months.indexOf(a.month) - months.indexOf(b.month)
    );
  }, [entries]); // Remove months from dependency

  // Current & Previous entries
  const currEntry = sorted.find(e => e.month === selectedMonth) || {};
  
  // Get previous month index with wrap-around (Dec is previous to Jan)
  const currentMonthIndex = months.indexOf(selectedMonth);
  const prevMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
  const prevMonthName = months[prevMonthIndex];
  
  const prevEntry = sorted.find(e => e.month === prevMonthName) || {};

  // Current calculations
  const {
    feedKg: cfk = 0,
    feedCost: cpc = 0,
    milkL: cml = 0,
    produceValue: cpp = 0,
    totalFeedCost: tfc,
    totalProduceRevenue: tpr,
    profitLoss: tpl
  } = currEntry;

  const computedFeedCost = tfc != null ? tfc : cfk * cpc;
  const computedRevenue = currEntry.totalProduceRevenue != null 
    ? currEntry.totalProduceRevenue 
    : (cml || 0) * (cpp || 0);
  const computedProfit = tpl != null 
    ? tpl 
    : computedRevenue - computedFeedCost;

  // Previous calculations
  const {
    feedKg: pfk = 0,
    feedCost: ppc = 0,
    milkL: pml = 0,
    produceValue: ppp = 0,
    profitLoss: ppl
  } = prevEntry;

  const prevProfit = ppl != null ? ppl : (pml * ppp) - (pfk * ppc);

  // Difference
  const diff = computedProfit - prevProfit;
  const sign = diff >= 0 ? "+" : "-";
  const diffColor = diff >= 0 ? "text-green-600" : "text-red-600";

  // Remove all logging from chartData and related memoized functions
  const chartData = useMemo(() => {
    return months.map(m => {
      const entry = sorted.find(e => e.month === m) || {};
      const dailyRecordMilk = milkData[m];
      const analyticsMilk = entry.milkL;
      const milkAmount = dailyRecordMilk !== undefined && dailyRecordMilk !== null
        ? dailyRecordMilk
        : (analyticsMilk || 0);
      return {
        month: m,
        feedKg: entry.feedKg || 0,
        milkL: milkAmount,
        profitLoss: entry.profitLoss !== undefined ? entry.profitLoss : 0
      };
    });
  }, [sorted, milkData]); // Remove months from dependency

  const profitData = useMemo(() => (
    chartData.map(d => ({ month: d.month, profitLoss: d.profitLoss }))
  ), [chartData]);

  const feedProduceData = useMemo(() => (
    chartData.map(d => ({ month: d.month, feedKg: d.feedKg, milkL: d.milkL }))
  ), [chartData]);

  // Update current entry calculations to use milk data from daily records if available
  const getCurrEntryWithMilk = () => {
    const currEntry = sorted.find(e => e.month === selectedMonth) || {};
    
    // If we have milk data for this month from daily records, use it
    if (milkData[selectedMonth] !== undefined) {
      return {
        ...currEntry,
        milkL: milkData[selectedMonth],
        // Also recalculate the revenue if we have milk value information
        totalProduceRevenue: milkData[selectedMonth] * (currEntry.produceValue || 0)
      };
    }
    
    return currEntry;
  };
  
  // Get updated current entry with milk data
  const currEntryWithMilk = getCurrEntryWithMilk();
  
  // Current calculations
  const {
    feedKg: cfk2 = 0,
    feedCost: cpc2 = 0,
    milkL: cml2 = 0,
    produceValue: cpp2 = 0,
    totalFeedCost: tfc2,
    totalProduceRevenue: tpr2,
    profitLoss: tpl2
  } = currEntryWithMilk;

  const computedFeedCost2 = tfc2 != null ? tfc2 : cfk2 * cpc2;
  const computedRevenue2 = tpr2 != null ? tpr2 : cml2 * cpp2;
  const computedProfit2 = tpl2 != null ? tpl2 : computedRevenue2 - computedFeedCost2;

  // Previous calculations
  const {
    feedKg: pfk2 = 0,
    feedCost: ppc2 = 0,
    milkL: pml2 = 0,
    produceValue: ppp2 = 0,
    profitLoss: ppl2
  } = prevEntry;

  const prevProfit2 = ppl2 != null ? ppl2 : (pml2 * ppp2) - (pfk2 * ppc2);

  // Difference
  const diff2 = computedProfit2 - prevProfit2;
  const sign2 = diff2 >= 0 ? "+" : "-";
  const diffColor2 = diff2 >= 0 ? "text-green-600" : "text-red-600";

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const payload = {
      month: normalizeMonth(form.month),
      feedKg: parseFloat(form.feedKg),
      milkL: parseFloat(form.milkL),
      feedCost: parseFloat(form.feedCost),
      produceValue: parseFloat(form.produceValue)
    };

    try {
      await axios.post(`/analytics`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ month: "", feedKg: "", milkL: "", feedCost: "", produceValue: "" });
      fetchData();
    } catch (err) {
      console.error("POST /api/analytics error:", err.response || err);
      const serverError = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(serverError);
    }
  };

  // Form labels with units
  const getFieldLabel = (key) => {
    switch(key) {
      case "feedKg": return "feedKg (kg)";
      case "milkL": return "milkL (L)";
      default: return key;
    }
  };

  // Move this useEffect ABOVE any conditional returns to follow the Rules of Hooks
  useEffect(() => {
    if (form.month && milkData[form.month] !== undefined) {
      setForm(prev => ({
        ...prev,
        milkL: milkData[form.month] || ""
      }));
    }
    // Only run when form.month or milkData changes
  }, [form.month, milkData]);

  // Add loading check for charts (AFTER all hooks, before return)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 pt-20 flex items-center justify-center">
        <span className="text-xl text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-20">
      <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Monthly Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">month</label>
            <select
              name="month"
              value={form.month}
              onChange={handleChange}
              className="border rounded px-2 py-1"
              required
            >
              <option value="">Select</option>
              {months.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          {["feedKg", "milkL", "feedCost", "produceValue"].map(key => (
            <div key={key} className="flex flex-col">
              <label className="mb-1 font-medium">{getFieldLabel(key)}</label>
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

      {/* Month Selector - moved below the form */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">View Analytics by Month</h2>
        <div className="flex items-center">
          <label className="mr-2 font-medium">Select Month:</label>
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Feed Cost */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Feed Cost ({selectedMonth})</h2>
          <p className="text-2xl mt-2">
            {isNaN(computedFeedCost2) ? "N/A" : `${computedFeedCost2} Ksh`}
          </p>
        </div>

        {/* Milk Revenue */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Milk Revenue ({selectedMonth})</h2>
          <p className="text-2xl mt-2">
            {isNaN(milkData[selectedMonth]) ? "N/A" : `${milkData[selectedMonth]} (L)`}
          </p>
        </div>

        {/* Amount Made */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">Amount Made ({selectedMonth})</h2>
          <p className={`text-2xl mt-2 ${computedProfit2 >= 0 ? "text-green-600" : "text-red-600"}`}>
            {isNaN(computedProfit2)
              ? "N/A"
              : `${computedProfit2 >= 0 ? "+" : ""}${computedProfit2} Ksh`}
          </p>
        </div>

        {/* Profit/Loss Comparison */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold">
            Change from {prevMonthName} (Profit/Loss)
          </h2>
          <p className="text-sm mt-2 text-gray-500">
            {selectedMonth}: {isNaN(computedProfit2) ? "N/A" : `${computedProfit2} Ksh`} -{" "}
            {prevMonthName}: {isNaN(prevProfit2) ? "N/A" : `${prevProfit2} Ksh`}
          </p>
          <p className={`text-2xl font-bold mt-1 ${diffColor2}`}>
            {isNaN(diff2) ? "N/A" : `${sign2}${Math.abs(diff2)} Ksh`}
          </p>
        </div>
      </div>

      {/* Add button to navigate to daily records */}
      <div className="mb-6 text-right">
        <button
          onClick={() => navigate("/daily-records")}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-flex items-center gap-2"
        >
          <FaCalendarAlt /> View Daily Records
        </button>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Profit/Loss Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={val => `${val} Ksh`} />
            <Legend />
            <Line type="monotone" dataKey="milkL" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Monthly Feed vs Milk</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={feedProduceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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


