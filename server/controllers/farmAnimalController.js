const FarmAnimal = require("../models/farmAnimal");
const mongoose = require("mongoose");

// Get all farm animals for the logged-in user
exports.getAllAnimals = async (req, res) => {
  try {
    console.log("getAllAnimals called with req:", {
      user: req.user,
      method: req.method,
      url: req.originalUrl
    });
    
    // Add defensive error handling
    if (!req.user) {
      console.error("No user object in request");
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    if (!req.user.id) {
      console.error("No user ID found in request");
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    console.log("Looking up animals for user ID:", req.user.id);
    
    // Use a try/catch specifically for the database query
    try {
      // First just return all animals to see if we can access the database at all
      const allAnimals = await FarmAnimal.find({}).lean();
      console.log("Total animals in DB:", allAnimals.length);
      console.log("Sample animal data:", allAnimals.length > 0 ? allAnimals[0] : "No animals");
      
      // Try to find by exact string ID first
      let userAnimals = await FarmAnimal.find({ owner: req.user.id }).lean();
      
      // If that didn't work, try with ObjectId casting
      if (userAnimals.length === 0 && mongoose.Types.ObjectId.isValid(req.user.id)) {
        console.log("No animals found with string ID, trying with ObjectId");
        userAnimals = await FarmAnimal.find({ owner: new mongoose.Types.ObjectId(req.user.id) }).lean();
      }
      
      console.log("Animals found for user:", userAnimals.length);
      return res.json(userAnimals);
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return res.status(500).json({ 
        message: "Database query failed", 
        details: dbError.message 
      });
    }
  } catch (error) {
    console.error("Error in getAllAnimals:", error);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ 
      message: "Server error while fetching animals", 
      details: error.message
    });
  }
};

// Create a new farm animal
exports.createAnimal = async (req, res) => {
  try {
    console.log("createAnimal called with:", {
      body: req.body,
      user: req.user,
      method: req.method
    });
    
    const { name, breed, type, birthDate, weight, notes } = req.body;
    
    // Add defensive error handling
    if (!req.user) {
      console.error("No user object in request");
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const userId = req.user.id || req.user._id;
    if (!userId) {
      console.error("No user ID found in request");
      return res.status(400).json({ message: "User ID not found in request" });
    }
    
    // Create a new animal document with proper type casting
    const newAnimal = new FarmAnimal({
      name,
      breed,
      type,
      birthDate,
      weight,
      notes,
      owner: req.user.id // <-- this is critical!
    });
    
    console.log("Saving new animal:", newAnimal);
    const savedAnimal = await newAnimal.save();
    console.log("Animal saved successfully:", savedAnimal);
    
    res.status(201).json(savedAnimal);
  } catch (error) {
    console.error("Error in createAnimal:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      message: "Server error while creating animal", 
      details: error.message
    });
  }
};

// Get animal by ID (with error handling)
exports.getAnimalById = async (req, res) => {
  try {
    const animalId = req.params.id;
    const userId = req.user.id || req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(animalId)) {
      return res.status(400).json({ message: "Invalid animal ID format" });
    }onst animal = await FarmAnimal.findOne({
      _id: animalId,
    }
    
    const animal = await FarmAnimal.findOne({
      _id: animalId,l) {
      owner: userId  return res.status(404).json({ message: "Animal not found" });
    }).lean();
    
    if (!animal) {es.json(animal);
      return res.status(404).json({ message: "Animal not found" });catch (error) {
    }ror fetching animal by ID:", error);
    .json({ message: "Server error", details: error.message });
    res.json(animal);
  } catch (error) {
    console.error("Error fetching animal by ID:", error);
    res.status(500).json({ message: "Server error", details: error.message }); Update an animal by ID
  }exports.updateAnimal = async (req, res) => {
};
ndUpdate(
// Update an animal by ID _id: req.params.id, owner: req.user._id },
exports.updateAnimal = async (req, res) => {
  try {
    const animal = await FarmAnimal.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,return res.status(404).json({ error: 'Animal not found' });
      { new: true, runValidators: true }
    );
    if (!animal) {atch (error) {
      return res.status(404).json({ error: 'Animal not found' });son({ error: error.message });
    }
    res.json(animal);
  } catch (error) {
    res.status(400).json({ error: error.message }); Delete an animal by ID
  }exports.deleteAnimal = async (req, res) => {
};
ndDelete({ _id: req.params.id, owner: req.user._id });
// Delete an animal by ID(!animal) {
exports.deleteAnimal = async (req, res) => {
  try {
    const animal = await FarmAnimal.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!animal) {atch (error) {
      return res.status(404).json({ error: 'Animal not found' });
    }
    res.json({ message: 'Animal deleted successfully' });  } catch (error) {    res.status(500).json({ error: error.message });
  }
};