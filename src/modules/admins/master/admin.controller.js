import Admin from '../../../internal/master/models/Admin.js';
import { sendSuccess, sendError, getPagination, paginationMeta } from '../../../internal/master/utils/apiResponse.js';

const buildAdminFilter = ({ search, includeDeleted = false }) => {
  const filter = includeDeleted ? {} : { isDeleted: false };
  if (search) {
    filter.$text = { $search: search };
  }
  return filter;
};

const serializeAdmin = (admin) => {
  const data = admin.toObject ? admin.toObject() : admin;
  const lastActivity = data.lastActivityAt || data.lastLogin || data.updatedAt || data.createdAt;
  const serviceEnd = data.deletedAt || null;
  const serviceDays = Math.max(
    1,
    Math.ceil(((serviceEnd || new Date()) - new Date(data.createdAt)) / (1000 * 60 * 60 * 24))
  );

  return {
    ...data,
    lastActivity,
    serviceStart: data.createdAt,
    serviceEnd,
    serviceDays,
  };
};

export const getAdmins = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', includeDeleted = 'false' } = req.query;
    const { skip, limit: lim } = getPagination(page, limit);
    const shouldIncludeDeleted = includeDeleted === 'true';
    const filter = buildAdminFilter({ search, includeDeleted: shouldIncludeDeleted });

    const [admins, total] = await Promise.all([
      Admin.find(filter)
        .populate('deletedBy', 'name username')
        .skip(skip)
        .limit(lim)
        .sort({ isDeleted: 1, createdAt: -1 }),
      Admin.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      admins: admins.map(serializeAdmin),
      pagination: paginationMeta(total, page, lim),
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (req, res, next) => {
  try {
    const [totalAdmins, activeAdmins, inactiveAdmins, deletedAdmins, roleStats, latestAdmins, removedAdmins] = await Promise.all([
      Admin.countDocuments({ isDeleted: false }),
      Admin.countDocuments({ isDeleted: false, isActive: true }),
      Admin.countDocuments({ isDeleted: false, isActive: false }),
      Admin.countDocuments({ isDeleted: true }),
      Admin.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
      Admin.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5),
      Admin.find({ isDeleted: true }).populate('deletedBy', 'name username').sort({ deletedAt: -1 }).limit(10),
    ]);

    return sendSuccess(res, {
      totals: {
        totalAdmins,
        activeAdmins,
        inactiveAdmins,
        deletedAdmins,
      },
      byRole: roleStats,
      latestAdmins: latestAdmins.map(serializeAdmin),
      removedAdmins: removedAdmins.map(serializeAdmin),
    });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { name, username, email, password, role, phone, department } = req.body;

    const existing = await Admin.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (existing && !existing.isDeleted) {
      const field = existing.username === username.toLowerCase() ? 'Username' : 'Email';
      return sendError(res, `${field} already exists. Please use a different one.`, 400);
    }

    if (existing?.isDeleted) {
      return sendError(res, 'An archived admin already uses this username or email.', 400);
    }

    const admin = await Admin.create({
      name,
      username,
      email,
      password,
      role: role || 'admin',
      phone,
      department,
      isActive: true,
      isDeleted: false,
      lastActivityAt: new Date(),
    });

    return sendSuccess(res, { admin: serializeAdmin(admin) }, 'Admin created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    if (req.params.id === req.admin._id.toString()) {
      return sendError(res, 'Use the profile endpoint to update your own account.', 400);
    }

    const { name, email, phone, department, role, isActive } = req.body;
    const admin = await Admin.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { name, email, phone, department, role, isActive, lastActivityAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!admin) return sendError(res, 'Admin not found.', 404);
    return sendSuccess(res, { admin: serializeAdmin(admin) }, 'Admin updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    if (req.params.id === req.admin._id.toString()) {
      return sendError(res, 'You cannot delete your own account.', 400);
    }

    const admin = await Admin.findOne({ _id: req.params.id, isDeleted: false });
    if (!admin) return sendError(res, 'Admin not found.', 404);

    admin.isDeleted = true;
    admin.isActive = false;
    admin.deletedAt = new Date();
    admin.deletedBy = req.admin._id;
    admin.deletionReason = req.body?.reason || 'Removed by Master Admin';
    admin.lastActivityAt = new Date();
    await admin.save({ validateBeforeSave: false });

    return sendSuccess(res, { admin: serializeAdmin(admin) }, 'Admin archived successfully');
  } catch (error) {
    next(error);
  }
};

export const toggleAdminStatus = async (req, res, next) => {
  try {
    if (req.params.id === req.admin._id.toString()) {
      return sendError(res, 'You cannot deactivate your own account.', 400);
    }

    const admin = await Admin.findOne({ _id: req.params.id, isDeleted: false });
    if (!admin) return sendError(res, 'Admin not found.', 404);

    admin.isActive = !admin.isActive;
    admin.lastActivityAt = new Date();
    await admin.save({ validateBeforeSave: false });

    return sendSuccess(res, { admin: serializeAdmin(admin) }, `Admin ${admin.isActive ? 'activated' : 'deactivated'} successfully`);
  } catch (error) {
    next(error);
  }
};


