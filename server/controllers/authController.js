const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

//Signup endpoint logic
exports.signup = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({message: "Email and password are required"});
        }
        
        const exists = await User.findOne({ email });
        if(exists) return res.status(400).json({message: "User already exists"});
        
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed });
        
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET not defined!");
            return res.status(500).json({message: "Server configuration error"});
        }
        
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn : "1h"});
        res.json({token, userId: user._id, role: user.role, name: user.name});
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
        
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            userId: user._id,
            role: user.role,
            name: user.name,
            email: user.email // <-- add this line
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({message: "Server error during login"});
    }
}



// Logout endpoint logic
exports.logout = async (req, res) => {
    try {
        // Invalidate the token by removing it from the client side
        res.json({message: "Logged out successfully"});
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({message: "Server error during logout"});
    }
};

// Get current user
exports.getMe = (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

//  password updates Logic
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both current and new password" });
    }
    
    // Get user from authenticated request
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
