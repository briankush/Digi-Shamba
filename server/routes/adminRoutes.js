const express = require("express");
const router = express.Router();
const { getAllUsers, getAllAnimals } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("Admin")); // only Admin

router.get("/users", getAllUsers);
router.get("/animals", getAllAnimals);

module.exports = router;
