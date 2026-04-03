import express from 'express';
import {
  getCourses, getCourse, createCourse, updateCourse, deleteCourse,
  getExamSchedules, createExamSchedule, updateExamSchedule, deleteExamSchedule,
} from '../controllers/academicsController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';

const router = express.Router();
router.use(protect);

// Courses
const courseValidation = [
  body('code').notEmpty().withMessage('Course code is required'),
  body('name').notEmpty().withMessage('Course name is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('credits').isInt({ min: 1, max: 6 }).withMessage('Credits must be between 1 and 6'),
  body('semester').notEmpty().withMessage('Semester is required'),
];

router.route('/courses')
  .get(getCourses)
  .post(courseValidation, validate, createCourse);

router.route('/courses/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

// Exam Schedules
const examValidation = [
  body('course').notEmpty().withMessage('Course is required'),
  body('examType').notEmpty().withMessage('Exam type is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('startTime').notEmpty().withMessage('Start time is required'),
  body('venue').notEmpty().withMessage('Venue is required'),
];

router.route('/exams')
  .get(getExamSchedules)
  .post(examValidation, validate, createExamSchedule);

router.route('/exams/:id')
  .put(updateExamSchedule)
  .delete(deleteExamSchedule);

export default router;
