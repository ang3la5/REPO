const express = require('express');
const { importSeries } = require('../controllers/seriesImportController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/import-series', authenticate, importSeries);

module.exports = router;
