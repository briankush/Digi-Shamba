const express = require('express');
const router = express.Router();
const { updatePassword } = require('../controllers/passwordController');
const { protect } = require('../middleware/auth');

// Protected route - requires authentication
router.put('/update', protect, updatePassword);

module.exports = router;
