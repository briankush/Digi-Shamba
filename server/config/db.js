// connection to database
const mongoose = require('mongoose');
// connects to MongoDB using mongoose

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, useUnifiedTopology: true});
        console.log('MongoDB connected');
    } catch (error) {
        console.error("MongoDB connection failed", error.message);
        process.exit(1);
        
    }
};

module.exports = connectDB;