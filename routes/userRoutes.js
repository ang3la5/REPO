const express = require('express');
const { registerUser, loginUser, promoteUserToAdmin } = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

// Promote User to Admin (Protected Route - Admin Only)
router.put('/promote/:id', authenticate, isAdmin, promoteUserToAdmin);

module.exports = router;
