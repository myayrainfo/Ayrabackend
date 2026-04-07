import Teacher from '../models/Teacher.js';
import { sendSuccess, sendError, getPagination, paginationMeta } from '../utils/apiResponse.js';

// ── @GET /api/teachers ──────────────────────────────────────
export const getTeachers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, department, designation, status } = req.query;
    const { skip, limit: lim } = getPagination(page, limit);

    const filter = {};
    if (department) filter.department = department;
    if (designation) filter.designation = designation;
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };

    const [teachers, total] = await Promise.all([
      Teacher.find(filter).skip(skip).limit(lim).sort({ createdAt: -1 }),
      Teacher.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      teachers,
      pagination: paginationMeta(total, page, lim),
    });
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/teachers/:id ──────────────────────────────────
export const getTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return sendError(res, 'Teacher not found.', 404);
    return sendSuccess(res, { teacher });
  } catch (error) {
    next(error);
  }
};

// ── @POST /api/teachers ─────────────────────────────────────
export const createTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.create(req.body);
    return sendSuccess(res, { teacher }, 'Teacher created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/teachers/:id ──────────────────────────────────
export const updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!teacher) return sendError(res, 'Teacher not found.', 404);
    return sendSuccess(res, { teacher }, 'Teacher updated successfully');
  } catch (error) {
    next(error);
  }
};

// ── @DELETE /api/teachers/:id ───────────────────────────────
export const deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return sendError(res, 'Teacher not found.', 404);
    return sendSuccess(res, {}, 'Teacher deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/teachers/stats ────────────────────────────────
export const getTeacherStats = async (req, res, next) => {
  try {
    const [total, active, onLeave, byDept, byDesignation] = await Promise.all([
      Teacher.countDocuments(),
      Teacher.countDocuments({ status: 'Active' }),
      Teacher.countDocuments({ status: 'On Leave' }),
      Teacher.aggregate([{ $group: { _id: '$department', count: { $sum: 1 } } }]),
      Teacher.aggregate([{ $group: { _id: '$designation', count: { $sum: 1 } } }]),
    ]);

    return sendSuccess(res, { total, active, onLeave, byDepartment: byDept, byDesignation });
  } catch (error) {
    next(error);
  }
};




