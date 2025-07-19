import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCalendarAlt, FaTint, FaChartLine, FaTrash, FaEdit, FaChevronDown, FaChevronUp } from "react-icons/fa";
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

  // Add a new state to track if we're updating
  const [isUpdating, setIsUpdating] = useState(false);
  // Add state for selected animal in form
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Add state for delete confirmation
  const [expandedDates, setExpandedDates] = useState({}); // Add state for expanded dates
  // Add state to track loading state for different operations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingDate, setIsChangingDate] = useState(false);
  
  const API = import.meta.env.VITE_API_BASE_URL;

  // Update the getLocalDateStr function to ensure proper handling of month end dates
  const getLocalDateStr = (date) => {
    // Ensure we're working with a date object
    const d = new Date(date);
    
    // Force the date to be processed in local timezone with UTC representation
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    // Ensure consistent string format
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const fetchAnimalsAndRecords = async () => {
      // Check for token before making requests
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      
      try {
        setLoading(true);
        setError("");
        
        // Fetch animals with proper error handling
        try {
          const animalRes = await axios.get("http://localhost:5000/api/farm-animals", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Only include cows
          const cows = animalRes.data.filter(animal => 
            animal.type?.toLowerCase() === "cow" || 
            animal.type?.toLowerCase() === "cows"
          );
          
          setAnimals(cows);
          
          if (cows.length > 0) {
            setForm(prev => ({ ...prev, animalId: cows[0]._id }));
          }
        } catch (err) {
          console.error("Error fetching animals:", err);
          if (err.response?.status === 401) {
            // Handle expired token
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          setError("Failed to load animals");
        }
        
        // Fetch records for current month
        try {
          await fetchRecordsForMonth(selectedYear, selectedMonth);
        } catch (err) {
          console.error("Error fetching records:", err);
          setError("Failed to load records");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in fetch operation:", err);
        setLoading(false);
        setError("Failed to load data");
      }
    };
    
    fetchAnimalsAndRecords();
  }, [navigate]);
  
  // Add this helper function for date consistency checks (missing from previous code)
  const checkDateConsistency = (date) => {
    const d = new Date(date);
    console.log({
      original: date,
      newDate: d,
      iso: d.toISOString(),
      local: d.toLocaleDateString(),
      localDateStr: getLocalDateStr(d),
      day: d.getDate(),
      month: d.getMonth() + 1,
      year: d.getFullYear()
    });
    return d;
  };

  // Update the fetchRecordsForMonth function to force a clear of records when month changes
  const fetchRecordsForMonth = async (year, month) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return [];
    }
    
    try {
      // Clear records COMPLETELY when changing months
      setRecords([]);
      setError("");
      
      console.log(`Fetching records for year=${year}, month=${month}`);
      
      // Fetch records for the month
      // Debug logs for month boundaries
      console.log(`Fetching records for ${year}-${month}, including end of month dates`);
      
      // Add special handling to check for end of month days
      const recordsRes = await axios.get(
        `http://localhost:5000/api/daily-records/month/${year}/${month}`, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Get last day of the selected month
      const lastDay = new Date(year, month, 0).getDate();
      console.log(`Last day of month ${month}/${year} is ${lastDay}`);
      
      // Check if we have records for each day, especially the last day
      const days = {};
      recordsRes.data.forEach(record => {
        const day = new Date(record.date).getDate();
        days[day] = true;
      });
      
      console.log("Days with records:", Object.keys(days).sort((a,b) => a-b));
      console.log(`${lastDay} should be present if we have records for it`);
      
      setRecords(recordsRes.data);
      
      // Fetch monthly totals
      try {
        const totalsRes = await axios.get(
          `http://localhost:5000/api/daily-records/monthly-totals/${year}/${month}`,
          { headers: { Authorization: `Bearer ${token}` }}
        );
        setMonthlyTotal(totalsRes.data);
      } catch (err) {
        // If monthly totals fails, just log the error but don't block the UI
        console.warn("Could not fetch monthly totals:", err);
        setMonthlyTotal(null);
      }
      
      return recordsRes.data;
    } catch (err) {
      console.error("Error fetching records:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return [];
      }
      setError("Failed to load records. Please try again.");
      return [];
    }
  };
  
  useEffect(() => {
    // When the selected date changes, reset the form
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      // Reset form for new entry, don't pre-fill with existing data
      setForm({
        date: dateStr,
        animalId: selectedAnimalId || (animals.length > 0 ? animals[0]._id : ""),
        milkProduced: "",
        notes: ""
      });
      
      // Find any records for this date to highlight in the table
      setExistingRecord(null);
    }
  }, [selectedDate, animals, selectedAnimalId]);
  
  // Check for existing record with fixed date handling
  const checkForExistingRecord = (animalId, date) => {
    if (!animalId || !date || !records.length) return null;
    
    const localDateStr = getLocalDateStr(date);
    return records.find(r => {
      const recordDateStr = getLocalDateStr(r.date);
      return recordDateStr === localDateStr && r.animal._id === animalId;
    });
  };
  
  // Updated animal selection handler
  const handleAnimalChange = (e) => {
    const animalId = e.target.value;
    setSelectedAnimalId(animalId);
    
    if (!selectedDate) return;
    
    const existingRecord = checkForExistingRecord(animalId, selectedDate);
    if (existingRecord) {
      // We found a record for this date and animal - prepare for update
      setExistingRecord(existingRecord);
      setIsUpdating(true);
      setForm({
        date: getLocalDateStr(selectedDate), // Use local date string
        animalId: existingRecord.animal._id,
        milkProduced: existingRecord.milkProduced.toString(),
        notes: existingRecord.notes || ""
      });
    } else {
      // No record found - prepare for new entry
      setExistingRecord(null);
      setIsUpdating(false);
      setForm({
        date: getLocalDateStr(selectedDate), // Use local date string
        animalId,
        milkProduced: "",
        notes: ""
      });
    }
  };
  
  // Fixed calendar change handler
  const handleCalendarChange = async (date) => {
    try {
      setIsChangingDate(true);
      console.log("Original calendar date selected:", date);
      
      // Create a new date preserving the exact day
      const exactDate = new Date(date);
      const year = exactDate.getFullYear();
      const month = exactDate.getMonth();
      const day = exactDate.getDate();
      
      // Special handling for July 31st
      if (month === 6 && day === 31) { // Note: month is 0-based, so 6 is July
        console.log("SPECIAL CASE: July 31st selected");
      }
      
      // Create a clean date at noon to avoid timezone issues
      const cleanDate = new Date(year, month, day, 12, 0, 0);
      console.log("Clean date object:", cleanDate);
      
      // Set the selected date
      setSelectedDate(cleanDate);
      
      // Calculate correct month (1-based) for API and state
      const newMonth = month + 1;
      const newYear = year;
      
      console.log(`Calendar change: Date=${day}, Month=${newMonth}, Year=${newYear}`);
      console.log(`Current state: Month=${selectedMonth}, Year=${selectedYear}`);
      
      // Only fetch new records if month or year changes
      if (newMonth !== selectedMonth || newYear !== selectedYear) {
        console.log(`Month changed from ${selectedMonth}/${selectedYear} to ${newMonth}/${newYear}`);
        
        // Update state BEFORE fetching records for the new month
        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
        
        // Fetch new records with the updated month/year
        const currentRecords = await fetchRecordsForMonth(newYear, newMonth);
        
        // Clear existing record selection when changing months
        setExistingRecord(null);
        setIsUpdating(false);
        
        // Update form with new date but reset other fields
        setForm({
          date: getLocalDateStr(cleanDate),
          animalId: animals.length > 0 ? animals[0]._id : "",
          milkProduced: "",
          notes: ""
        });
        
        // Return early as we've reset the state
        return;
      }
      
      // Add special handling for last day of month
      if (isLastDayOfMonth(date)) {
        const day = date.getDate();
        const month = date.getMonth() + 1; // Convert to 1-based
        console.log(`Selected the last day of month: ${day}/${month}`);
        
        // Create a date with noon time to avoid any timezone issues
        const safeDate = new Date(date);
        safeDate.setHours(12, 0, 0, 0);
        setSelectedDate(safeDate);
        
        // Set the form date directly from date components
        const dateStr = `${safeDate.getFullYear()}-${String(safeDate.getMonth() + 1).padStart(2, '0')}-${String(safeDate.getDate()).padStart(2, '0')}`;
        console.log(`Setting form date explicitly for end of month: ${dateStr}`);
        
        // Prepare form for new record
        setForm({
          date: dateStr,
          animalId: selectedAnimalId || (animals.length > 0 ? animals[0]._id : ""),
          milkProduced: "",
          notes: ""
        });
        
        return;
      }
      
      // Rest of the function for same month date selection
      // ...existing code for checking existing records...
    } finally {
      setIsChangingDate(false);
    }
  };
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add this function to help with last day of month issues
  const isLastDayOfMonth = (date) => {
    const d = new Date(date);
    // Check if this is the last day of the month by seeing if tomorrow is in a different month
    const tomorrow = new Date(d);
    tomorrow.setDate(d.getDate() + 1);
    return d.getMonth() !== tomorrow.getMonth();
  };

  // Enhanced submit handler with better update/create logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    
    try {
      setIsSubmitting(true);
      setError("");
      
      // Get the original selected date components directly
      const selectedDay = selectedDate.getDate();
      const selectedMonth = selectedDate.getMonth() + 1; // Convert to 1-based
      const selectedYear = selectedDate.getFullYear();
      
      // Check if this is the last day of month
      const lastDayCheck = isLastDayOfMonth(selectedDate);
      if (lastDayCheck) {
        console.log(`Submitting for the LAST DAY of month: ${selectedDay}/${selectedMonth}/${selectedYear}`);
      }
      
      // Create date string directly from components
      const formattedDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      console.log(`Direct date formatting: ${formattedDate}`);
      
      // Create payload with explicit date string (not from form)
      const payload = {
        date: formattedDate, // Use direct formatting
        animalId: form.animalId,
        milkProduced: parseFloat(form.milkProduced),
        feedConsumed: existingRecord?.feedConsumed || 0,
        feedCostPerKg: existingRecord?.feedCostPerKg || 0,
        milkValuePerLiter: existingRecord?.milkValuePerLiter || 0,
        notes: form.notes
      };
      
      // Special debug info for month boundaries
      if (selectedDay >= 28) {
        console.log(`End of month submission: day=${selectedDay}, month=${selectedMonth}`);
        console.log(`Date: ${formattedDate}, payload:`, payload);
      }
      
      console.log("Submitting payload with date:", payload.date);
      
      // Use the explicit date in the API request
      await axios.post("http://localhost:5000/api/daily-records", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear the form and refresh data
      setForm({
        ...form,
        milkProduced: "",
        notes: ""
      });
      
      // Reset state and refresh records
      setIsUpdating(false);
      await fetchRecordsForMonth(selectedYear, selectedMonth);
      
    } catch (err) {
      console.error("Error saving record:", err);
      setError(err.response?.data?.message || "Failed to save record. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    
    try {
      await axios.delete(`http://localhost:5000/api/daily-records/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh records after deletion
      await fetchRecordsForMonth(selectedYear, selectedMonth);
      
      // Reset states
      setDeleteConfirm(null);
      if (existingRecord && existingRecord._id === recordId) {
        setExistingRecord(null);
        setIsUpdating(false);
        setForm({
          date: selectedDate.toISOString().split('T')[0],
          animalId: form.animalId,
          milkProduced: "",
          notes: ""
        });
      }
    } catch (err) {
      console.error("Error deleting record:", err);
      setError("Failed to delete record");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to highlight days with records
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const localDateStr = getLocalDateStr(date);
      const hasRecord = records.some(r => getLocalDateStr(r.date) === localDateStr);
      return hasRecord ? 'has-record' : null;
    }
  };

  // Group records by date for the UI
  const recordsByDate = {};
  records.forEach(record => {
    const dateStr = new Date(record.date).toISOString().split('T')[0];
    if (!recordsByDate[dateStr]) {
      recordsByDate[dateStr] = [];
    }
    recordsByDate[dateStr].push(record);
  });

  // Function to toggle expanded state for a date
  const toggleDateExpand = (dateStr) => {
    setExpandedDates(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };
  
  // Group records by date
  const organizeRecordsByDate = () => {
    const grouped = {};
    
    // Get the month and year from state (not from records)
    console.log(`Organizing records for month ${selectedMonth}/${selectedYear}`);
    
    // First verify that all records belong to the selected month
    const filteredRecords = records.filter(record => {
      const date = new Date(record.date);
      const recordMonth = date.getMonth() + 1; // Convert to 1-based
      const recordYear = date.getFullYear();
      
      const matches = (recordMonth === selectedMonth && recordYear === selectedYear);
      if (!matches) {
        console.log(`Filtered out record from ${recordMonth}/${recordYear} (expected ${selectedMonth}/${selectedYear})`);
      }
      return matches;
    });
    
    console.log(`After filtering: ${filteredRecords.length} of ${records.length} records remain`);
    
    // Now group the filtered records by date
    filteredRecords.forEach(record => {
      const localDateStr = getLocalDateStr(record.date);
      
      if (!grouped[localDateStr]) {
        grouped[localDateStr] = [];
      }
      grouped[localDateStr].push(record);
    });
    
    // Log all grouped dates for debugging
    console.log("Grouped dates:", Object.keys(grouped));
    
    // Sort dates (newest first) and return
    return Object.keys(grouped)
      .sort((a, b) => new Date(b) - new Date(a))
      .reduce((result, dateStr) => {
        result[dateStr] = grouped[dateStr];
        return result;
      }, {});
  };
  
  // When selected date changes, automatically expand it
  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setExpandedDates(prev => ({
        ...prev,
        [dateStr]: true
      }));
    }
  }, [selectedDate]);
  
  const recordsGroupedByDate = organizeRecordsByDate();
  const hasRecords = Object.keys(recordsGroupedByDate).length > 0;
  
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
                {isUpdating ? 'Update Record' : 'Add New Record'} for {formatDate(selectedDate)}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium">Animal</label>
                    <select
                      name="animalId"
                      value={form.animalId}
                      onChange={(e) => {
                        handleChange(e);
                        handleAnimalChange(e);
                      }}
                      className={`w-full border rounded-md px-3 py-2 ${isUpdating ? 'bg-gray-100' : ''}`}
                      required
                    >
                      <option value="">Select animal</option>
                      {animals.map(animal => (
                        <option key={animal._id} value={animal._id}>{animal.name}</option>
                      ))}
                    </select>
                    {isUpdating && (
                      <p className="text-xs text-amber-600 mt-1">
                        Updating existing record
                      </p>
                    )}
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
                    disabled={isSubmitting}
                    className={`text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 ${
                      isUpdating ? 'bg-amber-600 hover:bg-amber-700' : 'bg-green-600 hover:bg-green-700'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Saving...' : (isUpdating ? <><FaEdit /> Update Record</> : 'Save New Record')}
                  </button>
                  
                  {/* Analytics button */}
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
          
          {/* Consolidated Records Display - SINGLE CARD FOR ALL RECORDS */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Records for {new Date(selectedYear, selectedMonth-1, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            
            {!hasRecords ? (
              <p className="text-gray-500">No records found for this month.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(recordsGroupedByDate).map(([dateStr, dateRecords]) => {
                  const date = new Date(dateStr);
                  const isSelectedDate = selectedDate && 
                    getLocalDateStr(date) === getLocalDateStr(selectedDate);
                  const isExpanded = expandedDates[dateStr] || isSelectedDate;
                  
                  return (
                    <div key={dateStr} className={`border-b last:border-b-0 pb-3 ${isSelectedDate ? 'bg-green-50/30' : ''}`}>
                      {/* Date Header (Clickable) */}
                      <div 
                        className={`flex justify-between items-center py-2 cursor-pointer rounded-t
                          ${isSelectedDate ? 'font-semibold text-green-800' : ''}`}
                        onClick={() => toggleDateExpand(dateStr)}
                      >
                        <div className="flex items-center">
                          <span className="font-medium">
                            {formatDate(date)}
                            <span className="ml-2 text-sm text-gray-500">
                              ({dateRecords.length} record{dateRecords.length !== 1 ? 's' : ''})
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-3">
                            Total: {dateRecords.reduce((sum, r) => sum + r.milkProduced, 0).toFixed(1)} L
                          </span>
                          {isExpanded ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                        </div>
                      </div>
                      
                      {/* Records for this date */}
                      {isExpanded && (
                        <div className="pt-2">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border px-3 py-2 text-left">Animal</th>
                                <th className="border px-3 py-2 text-right">Milk (L)</th>
                                <th className="border px-3 py-2 text-left">Notes</th>
                                <th className="border px-3 py-2 text-center w-16">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dateRecords.map(record => (
                                <tr 
                                  key={record._id} 
                                  className={`hover:bg-gray-50 ${
                                    isSelectedDate && record.animal._id === form.animalId 
                                      ? 'bg-green-50' 
                                      : ''
                                  }`}
                                >
                                  <td className="border px-3 py-2">{record.animal.name}</td>
                                  <td className="border px-3 py-2 text-right">{record.milkProduced.toFixed(1)}</td>
                                  <td className="border px-3 py-2">{record.notes || '-'}</td>
                                  <td className="border px-3 py-2 text-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleCalendarChange(date);
                                        handleAnimalChange({ target: { value: record.animal._id } });
                                      }}
                                      className="text-blue-600 hover:text-blue-800"
                                      title="Edit this record"
                                    >
                                      <FaEdit />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
