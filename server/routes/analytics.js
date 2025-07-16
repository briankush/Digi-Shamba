const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get monthly analytics
router.get('/monthly/:month', async (req, res) => {
  try {
    const { month } = req.params;
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const DailyRecord = mongoose.model('DailyRecord');
    
    const records = await DailyRecord.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    // Calculate totals
    const totalIncome = records.reduce((sum, record) => sum + (record.income || 0), 0);
    const totalExpenses = records.reduce((sum, record) => sum + (record.expenses || 0), 0);
    const netProfit = totalIncome - totalExpenses;

    // Count records
    const recordsCompleted = records.length;
    const totalDays = endDate.getDate();

    // Analyze activities
    const activitiesCount = {};
    records.forEach(record => {
      if (record.activities) {
        const activities = record.activities.toLowerCase().split(',');
        activities.forEach(activity => {
          const trimmed = activity.trim();
          if (trimmed) {
            activitiesCount[trimmed] = (activitiesCount[trimmed] || 0) + 1;
          }
        });
      }
    });

    const commonActivities = Object.entries(activitiesCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([activity, count]) => ({ activity, count }));

    // Prepare daily data for charts
    const dailyData = records.map(record => ({
      date: record.date,
      income: record.income || 0,
      expenses: record.expenses || 0,
      weather: record.weather
    }));

    res.json({
      totalIncome,
      totalExpenses,
      netProfit,
      recordsCompleted,
      totalDays,
      commonActivities,
      dailyData
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
