import { body } from 'express-validator';

export const loginValidator = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const studentValidator = [
  body('rollNo').trim().notEmpty().withMessage('Roll number is required').toUpperCase(),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('year')
    .isIn(['1st Year', '2nd Year', '3rd Year', '4th Year'])
    .withMessage('Year must be one of: 1st Year, 2nd Year, 3rd Year, 4th Year'),
  body('cgpa').optional().isFloat({ min: 0, max: 10 }).withMessage('CGPA must be between 0 and 10'),
];

export const teacherValidator = [
  body('facultyId').trim().notEmpty().withMessage('Faculty ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('designation')
    .isIn(['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Visiting Faculty'])
    .withMessage('Invalid designation'),
];

export const feeValidator = [
  body('student').notEmpty().isMongoId().withMessage('Valid student ID is required'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('feeType')
    .isIn(['Tuition Fee', 'Exam Fee', 'Library Fee', 'Hostel Fee', 'Transport Fee', 'Other'])
    .withMessage('Invalid fee type'),
];

export const announcementValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category')
    .isIn(['Academic', 'Finance', 'Events', 'General', 'Faculty', 'Examinations'])
    .withMessage('Invalid category'),
  body('priority').optional().isIn(['High', 'Medium', 'Low']).withMessage('Invalid priority'),
];
