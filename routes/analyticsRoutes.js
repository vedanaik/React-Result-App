const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();
router.get('/', authenticate, authorize(['admin', 'faculty']), getAnalytics);
module.exports = router;
