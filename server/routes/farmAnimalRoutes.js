const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createAnimal, getAllAnimals, getAnimalById, updateAnimal, deleteAnimal } = require("../controllers/farmAnimalController");

// All routes need the protect middleware to ensure user is authenticated
router.use(protect);

// GET /api/farm-animals - Get all animals for logged-in user
router.get("/", getAllAnimals);

// POST /api/farm-animals - Create a new animal
router.post("/", createAnimal);

// GET /api/farm-animals/:id - Get specific animal
router.get("/:id", getAnimalById);

// PUT /api/farm-animals/:id - Update an animal
router.put("/:id", updateAnimal);

// DELETE /api/farm-animals/:id - Delete an animal
router.delete("/:id", deleteAnimal);

module.exports = router;