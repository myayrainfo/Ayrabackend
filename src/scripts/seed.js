import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDatabase from "../core/database/connection.js";
import academicModel from "../modules/academics/academic.model.js";
import adminModel from "../modules/admin/admin.model.js";
import attendanceModel from "../modules/attendance/attendance.model.js";
import authAccountModel from "../modules/auth/auth.model.js";
import calendarModel from "../modules/calendar/calendar.model.js";
import courseModel from "../modules/courses/course.model.js";
import departmentModel from "../modules/departments/department.model.js";
import examModel from "../modules/exams/exam.model.js";
import financeModel from "../modules/finance/finance.model.js";
import noticeModel from "../modules/notices/notice.model.js";
import resultModel from "../modules/results/result.model.js";
import studentModel from "../modules/students/student.model.js";
import teacherModel from "../modules/teachers/teacher.model.js";
import timetableModel from "../modules/timetable/timetable.model.js";
import { getAcademicSeedData } from "../modules/academics/seed/academic.seed.js";
import { getAdminSeedData } from "../modules/admin/seed/admin.seed.js";
import { getAttendanceSeedData } from "../modules/attendance/seed/attendance.seed.js";
import { getCalendarSeedData } from "../modules/calendar/seed/calendar.seed.js";
import { getCourseSeedData } from "../modules/courses/seed/course.seed.js";
import { getDepartmentSeedData } from "../modules/departments/seed/department.seed.js";
import { getExamSeedData } from "../modules/exams/seed/exam.seed.js";
import { getFinanceSeedData } from "../modules/finance/seed/finance.seed.js";
import { getNoticeSeedData } from "../modules/notices/seed/notice.seed.js";
import { getResultSeedData } from "../modules/results/seed/result.seed.js";
import { getStudentSeedData } from "../modules/students/seed/student.seed.js";
import { getTeacherSeedData } from "../modules/teachers/seed/teacher.seed.js";
import { getTimetableSeedData } from "../modules/timetable/seed/timetable.seed.js";
import { adminAccounts, userAccounts } from "../seed/auth.seed.js";

const tenantId = process.env.DEFAULT_TENANT || "cgu";

function setOnInsert(doc) {
  const { _id, ...rest } = doc;
  return {
    $setOnInsert: rest,
  };
}

async function seedAuthAccounts() {
  const allAccounts = [...adminAccounts, ...userAccounts];

  for (const account of allAccounts) {
    const passwordHash = await bcrypt.hash(account.password, 10);
    await authAccountModel.findOneAndUpdate(
      { tenantId: account.tenantId, username: account.username, role: account.role },
      {
        $set: {
          email: account.email || "",
          name: account.name || account.displayName || "",
          displayName: account.displayName || account.name || "",
          passwordHash,
          allowedPortals: account.allowedPortals || [],
          isActive: true,
          profile: account.profile || {},
        },
        $setOnInsert: {
          tenantId: account.tenantId,
          username: account.username,
          role: account.role,
        },
      },
      { upsert: true, new: true },
    );
  }
}

async function seedCollection(model, docs, buildFilter) {
  for (const doc of docs) {
    await model.findOneAndUpdate(buildFilter(doc), setOnInsert(doc), { upsert: true, new: true });
  }
}

await connectDatabase();

await seedAuthAccounts();
await seedCollection(adminModel, getAdminSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, username: doc.username }));
await seedCollection(studentModel, getStudentSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, studentId: doc.studentId }));
await seedCollection(
  teacherModel,
  getTeacherSeedData(tenantId),
  (doc) => ({ tenantId: doc.tenantId, username: doc.username, subjectCode: doc.subjectCode || "", assignmentOnly: Boolean(doc.assignmentOnly) }),
);
await seedCollection(departmentModel, getDepartmentSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, code: doc.code }));
await seedCollection(courseModel, getCourseSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, code: doc.code }));
await seedCollection(attendanceModel, getAttendanceSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, studentId: doc.studentId, date: doc.date }));
await seedCollection(calendarModel, getCalendarSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, eventName: doc.eventName, eventDate: doc.eventDate }));
await seedCollection(examModel, getExamSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, courseCode: doc.courseCode, date: doc.date }));
await seedCollection(resultModel, getResultSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, studentId: doc.studentId, subjectCode: doc.subjectCode }));
await seedCollection(financeModel, getFinanceSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, title: doc.title, studentId: doc.studentId }));
await seedCollection(noticeModel, getNoticeSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, title: doc.title, noticeType: doc.noticeType }));
await seedCollection(timetableModel, getTimetableSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, subjectCode: doc.subjectCode, day: doc.day, startTime: doc.startTime }));
await seedCollection(academicModel, getAcademicSeedData(tenantId), (doc) => ({ tenantId: doc.tenantId, category: doc.category, title: doc.title || doc.recordType || doc.studentId || "" }));

const collections = await mongoose.connection.db.listCollections().toArray();
console.log(
  JSON.stringify(
    {
      ok: true,
      db: mongoose.connection.name,
      collections: collections.map((item) => item.name).sort(),
    },
    null,
    2,
  ),
);

await mongoose.disconnect();
