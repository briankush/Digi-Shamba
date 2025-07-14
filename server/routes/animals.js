const express = require("express");
const router = express.Router();
const Farm = require("../models/farm");
const User = require("../models/user");

// Add animal record to the correct collection for the logged-in user
router.post("/", async (req, res) => {
  const { type, name, breed, age, weight, notes, email } = req.body;
  console.log("Add animal request body:", req.body); // Debug log

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Find or create the farm for this user
    let farm = await Farm.findOne({ farmer: user._id });
    if (!farm) {
      farm = new Farm({ farmer: user._id });
    }

    // Add the animal to the correct array
    const animalData = { name, breed, age, weight, notes };
    if (type === "Cows") farm.cows.push(animalData);
    else if (type === "Goats") farm.goats.push(animalData);
    else if (type === "Chicken") farm.chickens.push(animalData);
    else if (type === "Pigs") farm.pigs.push(animalData);

    await farm.save();
    res.status(201).json({ message: "Animal added", farm });
  } catch (err) {
    console.error("Add animal error:", err); // Debug log
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
