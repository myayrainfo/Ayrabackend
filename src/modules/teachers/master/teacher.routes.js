import express from 'express';
import {
  getTeachers, getTeacher, createTeacher,
  updateTeacher, deleteTeacher, getTeacherStats,
} from './teacher.controller.js';
import { protect } from '../../../internal/master/middleware/auth.js';
import { body } from 'express-validator';
import validate from '../../../internal/master/middleware/validate.js';

const router = express.Router();
router.use(protect);

const teacherValidation = [
  body('facultyId').notEmpty().withMessage('Faculty ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('designation')
    .isIn(['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Visiting Faculty'])
    .withMessage('Invalid designation'),
];

router.get('/stats', getTeacherStats);
router.route('/')
  .get(getTeachers)
  .post(teacherValidation, validate, createTeacher);

router.route('/:id')
  .get(getTeacher)
  .put(updateTeacher)
  .delete(deleteTeacher);

export default router;


