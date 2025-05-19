const express = require('express');
const { importMovieFromTMDb } = require('../controllers/movieImportController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/import', authenticate, importMovieFromTMDb);

module.exports = router;
