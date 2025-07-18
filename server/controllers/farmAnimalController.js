const FarmAnimal = require("../models/farmAnimal");

// POST /api/farm-animals

// Create a new farm animal
exports.createAnimal = async (req, res) => {
  console.log("Create animal request body:", req.body); // Debug log
  const { type, name, breed, age, weight, notes } = req.body;
  try {
    // Use req.user._id from JWT middleware as owner
    if (!req.user || !req.user.id) {
      throw new Error("No authenticated user found");
    }
    if (!type || !name) {
      throw new Error("Missing required fields: type, name");
    }
    const animal = new FarmAnimal({
      type,
      name,
      breed,
      age,
      weight,
      notes,
      owner: req.user.id
    });
    await animal.save();
    res.status(201).json({ message: "Animal added", animal });
  } catch (err) {
    console.error("Create animal error:", err); // Debug log
    res.status(500).json({ error: err.message });
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