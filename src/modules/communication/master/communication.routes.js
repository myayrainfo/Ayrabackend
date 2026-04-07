import express from 'express';
import {
  getAnnouncements, getAnnouncement, createAnnouncement,
  updateAnnouncement, deleteAnnouncement, getCommunicationStats,
} from './communication.controller.js';
import { protect } from '../../../internal/master/middleware/auth.js';
import { body } from 'express-validator';
import validate from '../../../internal/master/middleware/validate.js';

const router = express.Router();
router.use(protect);

const announcementValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category').notEmpty().withMessage('Category is required'),
];

router.get('/stats', getCommunicationStats);
router.route('/announcements')
  .get(getAnnouncements)
  .post(announcementValidation, validate, createAnnouncement);

router.route('/announcements/:id')
  .get(getAnnouncement)
  .put(updateAnnouncement)
  .delete(deleteAnnouncement);

export default router;


