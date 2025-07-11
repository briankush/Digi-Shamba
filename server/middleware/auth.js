const jwt = require('jsonwebtoken');

// checks token and sets req.user
exports.protect= (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({message: "No token Given"});

    const token = auth.split(" ")[1];
    try {
        const decode= jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode; 
        next();

        } catch (error) {
            return res.status(403).json({message: "Invalid token"});
        
    }
};


// checks role
exports.authorize= (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return res.status(403).json({message: "Forbidden"});
        next();
    };
}