const DailyRecord = require('../models/dailyRecord');
const FarmAnimal = require('../models/farmAnimal');

// Create a daily record
exports.createRecord = async (req, res) => {
  try {
    const { date, animalId, milkProduced, feedConsumed, feedCostPerKg, milkValuePerLiter, notes } = req.body;
    
    // Verify the animal belongs to this user
    const animal = await FarmAnimal.findOne({ _id: animalId, owner: req.user.id });
    if (!animal) {
      return res.status(404).json({ message: "Animal not found or doesn't belong to you" });
    }
    
    // Check if record already exists for this date and animal
    const existingRecord = await DailyRecord.findOne({
      date: new Date(date),
      animal: animalId,
      owner: req.user.id
    });
    
    if (existingRecord) {
      // Update existing record
      Object.assign(existingRecord, { 
        milkProduced, 
        feedConsumed, 
        feedCostPerKg, 
        milkValuePerLiter, 
        notes 
      });
      await existingRecord.save();
      return res.status(200).json(existingRecord);
    }
    
    // Create new record
    const record = new DailyRecord({
      date: new Date(date),
      animal: animalId,
      milkProduced,
      feedConsumed,
      feedCostPerKg,
      milkValuePerLiter,
      notes,
      owner: req.user.id
    });
    
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    console.error('Error creating daily record:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all records for a specific month
exports.getRecordsByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    
    // Create date range for the month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0); // Last day of month
    
    const records = await DailyRecord.find({
      owner: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).populate('animal', 'name type');
    
    res.json(records);
  } catch (err) {
    console.error('Error getting monthly records:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get monthly aggregated data
exports.getMonthlyTotals = async (req, res) => {
  try {
    const { year, month } = req.params;
    
    // Create date range for the month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);
    
    // Get all records for the month
    const records = await DailyRecord.find({
      owner: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    });
    
    // Aggregate the data
    let totalMilk = 0;
    let totalFeed = 0;
    let totalFeedCost = 0;
    let totalMilkValue = 0;
    
    records.forEach(record => {
      totalMilk += record.milkProduced;
      totalFeed += record.feedConsumed;
      totalFeedCost += record.feedConsumed * record.feedCostPerKg;
      totalMilkValue += record.milkProduced * record.milkValuePerLiter;
    });
    
    const profitLoss = totalMilkValue - totalFeedCost;
    
    res.json({
      month: parseInt(month),
      year: parseInt(year),
      totalRecords: records.length,
      totalMilk,
      totalFeed,
      totalFeedCost,
      totalMilkValue,
      profitLoss
    });
  } catch (err) {
    console.error('Error calculating monthly totals:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all animals with their latest records
exports.getAnimalsWithLatestRecords = async (req, res) => {
  try {
    // Get all animals for this user
    const animals = await FarmAnimal.find({ owner: req.user.id });
    
    // For each animal, get their latest record
    const result = [];
    for (const animal of animals) {
      const latestRecord = await DailyRecord.findOne({ 
        animal: animal._id,
        owner: req.user.id 
      }).sort({ date: -1 });
      
      result.push({
        animal,
        latestRecord: latestRecord || null
      });
    }
    
    res.json(result);
  } catch (err) {
    console.error('Error getting animals with records:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
