const User = require("../models/user");
const FarmAnimal = require("../models/farmAnimal");

// Get all users (exclude password)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password -__v"); // Exclude password and __v
    res.status(200).json(Array.isArray(users) ? users : []);
  } catch (err) {
    console.error("Admin getAllUsers error:", err);
    res.status(500).json({ message: "Failed to fetch users", details: err.message });
  }
};

// Get all animals (populate owner)
exports.getAllAnimals = async (req, res) => {
  try {
    const animals = await FarmAnimal.find({})
      .populate({ path: "owner", select: "name email" })
      .lean();
    res.status(200).json(Array.isArray(animals) ? animals : []);
  } catch (err) {
    console.error("Admin getAllAnimals error:", err);
    res.status(500).json({ message: "Failed to fetch animals", details: err.message });
  }
};
