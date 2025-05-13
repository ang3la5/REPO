const express = require('express');
const { getFullSeries } = require('../controllers/seriesController');
const router = express.Router();

router.get('/:id', getFullSeries); // Public route

module.exports = router;
