const jwt = require('jsonwebtoken');
const User = require('../models/User'); // To ensure user exists, optional

// Middleware to verify JWT and attach user to request
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's ID
      // You might choose to just trust the decoded.id and not hit the DB here for performance,
      // or hit the DB to ensure the user still exists and hasn't been disabled/deleted.
      // For this example, we'll just use the decoded ID.
      req.user = { id: decoded.id, email: decoded.email }; // Attach minimal user info

      next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
