import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import { sendSuccess, sendError, getPagination, paginationMeta } from '../utils/apiResponse.js';

// ── @GET /api/finance/fees ──────────────────────────────────
export const getFees = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, feeType, academicYear, studentId } = req.query;
    const { skip, limit: lim } = getPagination(page, limit);

    const filter = {};
    if (status) filter.status = status;
    if (feeType) filter.feeType = feeType;
    if (academicYear) filter.academicYear = academicYear;
    if (studentId) filter.student = studentId;

    const [fees, total] = await Promise.all([
      Fee.find(filter)
        .populate('student', 'name rollNo department year email')
        .skip(skip).limit(lim).sort({ createdAt: -1 }),
      Fee.countDocuments(filter),
    ]);

    return sendSuccess(res, { fees, pagination: paginationMeta(total, page, lim) });
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/finance/fees/:id ──────────────────────────────
export const getFee = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id).populate('student', 'name rollNo email department');
    if (!fee) return sendError(res, 'Fee record not found.', 404);
    return sendSuccess(res, { fee });
  } catch (error) {
    next(error);
  }
};

// ── @POST /api/finance/fees ─────────────────────────────────
export const createFee = async (req, res, next) => {
  try {
    const fee = await Fee.create(req.body);

    // Sync student feeStatus
    const balance = fee.totalAmount - fee.paidAmount;
    let feeStatus = 'Pending';
    if (balance <= 0) feeStatus = 'Paid';
    else if (fee.paidAmount > 0) feeStatus = 'Partial';

    await Student.findByIdAndUpdate(fee.student, { feeStatus });

    return sendSuccess(res, { fee }, 'Fee record created', 201);
  } catch (error) {
    next(error);
  }
};

// ── @PUT /api/finance/fees/:id ──────────────────────────────
export const updateFee = async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!fee) return sendError(res, 'Fee record not found.', 404);

    // Sync student feeStatus
    const balance = fee.totalAmount - fee.paidAmount;
    let feeStatus = 'Pending';
    if (balance <= 0) feeStatus = 'Paid';
    else if (fee.paidAmount > 0) feeStatus = 'Partial';
    await Student.findByIdAndUpdate(fee.student, { feeStatus });

    return sendSuccess(res, { fee }, 'Fee record updated');
  } catch (error) {
    next(error);
  }
};

// ── @DELETE /api/finance/fees/:id ───────────────────────────
export const deleteFee = async (req, res, next) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return sendError(res, 'Fee record not found.', 404);
    return sendSuccess(res, {}, 'Fee record deleted');
  } catch (error) {
    next(error);
  }
};

// ── @GET /api/finance/stats ─────────────────────────────────
export const getFinanceStats = async (req, res, next) => {
  try {
    const stats = await Fee.aggregate([
      {
        $group: {
          _id: '$status',
          totalAmount: { $sum: '$totalAmount' },
          paidAmount: { $sum: '$paidAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyCollection = await Fee.aggregate([
      { $match: { status: { $in: ['Paid', 'Partial'] } } },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' },
          },
          collected: { $sum: '$paidAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    const totalRevenue = await Fee.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' }, collected: { $sum: '$paidAmount' } } },
    ]);

    return sendSuccess(res, {
      byStatus: stats,
      monthlyCollection,
      totalRevenue: totalRevenue[0] || { total: 0, collected: 0 },
    });
  } catch (error) {
    next(error);
  }
};
