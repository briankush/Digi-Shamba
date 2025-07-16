const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  month: { type: String, required: true },         // e.g. "2024-07"
  feedKg: { type: Number, required: true },
  milkL: { type: Number, required: true },
  feedCost: { type: Number, required: true },
  produceValue: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Analytics", analyticsSchema);
