const express = require('express');
const { body } = require('express-validator');
const { login, register } = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'faculty', 'student']),
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], login);

module.exports = router;
