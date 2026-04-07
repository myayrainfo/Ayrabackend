import express from 'express';
import {
  getStudents, getStudent, createStudent,
  updateStudent, deleteStudent, getStudentStats,
} from './student.controller.js';
import { protect } from '../../../internal/master/middleware/auth.js';
import { body } from 'express-validator';
import validate from '../../../internal/master/middleware/validate.js';

const router = express.Router();
router.use(protect);

const studentValidation = [
  body('rollNo').notEmpty().withMessage('Roll number is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('year').isIn(['1st Year', '2nd Year', '3rd Year', '4th Year']).withMessage('Invalid year'),
];

router.get('/stats', getStudentStats);
router.route('/')
  .get(getStudents)
  .post(studentValidation, validate, createStudent);

router.route('/:id')
  .get(getStudent)
  .put(updateStudent)
  .delete(deleteStudent);

export default router;


