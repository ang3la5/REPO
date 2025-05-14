const express = require('express');
const { setPreferences, getPreferences } = require('../controllers/preferenceController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/', authenticate, setPreferences);
router.get('/', authenticate, getPreferences);

module.exports = router;
