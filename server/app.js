const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Import routes
const recordsRoutes = require('./routes/records');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');

// Database connection
mongoose.connect('mongodb://localhost:27017/digi-shamba', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth middleware
const authenticateToken = (req, res, next) => {
  // Simple auth middleware - implement JWT token verification here
  req.user = { _id: 'dummy-user-id' }; // Replace with actual user from token
  next();
};

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/records', authenticateToken, recordsRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Digi-Shamba API');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
