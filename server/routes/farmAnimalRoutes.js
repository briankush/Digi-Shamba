const express = require('express');
const { createAnimal, getAllAnimals, getAnimalById, updateAnimal, deleteAnimal } = require('../controllers/farmAnimalController');
const { protect, authorize} = require('../middleware/auth');
const router = express.Router();

router.post("/", protect, createAnimal);
router.get("/", protect, getAllAnimals);
router.get("/:id", protect, getAnimalById);
router.put("/:id", protect, authorize(['admin', 'user']), updateAnimal);
router.delete("/:id", protect, authorize(['admin']), deleteAnimal);

module.exports = router;
