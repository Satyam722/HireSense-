const jwt = require('jsonwebtoken');
// FIXED: Changed 'User' to 'user' to match your lowercase filename exactly
const User = require('../models/user'); 

// 1. Check if user is logged in
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach the user to the request object so controllers can use it
      req.user = await User.findById(decoded.id).select('-password');
      
      // If user was deleted but token is still valid
      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      return next(); // Use return to ensure the function stops here
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. Check if user has the right permissions (Recruiter/Jobseeker)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };