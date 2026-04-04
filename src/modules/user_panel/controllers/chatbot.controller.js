import Advisory from "../models/Advisory.js";
import AttendanceRecord from "../models/AttendanceRecord.js";
import ClassSchedule from "../models/ClassSchedule.js";
import Student from "../models/Student.js";
import StudentProgress from "../models/StudentProgress.js";
import TeacherAssignment from "../models/TeacherAssignment.js";

function getTodayName() {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "Asia/Calcutta" }).format(new Date());
}

function formatClassLine(item) {
  return `${item.startTime}-${item.endTime}: ${item.subjectName || item.className} in ${item.room}`;
}

function buildStudentReply(query, stats, context) {
  const lowerQuery = query.toLowerCase();

  if (/^(hi|hello|hey)\b/.test(lowerQuery)) {
    return `Hi ${context.displayName || "there"}. Ask me about today's classes, attendance, CGPA, or grades.`;
  }

  if (/attendance/i.test(query)) {
    return `${context.displayName || "You"} have ${stats.attendanceCount} attendance entries available. Open My Attendance to review the day-wise records and percentage summary.`;
  }

  if (/grade|cgpa|sgpa|marks|progress/i.test(query)) {
    return `${context.displayName || "You"} have ${stats.progressCount} progress records available. Open My Semester Progress and My Profile to review marks, SGPA, and CGPA details.`;
  }

  if (/class|schedule|today/i.test(query)) {
    if (!context.todayClasses.length) {
      return `No classes are scheduled for ${context.todayName}.`;
    }

    return `Hi ${context.displayName || "there"}. Your classes for ${context.todayName}: ${context.todayClasses
      .slice(0, 4)
      .map(formatClassLine)
      .join("; ")}.`;
  }

  return `I found ${stats.progressCount} progress records, ${stats.attendanceCount} attendance entries, and ${stats.classCount} class schedules for your tenant. Ask about attendance, grades, or classes.`;
}

function buildTeacherReply(query, stats, context) {
  const lowerQuery = query.toLowerCase();

  if (/^(hi|hello|hey)\b/.test(lowerQuery)) {
    return `Hi ${context.displayName || "there"}. Ask me about today's classes, assigned sections, workload, or alerts.`;
  }

  if (/assignment|section|load/i.test(query)) {
    return `You currently have ${stats.assignmentCount} teaching assignments recorded for this tenant. Open My Teaching Assignments to see semester, section, and subject details.`;
  }

  if (/class|today|schedule/i.test(query)) {
    if (!context.todayClasses.length) {
      return `No classes are scheduled for ${context.todayName}.`;
    }

    return `Hi ${context.displayName || "there"}. Your classes for ${context.todayName}: ${context.todayClasses
      .slice(0, 4)
      .map(formatClassLine)
      .join("; ")}.`;
  }

  return `I found ${stats.assignmentCount} teaching assignments, ${stats.classCount} class schedules, and ${stats.advisoryCount} advisories for this tenant.`;
}

export async function queryChatbot(req, res, next) {
  try {
    const tenantSlug = req.params.tenant;
    const { query = "", role = "student", userId = "", displayName = "", studentId = "" } = req.body;
    const todayName = getTodayName();

    const [assignmentCount, attendanceCount, progressCount, classCount, advisoryCount] = await Promise.all([
      TeacherAssignment.countDocuments({ tenantSlug }),
      AttendanceRecord.countDocuments({ tenantSlug }),
      StudentProgress.countDocuments({ tenantSlug }),
      ClassSchedule.countDocuments({ tenantSlug }),
      Advisory.countDocuments({ tenantSlug }),
    ]);

    const stats = { assignmentCount, attendanceCount, progressCount, classCount, advisoryCount };

    let todayClasses = [];

    if (role === "student") {
      const student = await Student.findOne({
        tenantSlug,
        $or: [{ studentId }, { username: userId }],
      }).lean();

      if (student) {
        todayClasses = await ClassSchedule.find({
          tenantSlug,
          day: todayName,
          department: student.department,
          semester: student.semester,
          section: student.section,
        })
          .sort({ startTime: 1 })
          .lean();
      }
    } else if (role === "teacher") {
      const assignments = await TeacherAssignment.find({
        tenantSlug,
        teacherUsername: userId,
      }).lean();

      if (assignments.length) {
        const assignmentFilters = assignments.map((assignment) => ({
          department: assignment.department,
          semester: assignment.semester,
          section: assignment.section,
          subjectCode: assignment.subjectCode,
        }));

        todayClasses = await ClassSchedule.find({
          tenantSlug,
          day: todayName,
          $or: assignmentFilters,
        })
          .sort({ startTime: 1 })
          .lean();
      }
    }

    const context = { displayName, todayName, todayClasses };

    const response =
      role === "teacher"
        ? buildTeacherReply(query, stats, context)
        : buildStudentReply(query, stats, context);

    res.json({ response, stats });
  } catch (error) {
    next(error);
  }
}
