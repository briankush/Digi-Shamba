const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  crops: String,
  livestock: String,
  expenses: { type: Number, default: 0 },
  income: { type: Number, default: 0 },
  weather: String,
  activities: String,
  notes: String,
  userId: { type: String, required: true }
}, { timestamps: true });

const DailyRecord = mongoose.model('DailyRecord', recordSchema);

// Save daily record
router.post('/daily', async (req, res) => {
  try {
    const { date, crops, livestock, expenses, income, weather, activities, notes } = req.body;
    
    const record = await DailyRecord.findOneAndUpdate(
      { date: new Date(date), userId: req.user._id },
      { 
        crops, 
        livestock, 
        expenses: parseFloat(expenses) || 0, 
        income: parseFloat(income) || 0, 
        weather, 
        activities, 
        notes,
        userId: req.user._id
      },
      { upsert: true, new: true }
    );

    res.json(record);
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get monthly records
router.get('/monthly/:month', async (req, res) => {
  try {
    const { month } = req.params; // Format: YYYY-MM
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const records = await DailyRecord.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    });

    const recordsMap = {};
    records.forEach(record => {
      const dateKey = record.date.toISOString().split('T')[0];
      recordsMap[dateKey] = {
        crops: record.crops,
        livestock: record.livestock,
        expenses: record.expenses,
        income: record.income,
        weather: record.weather,
        activities: record.activities,
        notes: record.notes
      };
    });

    res.json(recordsMap);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
