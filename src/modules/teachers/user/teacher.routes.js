import { Router } from "express";

import {
  createAdvisory,
  createTeacherAlert,
  createTeacherAttendance,
  createClass,
  createProgress,
  createSubject,
  createTeacherStudent,
  deleteAdvisory,
  deleteTeacherAlert,
  deleteTeacherAttendance,
  deleteClass,
  deleteProgress,
  deleteSubject,
  deleteTeacherStudent,
  listAdvisories,
  listTeacherAlerts,
  listTeacherAssignments,
  listTeacherAttendance,
  listClasses,
  listProgress,
  listTeacherLeaveRequests,
  listSubjects,
  listTeacherStudents,
  updateAdvisory,
  updateTeacherAttendance,
  updateClass,
  updateTeacherLeaveRequest,
  updateProgress,
  updateSubject,
  updateTeacherStudent,
} from "./teacher.controller.js";

const router = Router({ mergeParams: true });

router.get("/teacher-assignments", listTeacherAssignments);

router.get("/students", listTeacherStudents);
router.post("/students", createTeacherStudent);
router.put("/students/:id", updateTeacherStudent);
router.delete("/students/:id", deleteTeacherStudent);

router.get("/subjects", listSubjects);
router.post("/subjects", createSubject);
router.put("/subjects/:id", updateSubject);
router.delete("/subjects/:id", deleteSubject);

router.get("/classes", listClasses);
router.post("/classes", createClass);
router.put("/classes/:id", updateClass);
router.delete("/classes/:id", deleteClass);

router.get("/advisories", listAdvisories);
router.post("/advisories", createAdvisory);
router.put("/advisories/:id", updateAdvisory);
router.delete("/advisories/:id", deleteAdvisory);

router.get("/progress", listProgress);
router.post("/progress", createProgress);
router.put("/progress/:id", updateProgress);
router.delete("/progress/:id", deleteProgress);

router.get("/attendance", listTeacherAttendance);
router.post("/attendance", createTeacherAttendance);
router.put("/attendance/:id", updateTeacherAttendance);
router.delete("/attendance/:id", deleteTeacherAttendance);

router.get("/alerts", listTeacherAlerts);
router.post("/alerts", createTeacherAlert);
router.delete("/alerts/:id", deleteTeacherAlert);

router.get("/leave-requests", listTeacherLeaveRequests);
router.put("/leave-requests/:id", updateTeacherLeaveRequest);

export default router;


