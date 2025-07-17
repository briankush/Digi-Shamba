const express = require("express");
const router = express.Router();
const { createRecord, getRecordsByMonth, getMonthlyTotals, getAnimalsWithLatestRecords, deleteRecord } = require("../controllers/dailyRecordController");
const { protect } = require("../middleware/auth");

// All routes require authentication
router.use(protect);

// Create new record or update existing
router.post("/", createRecord);

// Get records for a specific month
router.get("/month/:year/:month", getRecordsByMonth);

// Get monthly aggregated totals
router.get("/monthly-totals/:year/:month", getMonthlyTotals);

// Get all animals with their latest records
router.get("/animals-with-records", getAnimalsWithLatestRecords);

// Delete a record by ID
router.delete("/:id", deleteRecord);

module.exports = router;
