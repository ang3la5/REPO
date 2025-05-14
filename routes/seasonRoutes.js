const express = require('express');
const { deleteSeason } = require('../controllers/seasonController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.delete('/:id', authenticate, isAdmin, deleteSeason);

module.exports = router;
