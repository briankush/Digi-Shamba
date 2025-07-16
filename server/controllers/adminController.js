const User = require("../models/user");
const FarmAnimal = require("../models/farmAnimal");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllAnimals = async (req, res) => {
  try {
    const animals = await FarmAnimal.find().populate("owner", "name email");
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
