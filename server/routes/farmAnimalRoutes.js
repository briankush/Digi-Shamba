const express = require("express");
const { createAnimal, getAllAnimals, getAnimalById, updateAnimal, deleteAnimal } = require("../controllers/farmAnimalController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, createAnimal);
router.get("/", protect, getAllAnimals); // Ensure this uses the protect middleware
router.get("/:id", protect, getAnimalById);
router.put("/:id", protect, updateAnimal);
router.delete("/:id", protect, deleteAnimal);

module.exports = router;