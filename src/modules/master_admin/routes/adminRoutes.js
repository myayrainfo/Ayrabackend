import express from 'express';
import {
  getAdmins, createAdmin, updateAdmin,
  deleteAdmin, toggleAdminStatus, getAdminStats,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';

const router = express.Router();

// All admin management routes require authentication
router.use(protect);
router.use(authorize('superadmin'));

const createAdminValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('username').trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['superadmin', 'admin', 'staff']).withMessage('Invalid role'),
];

router.route('/')
  .get(getAdmins)
  .post(createAdminValidation, validate, createAdmin);

router.get('/stats', getAdminStats);

router.route('/:id')
  .put(updateAdmin)
  .delete(deleteAdmin);

router.put('/:id/toggle-status', toggleAdminStatus);

export default router;
