const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware exported as the default require target.
async function requireAuth(req, res, next) {
    console.log("Incoming Cookies:", req.cookies);
    // First try Authorization header (Bearer <token>), then fallback to cookie
    let token;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        console.log('Using token from Authorization header');
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        console.log('Using token from cookies');
    }

    if (!token) {
        console.log("No token provided in header or cookies");
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        req.user = await User.findById(decoded.id).select('-password');
        console.log("User Found:", req.user);

        if (!req.user) {
            console.log("User not found in database");
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        next();
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
}
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed
    } else {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

module.exports = { requireAuth, requireAdmin };
