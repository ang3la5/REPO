const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

exports.authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user to get role and ensure they still exist
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Attach full user data to req
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
