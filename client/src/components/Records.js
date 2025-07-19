import moment from 'moment';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Records.css';

const localizer = momentLocalizer(moment);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Records = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyRecords, setDailyRecords] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    crop: '',
    areaPlanted: '',
    datePlanted: '',
    expectedHarvest: '',
    actualHarvest: '',
    notes: ''
  });

  useEffect(() => {
    fetchMonthlyRecords();
  }, [currentDate]);

  const fetchMonthlyRecords = async () => {
    try {
      const month = moment(currentDate).format('YYYY-MM');
      const response = await fetch(`${API_BASE_URL}/records/monthly/${month}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'dummy-token'}`
        }
      });
      const data = await response.json();
      setDailyRecords(data);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const handleFormToggle = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/records/daily`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'dummy-token'}`
        },
        body: JSON.stringify({
          date: selectedDate,
          ...formData
        }),
      });

      if (response.ok) {
        setDailyRecords({
          ...dailyRecords,
          [selectedDate]: formData
        });
        setShowForm(false);
        alert('Record saved successfully!');
      }
    } catch (error) {
      console.error('Error saving record:', error);
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const backgroundColor = event.color || '#3174ad';
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0',
      display: 'block'
    };
    return {
      style: style
    };
  };

  const handleSelect = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  return (
    <div className="records-container">
      <Calendar
        localizer={localizer}
        events={Object.keys(dailyRecords).map(date => ({
          start: new Date(date),
          end: new Date(date),
          title: `${dailyRecords[date].crop} - ${dailyRecords[date].actualHarvest || 'Pending'}`,
          allDay: true
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
        onSelectEvent={handleSelect}
        onNavigate={handleDateChange}
        eventPropGetter={eventStyleGetter}
      />
      {showForm && (
        <div className="record-form">
          <h2>Add/Edit Record</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Crop</label>
              <input type="text" name="crop" value={formData.crop} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Area Planted (ha)</label>
              <input type="number" name="areaPlanted" value={formData.areaPlanted} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Date Planted</label>
              <input type="date" name="datePlanted" value={formData.datePlanted} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Expected Harvest (kg)</label>
              <input type="number" name="expectedHarvest" value={formData.expectedHarvest} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Actual Harvest (kg)</label>
              <input type="number" name="actualHarvest" value={formData.actualHarvest} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange}></textarea>
            </div>
            <button type="submit">Save Record</button>
            <button type="button" onClick={handleFormToggle}>Cancel</button>
          </form>
        </div>
      )}
      {/* Event details modal can be implemented here */}
    </div>
  );
};

export default Records;