import adminService from "../admin/admin.service.js";
import attendanceService from "../attendance/attendance.service.js";
import examService from "../exams/exam.service.js";
import financeService from "../finance/finance.service.js";
import studentService from "../students/student.service.js";
import teacherService from "../teachers/teacher.service.js";
import { getDashboardSeedData } from "./seed/dashboard.seed.js";

function sum(items, field) {
  return items.reduce((total, item) => total + Number(item?.[field] || 0), 0);
}

async function getSummary(tenantId) {
  const [students, teachers, financeRecords, upcomingExams, admins, attendanceRecords] = await Promise.all([
    studentService.listAllRaw(tenantId),
    teacherService.listAllRaw(tenantId),
    financeService.listAllRaw(tenantId),
    examService.listAllRaw(tenantId),
    adminService.listAllRaw(tenantId),
    attendanceService.listAllRaw(tenantId),
  ]);

  const base = getDashboardSeedData();
  const paidRecords = financeRecords.filter((item) => String(item.status).toLowerCase() === "paid");
  const pendingRecords = financeRecords.filter((item) => String(item.status).toLowerCase() !== "paid");

  return {
    ...base,
    admins: {
      total: admins.length,
    },
    students: {
      total: students.length || base.students.total,
      active: students.filter((item) => String(item.status).toLowerCase() === "accept").length || base.students.active,
    },
    teachers: {
      active: teachers.filter((item) => !item.assignmentOnly).length || base.teachers.active,
    },
    finance: {
      collected: sum(paidRecords, "amount") || base.finance.collected,
      pending: sum(pendingRecords, "amount") || base.finance.pending,
      collectionRate:
        financeRecords.length > 0 ? Math.round((paidRecords.length / financeRecords.length) * 100) : base.finance.collectionRate,
    },
    attendance: {
      totalRecords: attendanceRecords.length,
    },
    upcomingExams: upcomingExams.slice(0, 5).map((item) => ({
      course: { name: item.courseName || item.subjectName || item.title || "Exam" },
      date: item.date,
      startTime: item.startTime,
      venue: item.venue,
      examType: item.examType,
    })),
  };
}

export default {
  getSummary,
};
