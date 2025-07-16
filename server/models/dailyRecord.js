const mongoose = require("mongoose");

const dailyRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FarmAnimal",
    required: true
  },
  milkProduced: {
    type: Number,
    required: true,
    min: 0
  },
  feedConsumed: {
    type: Number,
    required: true,
    min: 0
  },
  feedCostPerKg: {
    type: Number,
    required: true,
    min: 0
  },
  milkValuePerLiter: {
    type: Number,
    required: true,
    min: 0
  },
  notes: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

// Add methods to get month and year from date
dailyRecordSchema.virtual('month').get(function() {
  return this.date.getMonth() + 1; // JavaScript months are 0-indexed
});

dailyRecordSchema.virtual('year').get(function() {
  return this.date.getFullYear();
});

module.exports = mongoose.model("DailyRecord", dailyRecordSchema);
