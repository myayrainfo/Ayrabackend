import express from 'express';
import {
  getFees, getFee, createFee,
  updateFee, deleteFee, getFinanceStats,
} from '../controllers/financeController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';

const router = express.Router();
router.use(protect);

const feeValidation = [
  body('student').notEmpty().withMessage('Student ID is required'),
  body('totalAmount').isNumeric().withMessage('Total amount must be a number'),
  body('feeType').notEmpty().withMessage('Fee type is required'),
];

router.get('/stats', getFinanceStats);
router.route('/fees')
  .get(getFees)
  .post(feeValidation, validate, createFee);

router.route('/fees/:id')
  .get(getFee)
  .put(updateFee)
  .delete(deleteFee);

export default router;
