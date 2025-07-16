const Analytics = require("../models/analytics");

// POST /api/analytics
exports.createEntry = async (req, res) => {
  console.log("Analytics POST body:", req.body); // debug
  const { month, feedKg, milkL, feedCost, produceValue } = req.body;
  try {
    const entry = await Analytics.create({
      owner: req.user.id,
      month, feedKg, milkL, feedCost, produceValue
    });
    console.log("Created analytics entry:", entry); // debug

    // calculations: costPerKg * feedKg, pricePerLiter * milkL
    const totalFeedCost = feedKg * feedCost;
    const totalProduceRevenue = milkL * produceValue;
    const profitLoss = totalProduceRevenue - totalFeedCost;

    res.status(201).json({
      ...entry.toObject(),
      totalFeedCost,
      totalProduceRevenue,
      profitLoss
    });
  } catch (err) {
    console.error("Error creating analytics entry:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/analytics
exports.getEntries = async (req, res) => {
  try {
    console.log("Analytics GET for user:", req.user.id); // debug
    let data = await Analytics.find({ owner: req.user.id }).sort({ month: 1 });
    console.log("Found analytics entries:", data); // debug

    if (data.length === 0) {
      data = [
        { month: "May", feedKg: 1200, milkL: 800, feedCost: 0.5, produceValue: 1.2 },
        { month: "Jun", feedKg: 1300, milkL: 850, feedCost: 0.5, produceValue: 1.2 }
      ];
    }

    // enrich each entry with computed fields
    const result = data.map(e => {
      const obj = e.toObject ? e.toObject() : e;
      const totalFeedCost = obj.feedKg * obj.feedCost;
      const totalProduceRevenue = obj.milkL * obj.produceValue;
      const profitLoss = totalProduceRevenue - totalFeedCost;
      return {
        ...obj,
        totalFeedCost,
        totalProduceRevenue,
        profitLoss
      };
    });

    console.log("Returning analytics data:", result); // debug
    res.json(result);
  } catch (err) {
    console.error("Error in getEntries:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
