const Analytics = require("../models/analytics");

exports.createEntry = async (req, res) => {
  const { month, feedKg, milkL, feedCost, produceValue } = req.body;
  try {
    const entry = await Analytics.create({
      owner: req.user.id,
      month, feedKg, milkL, feedCost, produceValue
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEntries = async (req, res) => {
  try {
    const data = await Analytics.find({ owner: req.user.id }).sort({ month: 1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
