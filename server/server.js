const connectDB= require("./config/db");
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
// connect to DB


connectDB();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

