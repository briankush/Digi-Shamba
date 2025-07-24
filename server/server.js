require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();
connectDB();

app.use(cors());
app.use(express.json());


app.use("/api/auth", require('./routes/authRoutes'));
const farmAnimalRoutes = require("./routes/farmAnimalRoutes");
// Mount the farm animals route so that POST/GET requests to /api/farm-animals work correctly
app.use("/api/farm-animals", farmAnimalRoutes);
app.use("/api/admin", require('./routes/adminRoutes'));
const analyticsRoutes = require("./routes/analyticsRoutes");
app.use("/api/analytics", analyticsRoutes);
const dailyRecordRoutes = require("./routes/dailyRecordRoutes");
app.use("/api/daily-records", dailyRecordRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);
const animalRoutes = require("./routes/animalRoutes");
app.use("/api/animals", animalRoutes);


const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});