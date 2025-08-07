const User = require("../models/user");
const FarmAnimal = require("../models/farmAnimal");

// Get all users (exclude password)
exports.getAllUsers = async (req, res) => {
  try {
    console.log("Admin: Fetching all users...");
    const users = await User.find({}, "-password -__v");
    console.log(`Admin: Found ${users.length} users`);
    res.status(200).json(users);
  } catch (err) {
    console.error("Admin getAllUsers error:", err);
    res.status(500).json({ 
      message: "Failed to fetch users", 
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
};

// Get all animals (populate owner)
exports.getAllAnimals = async (req, res) => {
  try {
    console.log("Admin: Fetching all animals...");
    const animals = await FarmAnimal.find({})
      .populate({ path: "owner", select: "name email" })
      .lean();
    
    console.log(`Admin: Found ${animals.length} animals`);
    res.status(200).json(animals);
  } catch (err) {
    console.error("Admin getAllAnimals error:", err);
    res.status(500).json({ 
      message: "Failed to fetch animals", 
      details: err.message,
      timestamp: new Date().toISOString()
    });
  }
};
