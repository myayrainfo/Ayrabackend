import Announcement from '../models/Announcement.js';
import { sendSuccess, sendError, getPagination, paginationMeta } from '../utils/apiResponse.js';

// ── @GET /api/communication/announcements ───────────────────
export const getAnnouncements = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, status, priority, audience } = req.query;
    const { skip, limit: lim } = getPagination(page, limit);

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (audience) filter.audience = audience;
    if (search) filter.$text = { $search: search };

    const [announcements, total] = await Promise.all([
      Announcement.find(filter)
        .populate('createdBy', 'name username')
        .skip(skip).limit(lim).sort({ createdAt: -1 }),
      Announcement.countDocuments(filter),
    ]);

    return sendSuccess(res, { announcements, pagination: paginationMeta(total, page, lim) });
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/communication/announcements/:id ───────────────
export const getAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate('createdBy', 'name username');
    if (!announcement) return sendError(res, 'Announcement not found.', 404);
    return sendSuccess(res, { announcement });
  } catch (error) {
    next(error);
  }
};

// ── @POST /api/communication/announcements ──────────────────
export const createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      createdBy: req.admin._id,
      publishedAt: req.body.status === 'Published' ? new Date() : null,
    });
    return sendSuccess(res, { announcement }, 'Announcement created', 201);
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/communication/announcements/:id ───────────────
export const updateAnnouncement = async (req, res, next) => {
  try {
    const update = { ...req.body };

    // Set publishedAt when status changes to Published
    if (req.body.status === 'Published') {
      const existing = await Announcement.findById(req.params.id);
      if (existing && existing.status !== 'Published') {
        update.publishedAt = new Date();
      }
    }

    const announcement = await Announcement.findByIdAndUpdate(req.params.id, update, {
      new: true, runValidators: true,
    });
    if (!announcement) return sendError(res, 'Announcement not found.', 404);
    return sendSuccess(res, { announcement }, 'Announcement updated');
  } catch (error) {
    next(error);
  }
};

// ── @DELETE /api/communication/announcements/:id ────────────
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return sendError(res, 'Announcement not found.', 404);
    return sendSuccess(res, {}, 'Announcement deleted');
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/communication/stats ──────────────────────────
export const getCommunicationStats = async (req, res, next) => {
  try {
    const [total, published, drafts, byCategory] = await Promise.all([
      Announcement.countDocuments(),
      Announcement.countDocuments({ status: 'Published' }),
      Announcement.countDocuments({ status: 'Draft' }),
      Announcement.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);

    return sendSuccess(res, { total, published, drafts, byCategory });
  } catch (error) {
    next(error);
  }
};
