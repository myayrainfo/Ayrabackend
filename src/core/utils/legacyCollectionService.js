import academicService from "../../modules/academics/academic.service.js";
import adminService from "../../modules/admin/admin.service.js";
import attendanceService from "../../modules/attendance/attendance.service.js";
import calendarService from "../../modules/calendar/calendar.service.js";
import courseService from "../../modules/courses/course.service.js";
import { getAdminSeedData } from "../../modules/admin/seed/admin.seed.js";
import { getAcademicSeedData } from "../../modules/academics/seed/academic.seed.js";
import { getAttendanceSeedData } from "../../modules/attendance/seed/attendance.seed.js";
import { getCalendarSeedData } from "../../modules/calendar/seed/calendar.seed.js";
import { getCourseSeedData } from "../../modules/courses/seed/course.seed.js";
import { getDashboardLegacyCollections } from "../../modules/dashboard/seed/legacyCollections.seed.js";
import { getNoticeSeedData } from "../../modules/notices/seed/notice.seed.js";
import { getResultSeedData } from "../../modules/results/seed/result.seed.js";
import { getStudentSeedData } from "../../modules/students/seed/student.seed.js";
import { getTeacherSeedData } from "../../modules/teachers/seed/teacher.seed.js";
import { getTimetableSeedData } from "../../modules/timetable/seed/timetable.seed.js";
import noticeService from "../../modules/notices/notice.service.js";
import resultService from "../../modules/results/result.service.js";
import studentService from "../../modules/students/student.service.js";
import teacherService from "../../modules/teachers/teacher.service.js";
import timetableService from "../../modules/timetable/timetable.service.js";

const tenantStores = new Map();

