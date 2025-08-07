const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.protect = async (req, res, next) => {
  try {
    console.log("Auth middleware: Processing request to", req.method, req.originalUrl);
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.error("Auth middleware: No token provided");
      return res.status(401).json({ 
        message: 'Not authorized, no token',
        timestamp: new Date().toISOString()
      });
    }

    try {
      console.log("Auth middleware: Verifying token...");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch full user document for admin endpoints
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.error("Auth middleware: User not found for ID:", decoded.id);
        return res.status(401).json({ 
          message: "User not found",
          timestamp: new Date().toISOString()
        });
      }
      
      req.user = { 
        id: user._id, 
        role: user.role, 
        name: user.name, 
        email: user.email 
      };
      
      console.log("Auth middleware: User authenticated:", req.user.email, "Role:", req.user.role);
      next();
    } catch (error) {
      console.error("Auth middleware: Token verification failed:", error.message);
      res.status(401).json({ 
        message: 'Not authorized, token failed',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error("Auth middleware: Server error:", error);
    res.status(500).json({ 
      message: 'Server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    console.log("Authorize middleware: Checking role", req.user?.role, "against required roles:", roles);
    
    if (!req.user) {
      console.error("Authorize middleware: No user object found");
      return res.status(403).json({ 
        message: "No user information available",
        timestamp: new Date().toISOString()
      });
    }
    
    if (!roles.includes(req.user.role)) {
      console.error("Authorize middleware: User role unauthorized", req.user.role, "required:", roles);
      return res.status(403).json({ 
        message: `User role '${req.user.role}' is not authorized. Required roles: ${roles.join(', ')}`,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log("Authorize middleware: User authorized", req.user.role);
    next();
  };
};
