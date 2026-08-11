const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { getDashboard } = require('../controllers/userController');

const router = express.Router();

router.get('/dashboard', authenticate, getDashboard);

module.exports = router;
