const express = require('express');
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { createOrUpdateResult, getResults, getResultByStudent, deleteResult } = require('../controllers/resultController');

const router = express.Router();

router.post('/', authenticate, authorize(['faculty', 'admin']), [
  body('studentId').notEmpty(),
  body('subject1MSE').isInt({ min: 0, max: 30 }),
  body('subject1ESE').isInt({ min: 0, max: 70 }),
  body('subject2MSE').isInt({ min: 0, max: 30 }),
  body('subject2ESE').isInt({ min: 0, max: 70 }),
  body('subject3MSE').isInt({ min: 0, max: 30 }),
  body('subject3ESE').isInt({ min: 0, max: 70 }),
  body('subject4MSE').isInt({ min: 0, max: 30 }),
  body('subject4ESE').isInt({ min: 0, max: 70 }),
], createOrUpdateResult);

router.get('/', authenticate, authorize(['faculty', 'admin']), getResults);
router.get('/student/:studentId', authenticate, authorize(['student', 'faculty', 'admin']), getResultByStudent);
router.delete('/:id', authenticate, authorize(['admin']), deleteResult);

module.exports = router;
