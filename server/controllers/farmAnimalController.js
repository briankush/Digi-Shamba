const FarmAnimal = require("../models/farmAnimal");

// POST /api/farm-animals

// Create a new farm animal
exports.createAnimal = async (req, res) => {
  try {
    const { name, breed, type, birthDate, weight, notes } = req.body;
    // Replace the following with your database insertion logic
    const newAnimal = {
      _id: "generatedId", // Should come from the database
      name,
      breed,
      type,
      birthDate,
      weight,
      notes,
    };
    res.status(201).json(newAnimal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all farm animals for the logged-in user
exports.getAllAnimals = async (req, res) => {
  try {
    console.log("Authenticated user ID:", req.user.id);

    // Fetch animals owned by the logged-in user
    const animals = await FarmAnimal.find({ owner: req.user.id });
    console.log("Database returned animals:", animals);

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