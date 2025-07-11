const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

//Signup endpoint logic
exports.signup = async(req, res) => {
    try {
        const {email, password} = req.body;
        
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }
        
        const exists = await User.findOne({ email });
        if(exists) return res.status(400).json({message: "User already exists"});
        
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({email, password: hashed});
        
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not defined!");
            return res.status(500).json({message: "Server configuration error"});
        }
        
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET);
        res.json({token, userId: user._id, role: user.role});
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({message: "Server error during signup"});
    }
};

// Login endpoint logic

exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }
        
        // Check JWT_SECRET
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not defined!");
            return res.status(500).json({message: "Server configuration error"});
        }

        const user = await User.findOne({ email });
        
        // Security best practice: Use same error for both cases to prevent email enumeration
        if (!user) return res.status(401).json({message: "Invalid credentials"});
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({message: "Invalid credentials"});
        
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET);
        res.json({token, userId: user._id, role: user.role});
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({message: "Server error during login"});
    }
}