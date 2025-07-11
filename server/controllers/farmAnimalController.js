const FarmAnimal = require('../models/farm');

// POST /api/farm-animals

// Create a new farm animal
exports.createAnimal = async (req, res) => {
    try {
        const animal = new FarmAnimal(req.body);
        await animal.save();
        res.status(201).json(animal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all farm animals
exports.getAllAnimals = async (req, res) => {
    try {
        const animals = await FarmAnimal.find({ owner: req.user._id }); // assuming owner is set on login
        res.json(animals);
    } catch (error) {
        res.status(500).json({ error: error.message });
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