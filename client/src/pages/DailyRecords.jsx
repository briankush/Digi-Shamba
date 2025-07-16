import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt, FaTint, FaChartLine } from "react-icons/fa";
import { GiCow } from "react-icons/gi";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function DailyRecords() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [monthlyTotal, setMonthlyTotal] = useState(null);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  
  // Record for the selected date
  const [existingRecord, setExistingRecord] = useState(null);
  
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    animalId: "",
    milkProduced: "",
    notes: ""
  });

  useEffect(() => {
    const fetchAnimalsAndRecords = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");
      
      try {
        setLoading(true);
        
        // Fetch animals
        const animalRes = await axios.get("http://localhost:5000/api/farm-animals", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Only include cows
        const cows = animalRes.data.filter(animal => animal.type.toLowerCase() === "cow" || animal.type.toLowerCase() === "cows");
        setAnimals(cows);
        
        if (cows.length > 0) {
          setForm(prev => ({ ...prev, animalId: cows[0]._id }));
        }
        
        // Fetch records for current month
        await fetchRecordsForMonth(selectedYear, selectedMonth);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load animals or records");
        setLoading(false);
      }
    };
    
    fetchAnimalsAndRecords();
  }, [navigate]);
  
  useEffect(() => {
    // When the selected date changes, check if there's an existing record
    if (records.length > 0 && selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const record = records.find(r => new Date(r.date).toISOString().split('T')[0] === dateStr);
      
      if (record) {
        setExistingRecord(record);
        // Pre-fill the form with existing data
        setForm({
          date: dateStr,
          animalId: record.animal._id,
          milkProduced: record.milkProduced.toString(),
          notes: record.notes || ""
        });
      } else {
        setExistingRecord(null);
        // Reset form but keep the selected date and animal
        setForm({
          date: dateStr,
          animalId: form.animalId,
          milkProduced: "",
          notes: ""
        });
      }
    }
  }, [selectedDate, records]);
  
  const fetchRecordsForMonth = async (year, month) => {
    const token = localStorage.getItem("token");
    try {
      // Fetch records for the month
      const recordsRes = await axios.get(`http://localhost:5000/api/daily-records/month/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(recordsRes.data);
      
      // Fetch monthly totals
      const totalsRes = await axios.get(`http://localhost:5000/api/daily-records/monthly-totals/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMonthlyTotal(totalsRes.data);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Failed to load records for the month");
    }
  };

  const handleCalendarChange = (date) => {
    setSelectedDate(date);
    // Format date for form
    const dateStr = date.toISOString().split('T')[0];
    setForm(prev => ({ ...prev, date: dateStr }));
    
    // Update month/year if they change
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    if (month !== selectedMonth || year !== selectedYear) {
      setSelectedMonth(month);
      setSelectedYear(year);
      fetchRecordsForMonth(year, month);
    }
  };
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      // Simplified payload with just milk production data
      const payload = {
        date: form.date,
        animalId: form.animalId,
        milkProduced: parseFloat(form.milkProduced),
        // Default values for feed-related fields (will be handled in analytics)
        feedConsumed: 0,
        feedCostPerKg: 0,
        milkValuePerLiter: 0,
        notes: form.notes
      };
      
      await axios.post("http://localhost:5000/api/daily-records", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Reset form except for date and animal
      setForm({
        ...form,
        milkProduced: "",
        notes: ""
      });
      
      // Refresh records
      fetchRecordsForMonth(selectedYear, selectedMonth);
      
    } catch (err) {
      console.error("Error saving record:", err);
      setError("Failed to save daily record");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to highlight days with records
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const hasRecord = records.some(r => new Date(r.date).toISOString().split('T')[0] === dateStr);
      return hasRecord ? 'has-record' : null;
    }
  };

  if (loading) return <div className="min-h-screen pt-20 flex justify-center items-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FaCalendarAlt className="mr-2 text-green-600" /> Daily Milk Records
        </h1>
      </div>
      
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
        <p>{error}</p>
      </div>}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Column */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-green-600" /> Select Date
            </h2>
            
            <div className="calendar-container">
              <Calendar
                onChange={handleCalendarChange}
                value={selectedDate}
                tileClassName={tileClassName}
                className="w-full"
              />
              <style>{`
                .has-record {
                  background-color: #d1fae5;
                  color: #065f46;
                  font-weight: bold;
                }
              `}</style>
            </div>
            
            <div className="mt-4">
              <p className="text-center">
                {selectedDate ? (
                  <span className="font-semibold">Selected: {formatDate(selectedDate)}</span>
                ) : (
                  <span className="text-gray-500">Select a date to add or view records</span>
                )}
              </p>
            </div>
          </div>
          
          {/* Monthly Summary */}
          {monthlyTotal && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaTint className="mr-2 text-blue-600" /> 
                Monthly Total
              </h2>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm text-gray-500 uppercase">Total Milk</h3>
                <p className="text-xl font-semibold">{monthlyTotal.totalMilk.toFixed(1)} L</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Form and Records Column */}
        <div className="lg:col-span-2">
          {/* Add Record Form - Only shown when date is selected */}
          {selectedDate && (
            <div className="bg-white p-6 rounded-lg shadow mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <GiCow className="mr-2 text-amber-700" /> 
                {existingRecord ? 'Edit Record' : 'Add Record'} for {formatDate(selectedDate)}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Animal</label>
                    <select
                      name="animalId"
                      value={form.animalId}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option value="">Select animal</option>
                      {animals.map(animal => (
                        <option key={animal._id} value={animal._id}>{animal.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium">Milk Produced (L)</label>
                    <input
                      type="number"
                      name="milkProduced"
                      value={form.milkProduced}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block mb-1 font-medium">Notes (optional)</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    rows="2"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-green-600 text-white font-medium py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    {existingRecord ? 'Update Record' : 'Save Record'}
                  </button>
                  
                  {/* Analytics button - moved here */}
                  <button 
                    type="button"
                    onClick={() => navigate("/analytics")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
                  >
                    <FaChartLine /> View Analytics
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Records Table */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Records for {new Date(selectedYear, selectedMonth-1, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            
            {records.length === 0 ? (
              <p className="text-gray-500">No records found for this month.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Date</th>
                      <th className="border px-4 py-2 text-left">Animal</th>
                      <th className="border px-4 py-2 text-right">Milk (L)</th>
                      <th className="border px-4 py-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map(record => (
                      <tr 
                        key={record._id} 
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedDate && new Date(record.date).toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0]
                            ? 'bg-green-50'
                            : ''
                        }`}
                        onClick={() => handleCalendarChange(new Date(record.date))}
                      >
                        <td className="border px-4 py-2">{formatDate(record.date)}</td>
                        <td className="border px-4 py-2">{record.animal.name}</td>
                        <td className="border px-4 py-2 text-right">{record.milkProduced.toFixed(1)}</td>
                        <td className="border px-4 py-2">{record.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

