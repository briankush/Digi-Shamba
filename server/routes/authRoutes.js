const express = require('express');
const { signup, login, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;