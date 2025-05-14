const express = require('express');
const { getUserStats } = require('../controllers/statController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:userId', authenticate, getUserStats); // Only the user or admin

module.exports = router;
