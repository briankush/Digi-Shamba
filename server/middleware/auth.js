const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
  try {
    // Log the request for debugging
    console.log("Auth middleware called");
    console.log("Headers:", req.headers);
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.error("No token provided");
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      console.log("Verifying token...");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Fetch full user document for admin endpoints
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = { id: user._id, role: user.role, name: user.name, email: user.email };
      
      console.log("User set on request:", req.user);
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "User role unauthorized" });
    }
    next();
  };
};