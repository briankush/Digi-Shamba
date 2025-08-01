const FarmAnimal = require("../models/farmAnimal");

// POST /api/farm-animals

// Create a new farm animal
exports.createAnimal = async (req, res) => {
  try {
    console.log("Creating animal with data:", req.body);
    console.log("Current user:", req.user);
    
    const { name, breed, type, birthDate, weight, notes } = req.body;
    
    // Verify that owner ID is properly formatted
    if (!req.user || !req.user.id) {
      console.error("User ID not available in request");
      return res.status(400).json({ message: "User identification failed" });
    }
    
    // Create animal with explicit owner field
    const newAnimal = new FarmAnimal({
      name,
      breed,
      type,
      birthDate,
      weight,
      notes,
      owner: req.user.id
    });
    
    console.log("Animal to be saved:", newAnimal);
    const savedAnimal = await newAnimal.save();
    console.log("Animal saved successfully with ID:", savedAnimal._id);
    
    res.status(201).json(savedAnimal);
  } catch (err) {
    console.error("Error creating animal:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all farm animals for the logged-in user
exports.getAllAnimals = async (req, res) => {
  try {
    console.log("getAllAnimals called");
    console.log("User from request:", req.user);
    
    if (!req.user || !req.user.id) {
      console.error("User ID not available");
      return res.status(400).json({ message: "User identification failed" });
    }
    
    // Add debugging to show what we're querying for
    console.log("Querying animals with owner ID:", req.user.id);
    console.log("Owner ID type:", typeof req.user.id);
    
    // Check if the ID is a valid ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(req.user.id);
    console.log("Is valid ObjectId:", isValidObjectId);
    
    // Get all animals in DB first to check if they exist at all
    const allAnimals = await FarmAnimal.find({});
    console.log("All animals in DB:", allAnimals.length);
    
    // Now query for user's animals
    const animals = await FarmAnimal.find({ owner: req.user.id });
    console.log("User's animals found:", animals.length);
    
    return res.json(animals);
  } catch (error) {
    console.error("Error in getAllAnimals:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single animal by ID
exports.getAnimalById = async (req, res) => {
  try {
    const animal = await FarmAnimal.findOne({ _id: req.params.id, owner: req.user._id });
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.json(animal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an animal by ID
exports.updateAnimal = async (req, res) => {
  try {
    const animal = await FarmAnimal.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an animal by ID
exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await FarmAnimal.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!animal) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.json({ message: 'Animal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};