import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';
import Fee from '../models/Fee.js';
import Announcement from '../models/Announcement.js';
import ExamSchedule from '../models/ExamSchedule.js';
import { sendSuccess } from '../utils/apiResponse.js';

// ── @GET /api/dashboard/stats ────────────────────────────────
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      activeStudents,
      totalTeachers,
      activeCourses,
      feeStats,
      upcomingExams,
      recentAnnouncements,
      studentsByDept,
      monthlyEnrollment,
    ] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: 'Active' }),
      Teacher.countDocuments({ status: 'Active' }),
      Course.countDocuments({ status: 'Active' }),

      // Fee aggregation
      Fee.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            collected: { $sum: '$paidAmount' },
            pending: {
              $sum: {
                $cond: [{ $in: ['$status', ['Pending', 'Partial', 'Overdue']] }, '$balanceAmount', 0],
              },
            },
          },
        },
      ]),

      // Upcoming exams (next 7 days)
      ExamSchedule.find({
        date: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 86400000) },
        status: 'Scheduled',
      })
        .populate('course', 'name code')
        .sort({ date: 1 })
        .limit(5),

      // Latest published announcements
      Announcement.find({ status: 'Published' })
        .sort({ publishedAt: -1 })
        .limit(5)
        .select('title category priority publishedAt audience'),

      // Students by department
      Student.aggregate([
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),

      // Monthly enrollment trend (last 6 months)
      Student.aggregate([
        {
          $match: {
            admissionDate: { $gte: new Date(Date.now() - 180 * 86400000) },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$admissionDate' },
              month: { $month: '$admissionDate' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    const finance = feeStats[0] || { totalRevenue: 0, collected: 0, pending: 0 };

    return sendSuccess(res, {
      students: { total: totalStudents, active: activeStudents },
      teachers: { active: totalTeachers },
      courses: { active: activeCourses },
      finance: {
        totalRevenue: finance.totalRevenue,
        collected: finance.collected,
        pending: finance.pending,
        collectionRate: finance.totalRevenue
          ? ((finance.collected / finance.totalRevenue) * 100).toFixed(1)
          : 0,
      },
      upcomingExams,
      recentAnnouncements,
      studentsByDepartment: studentsByDept,
      monthlyEnrollment,
    });
  } catch (error) {
    next(error);
  }
};
