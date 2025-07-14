require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');


const app = express();
connectDB();

app.use(cors());
app.use(express.json());


app.use("/api/auth", require('./routes/authRoutes'));
app.use("/api/farm-animals", require('./routes/farmAnimalRoutes'));


const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});