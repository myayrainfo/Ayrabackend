import Admin from '../models/Admin.js';
import { sendSuccess, sendError, getPagination, paginationMeta } from '../utils/apiResponse.js';

// ── @GET /api/admins ────────────────────────────────────────
export const getAdmins = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { skip, limit: lim } = getPagination(page, limit);

    const [admins, total] = await Promise.all([
      Admin.find({}).skip(skip).limit(lim).sort({ createdAt: -1 }),
      Admin.countDocuments(),
    ]);

    return sendSuccess(res, {
      admins,
      pagination: paginationMeta(total, page, lim),
    });
  } catch (error) {
    next(error);
  }
};

// ── @POST /api/admins ───────────────────────────────────────
export const createAdmin = async (req, res, next) => {
  try {
    const { name, username, email, password, role, phone, department } = req.body;

    // Check duplicate
    const existing = await Admin.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (existing) {
      const field = existing.username === username.toLowerCase() ? 'Username' : 'Email';
      return sendError(res, `${field} already exists. Please use a different one.`, 400);
    }

    const admin = await Admin.create({
      name, username, email, password,
      role: role || 'admin',
      phone, department,
      isActive: true,
    });

    return sendSuccess(res, { admin }, 'Admin created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/admins/:id ────────────────────────────────────
export const updateAdmin = async (req, res, next) => {
  try {
    // Prevent updating own account from this endpoint
    if (req.params.id === req.admin._id.toString()) {
      return sendError(res, 'Use the profile endpoint to update your own account.', 400);
    }

    const { name, email, phone, department, role, isActive } = req.body;
    const admin = await Admin.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, department, role, isActive },
      { new: true, runValidators: true }
    );

    if (!admin) return sendError(res, 'Admin not found.', 404);
    return sendSuccess(res, { admin }, 'Admin updated successfully');
  } catch (error) {
    next(error);
  }
};

// ── @DELETE /api/admins/:id ─────────────────────────────────
export const deleteAdmin = async (req, res, next) => {
  try {
    // Prevent self-deletion
    if (req.params.id === req.admin._id.toString()) {
      return sendError(res, 'You cannot delete your own account.', 400);
    }

    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return sendError(res, 'Admin not found.', 404);

    return sendSuccess(res, {}, 'Admin deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/admins/:id/toggle-status ──────────────────────
export const toggleAdminStatus = async (req, res, next) => {
  try {
    if (req.params.id === req.admin._id.toString()) {
      return sendError(res, 'You cannot deactivate your own account.', 400);
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) return sendError(res, 'Admin not found.', 404);

    admin.isActive = !admin.isActive;
    await admin.save({ validateBeforeSave: false });

    return sendSuccess(res, { admin }, `Admin ${admin.isActive ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    next(error);
  }
};
