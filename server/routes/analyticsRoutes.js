const express = require("express");
const { createEntry, getEntries } = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.use(protect);
router.post("/", createEntry);
router.get("/", getEntries);

module.exports = router;
