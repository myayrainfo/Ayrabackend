import Course from '../models/Course.js';
import ExamSchedule from '../models/ExamSchedule.js';
import { sendSuccess, sendError, getPagination, paginationMeta } from '../utils/apiResponse.js';

// ════════════════════════════════════════
//  COURSES
// ════════════════════════════════════════

export const getCourses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, department, semester, status } = req.query;
    const { skip, limit: lim } = getPagination(page, limit);

    const filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const [courses, total] = await Promise.all([
      Course.find(filter).populate('faculty', 'name email designation').skip(skip).limit(lim).sort({ createdAt: -1 }),
      Course.countDocuments(filter),
    ]);

    return sendSuccess(res, { courses, pagination: paginationMeta(total, page, lim) });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('faculty', 'name email designation');
    if (!course) return sendError(res, 'Course not found.', 404);
    return sendSuccess(res, { course });
  } catch (error) {
    next(error);
  }
};

export const createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    return sendSuccess(res, { course }, 'Course created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return sendError(res, 'Course not found.', 404);
    return sendSuccess(res, { course }, 'Course updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return sendError(res, 'Course not found.', 404);
    return sendSuccess(res, {}, 'Course deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ════════════════════════════════════════
//  EXAM SCHEDULES
// ════════════════════════════════════════

export const getExamSchedules = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, examType } = req.query;
    const { skip, limit: lim } = getPagination(page, limit);

    const filter = {};
    if (status) filter.status = status;
    if (examType) filter.examType = examType;

    const [exams, total] = await Promise.all([
      ExamSchedule.find(filter)
        .populate('course', 'name code department')
        .populate('invigilators', 'name')
        .skip(skip).limit(lim).sort({ date: 1 }),
      ExamSchedule.countDocuments(filter),
    ]);

    return sendSuccess(res, { exams, pagination: paginationMeta(total, page, lim) });
  } catch (error) {
    next(error);
  }
};

export const createExamSchedule = async (req, res, next) => {
  try {
    const exam = await ExamSchedule.create(req.body);
    return sendSuccess(res, { exam }, 'Exam scheduled successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateExamSchedule = async (req, res, next) => {
  try {
    const exam = await ExamSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) return sendError(res, 'Exam schedule not found.', 404);
    return sendSuccess(res, { exam }, 'Exam schedule updated');
  } catch (error) {
    next(error);
  }
};

export const deleteExamSchedule = async (req, res, next) => {
  try {
    const exam = await ExamSchedule.findByIdAndDelete(req.params.id);
    if (!exam) return sendError(res, 'Exam schedule not found.', 404);
    return sendSuccess(res, {}, 'Exam schedule deleted');
  } catch (error) {
    next(error);
  }
};