const dbBackedCollectionHandlers = {
  admins: {
    list: (tenantId) => adminService.listAllRaw(tenantId),
    create: (tenantId, payload) => adminService.create(tenantId, payload),
    update: (tenantId, id, payload) => adminService.update(tenantId, id, payload),
    remove: (tenantId, id) => adminService.remove(tenantId, id),
  },
  students: {
    list: (tenantId) => studentService.listAllRaw(tenantId),
    create: (tenantId, payload) => studentService.create(tenantId, payload),
    update: (tenantId, id, payload) => studentService.update(tenantId, id, payload),
    remove: (tenantId, id) => studentService.remove(tenantId, id),
  },
  "teacher/students": {
    list: (tenantId) => studentService.listAllRaw(tenantId),
    create: (tenantId, payload) => studentService.create(tenantId, payload),
    update: (tenantId, id, payload) => studentService.update(tenantId, id, payload),
    remove: (tenantId, id) => studentService.remove(tenantId, id),
  },
  "academic/students": {
    list: (tenantId) => studentService.listAllRaw(tenantId),
  },
  "teacher/subjects": {
    list: (tenantId) => courseService.listAllRaw(tenantId).then((items) => items.map((item) => ({
      ...item,
      subjectCode: item.code,
      subjectName: item.name,
    }))),
    create: (tenantId, payload) => courseService.create(tenantId, {
      ...payload,
      code: payload.code || payload.subjectCode,
      name: payload.name || payload.subjectName,
    }),
    update: (tenantId, id, payload) =>
      courseService.update(tenantId, id, {
        ...payload,
        code: payload.code || payload.subjectCode,
        name: payload.name || payload.subjectName,
      }),
    remove: (tenantId, id) => courseService.remove(tenantId, id),
  },
  "teacher/classes": {
    list: (tenantId) => timetableService.listAllRaw(tenantId),
    create: (tenantId, payload) => timetableService.create(tenantId, payload),
    update: (tenantId, id, payload) => timetableService.update(tenantId, id, payload),
    remove: (tenantId, id) => timetableService.remove(tenantId, id),
  },
  "teacher/progress": {
    list: (tenantId) => resultService.listAllRaw(tenantId),
    create: (tenantId, payload) => resultService.create(tenantId, payload),
    update: (tenantId, id, payload) => resultService.update(tenantId, id, payload),
    remove: (tenantId, id) => resultService.remove(tenantId, id),
  },
  "students/progress": {
    list: (tenantId) => resultService.listAllRaw(tenantId),
    create: (tenantId, payload) => resultService.create(tenantId, payload),
    update: (tenantId, id, payload) => resultService.update(tenantId, id, payload),
    remove: (tenantId, id) => resultService.remove(tenantId, id),
  },
  "teacher/attendance": {
    list: (tenantId) => attendanceService.listAllRaw(tenantId),
    create: (tenantId, payload) => attendanceService.create(tenantId, payload),
    update: (tenantId, id, payload) => attendanceService.update(tenantId, id, payload),
    remove: (tenantId, id) => attendanceService.remove(tenantId, id),
  },
  "students/attendance": {
    list: (tenantId) => attendanceService.listAllRaw(tenantId),
    create: (tenantId, payload) => attendanceService.create(tenantId, payload),
    update: (tenantId, id, payload) => attendanceService.update(tenantId, id, payload),
    remove: (tenantId, id) => attendanceService.remove(tenantId, id),
  },
  "academic/attendance": {
    list: (tenantId) => attendanceService.listAllRaw(tenantId),
  },
  "calendar/events": {
    list: (tenantId) => calendarService.listAllRaw(tenantId),
    create: (tenantId, payload) => calendarService.create(tenantId, payload),
    update: (tenantId, id, payload) => calendarService.update(tenantId, id, payload),
    remove: (tenantId, id) => calendarService.remove(tenantId, id),
  },
  "teacher/alerts": {
    list: (tenantId) => noticeService.listAllRaw(tenantId).then((items) => items.filter((item) => item.noticeType === "alert")),
    create: (tenantId, payload) => noticeService.create(tenantId, payload),
    update: (tenantId, id, payload) => noticeService.update(tenantId, id, payload),
    remove: (tenantId, id) => noticeService.remove(tenantId, id),
  },
  "students/alerts": {
    list: (tenantId) => noticeService.listAllRaw(tenantId).then((items) => items.filter((item) => item.noticeType === "alert")),
  },
  "academic/alerts": {
    list: (tenantId) => noticeService.listAllRaw(tenantId).then((items) => items.filter((item) => item.noticeType === "alert")),
  },
  "teacher/advisories": {
    list: (tenantId) =>
      noticeService.listAllRaw(tenantId).then((items) =>
        items.filter((item) => item.noticeType === "advisory").map((item) => ({
          ...item,
          message: item.content,
          teacherName: item.authorName,
          targetAudience: item.audience,
        })),
      ),
    create: (tenantId, payload) =>
      noticeService.create(tenantId, {
        ...payload,
        noticeType: "advisory",
        content: payload.content || payload.message,
        authorName: payload.authorName || payload.teacherName,
        audience: payload.audience || payload.targetAudience,
      }),
    update: (tenantId, id, payload) =>
      noticeService.update(tenantId, id, {
        ...payload,
        content: payload.content || payload.message,
        authorName: payload.authorName || payload.teacherName,
        audience: payload.audience || payload.targetAudience,
      }),
    remove: (tenantId, id) => noticeService.remove(tenantId, id),
  },
  "academic/teachers": {
    list: (tenantId) => teacherService.listAllRaw(tenantId).then((items) => items.filter((item) => !item.assignmentOnly)),
    create: (tenantId, payload) => teacherService.create(tenantId, payload),
    update: (tenantId, id, payload) => teacherService.update(tenantId, id, payload),
    remove: (tenantId, id) => teacherService.remove(tenantId, id),
  },
  "academic/teacher-assignments": {
    list: (tenantId) => teacherService.listAllRaw(tenantId).then((items) => items.filter((item) => item.assignmentOnly)),
    create: (tenantId, payload) => teacherService.create(tenantId, { ...payload, assignmentOnly: true }),
    update: (tenantId, id, payload) => teacherService.update(tenantId, id, payload),
    remove: (tenantId, id) => teacherService.remove(tenantId, id),
  },
  "academic/curriculum-plans": {
    list: (tenantId) => academicService.listAllRaw(tenantId).then((items) => items.filter((item) => item.category === "curriculum-plan")),
    create: (tenantId, payload) => academicService.create(tenantId, { ...payload, category: "curriculum-plan" }),
    update: (tenantId, id, payload) => academicService.update(tenantId, id, payload),
    remove: (tenantId, id) => academicService.remove(tenantId, id),
  },
  "academic/approvals": {
    list: (tenantId) => academicService.listAllRaw(tenantId).then((items) => items.filter((item) => item.category === "approval")),
    create: (tenantId, payload) => academicService.create(tenantId, { ...payload, category: "approval" }),
    update: (tenantId, id, payload) => academicService.update(tenantId, id, payload),
    remove: (tenantId, id) => academicService.remove(tenantId, id),
  },
  "academic/records": {
    list: (tenantId) => academicService.listAllRaw(tenantId).then((items) => items.filter((item) => item.category === "record")),
    create: (tenantId, payload) => academicService.create(tenantId, { ...payload, category: "record" }),
    update: (tenantId, id, payload) => academicService.update(tenantId, id, payload),
    remove: (tenantId, id) => academicService.remove(tenantId, id),
  },
  "students/support-contacts": {
    list: (tenantId) => academicService.listAllRaw(tenantId).then((items) => items.filter((item) => item.category === "support-contact")),
  },
  "students/leave-requests": {
    list: (tenantId) => academicService.listAllRaw(tenantId).then((items) => items.filter((item) => item.category === "leave-request")),
    create: (tenantId, payload) => academicService.create(tenantId, { ...payload, category: "leave-request" }),
    update: (tenantId, id, payload) => academicService.update(tenantId, id, payload),
    remove: (tenantId, id) => academicService.remove(tenantId, id),
  },
  "teacher/leave-requests": {
    list: (tenantId) => academicService.listAllRaw(tenantId).then((items) => items.filter((item) => item.category === "leave-request")),
    update: (tenantId, id, payload) => academicService.update(tenantId, id, payload),
  },
  "academic/leave-requests": {
    list: (tenantId) => academicService.listAllRaw(tenantId).then((items) => items.filter((item) => item.category === "leave-request")),
  },
  "academic/timetables": {
    list: (tenantId) => timetableService.listAllRaw(tenantId),
    create: (tenantId, payload) => timetableService.create(tenantId, payload),
    update: (tenantId, id, payload) => timetableService.update(tenantId, id, payload),
    remove: (tenantId, id) => timetableService.remove(tenantId, id),
  },
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createLegacyCollections(tenantId) {
  const students = getStudentSeedData(tenantId);
  const results = getResultSeedData(tenantId);
  const attendance = getAttendanceSeedData(tenantId);
  const courses = getCourseSeedData(tenantId);
  const timetable = getTimetableSeedData(tenantId);
  const teachers = getTeacherSeedData(tenantId);
  const academics = getAcademicSeedData(tenantId);
  const notices = getNoticeSeedData(tenantId);
  const calendarEvents = getCalendarSeedData(tenantId);
  const admins = getAdminSeedData(tenantId);

  return {
    students,
    "students/progress": results,
    "students/attendance": attendance,
    "students/alerts": notices.filter((item) => item.noticeType === "alert"),
    "students/support-contacts": academics.filter((item) => item.category === "support-contact"),
    "students/leave-requests": academics.filter((item) => item.category === "leave-request"),
    "teacher/subjects": courses,
    "teacher/classes": timetable,
    "teacher/advisories": notices.filter((item) => item.noticeType === "advisory"),
    "teacher/teacher-assignments": teachers.filter((item) => item.assignmentOnly),
    "teacher/students": students,
    "teacher/progress": results,
    "teacher/attendance": attendance,
    "teacher/leave-requests": academics.filter((item) => item.category === "leave-request"),
    "teacher/alerts": notices.filter((item) => item.noticeType === "alert"),
    "academic/teachers": teachers.filter((item) => !item.assignmentOnly),
    "academic/students": students,
    "academic/curriculum-plans": academics.filter((item) => item.category === "curriculum-plan"),
    "academic/timetables": timetable,
    "academic/teacher-assignments": teachers.filter((item) => item.assignmentOnly),
    "academic/approvals": academics.filter((item) => item.category === "approval"),
    "academic/records": academics.filter((item) => item.category === "record"),
    "academic/leave-requests": academics.filter((item) => item.category === "leave-request"),
    "academic/attendance": attendance,
    "academic/alerts": notices.filter((item) => item.noticeType === "alert"),
    "calendar/events": calendarEvents,
    "admins": admins,
    ...getDashboardLegacyCollections(tenantId),
  };
}

function getTenantStore(tenantId) {
  if (!tenantStores.has(tenantId)) {
    tenantStores.set(tenantId, createLegacyCollections(tenantId));
  }

  return tenantStores.get(tenantId);
}

export function getLegacyCollectionData(tenantId, collectionPath, query = {}) {
  const key = String(collectionPath || "").replace(/^\/+|\/+$/g, "");
  const dbHandler = dbBackedCollectionHandlers[key];

  if (dbHandler?.list) {
    return dbHandler.list(tenantId, query).then((items) => {
      const nextItems = clone(items || []);

      if (query.username) {
        return nextItems.filter((item) => !item.username || item.username === query.username);
      }

      return nextItems;
    });
  }

  const store = getTenantStore(tenantId);
  const items = clone(store[key] || []);

  if (query.username) {
    return items.filter((item) => !item.username || item.username === query.username);
  }

  return items;
}

export function createLegacyCollectionItem(tenantId, collectionPath, payload = {}) {
  const key = String(collectionPath || "").replace(/^\/+|\/+$/g, "");
  const dbHandler = dbBackedCollectionHandlers[key];

  if (dbHandler?.create) {
    return dbHandler.create(tenantId, payload).then((item) => clone(item));
  }

  const store = getTenantStore(tenantId);
  if (!store[key]) {
    store[key] = [];
  }

  const nextItem = {
    _id: payload._id || createId(key.replace(/[^\w]+/g, "-")),
    tenantId,
    ...payload,
  };

  store[key].unshift(nextItem);
  return clone(nextItem);
}

export function updateLegacyCollectionItem(tenantId, collectionPath, id, payload = {}) {
  const key = String(collectionPath || "").replace(/^\/+|\/+$/g, "");
  const dbHandler = dbBackedCollectionHandlers[key];

  if (dbHandler?.update) {
    return dbHandler.update(tenantId, id, payload).then((item) => (item ? clone(item) : null));
  }

  const store = getTenantStore(tenantId);
  const items = store[key] || [];
  const index = items.findIndex((item) => item._id === id);

  if (index === -1) {
    return null;
  }

  items[index] = {
    ...items[index],
    ...payload,
    _id: items[index]._id,
  };

  return clone(items[index]);
}

export function deleteLegacyCollectionItem(tenantId, collectionPath, id) {
  const key = String(collectionPath || "").replace(/^\/+|\/+$/g, "");
  const dbHandler = dbBackedCollectionHandlers[key];

  if (dbHandler?.remove) {
    return dbHandler.remove(tenantId, id);
  }

  const store = getTenantStore(tenantId);
  const items = store[key] || [];
  const index = items.findIndex((item) => item._id === id);

  if (index === -1) {
    return false;
  }

  items.splice(index, 1);
  return true;
}
