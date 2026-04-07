import { Router } from "express";

import {
  createApproval,
  createCurriculumPlan,
  createRecord,
  createTeacherAssignment,
  createTeacher,
  createTimetable,
  deleteApproval,
  deleteCurriculumPlan,
  deleteRecord,
  deleteTeacherAssignment,
  deleteTeacher,
  deleteTimetable,
  deleteAcademicStudent,
  listAcademicAttendance,
  listAcademicLeaveRequests,
  listAcademicStudents,
  listApprovals,
  listCurriculumPlans,
  listRecords,
  listTeacherAssignments,
  listTeachers,
  listTimetables,
  updateAcademicStudent,
  updateApproval,
  updateCurriculumPlan,
  updateRecord,
  updateTeacherAssignment,
  updateTeacher,
  updateTimetable,
} from "./academics.controller.js";

const router = Router({ mergeParams: true });

router.get("/curriculum-plans", listCurriculumPlans);
router.post("/curriculum-plans", createCurriculumPlan);
router.put("/curriculum-plans/:id", updateCurriculumPlan);
router.delete("/curriculum-plans/:id", deleteCurriculumPlan);

router.get("/timetables", listTimetables);
router.post("/timetables", createTimetable);
router.put("/timetables/:id", updateTimetable);
router.delete("/timetables/:id", deleteTimetable);

router.get("/approvals", listApprovals);
router.post("/approvals", createApproval);
router.put("/approvals/:id", updateApproval);
router.delete("/approvals/:id", deleteApproval);

router.get("/records", listRecords);
router.post("/records", createRecord);
router.put("/records/:id", updateRecord);
router.delete("/records/:id", deleteRecord);

router.get("/teachers", listTeachers);
router.post("/teachers", createTeacher);
router.put("/teachers/:id", updateTeacher);
router.delete("/teachers/:id", deleteTeacher);

router.get("/teacher-assignments", listTeacherAssignments);
router.post("/teacher-assignments", createTeacherAssignment);
router.put("/teacher-assignments/:id", updateTeacherAssignment);
router.delete("/teacher-assignments/:id", deleteTeacherAssignment);

router.get("/students", listAcademicStudents);
router.put("/students/:id", updateAcademicStudent);
router.delete("/students/:id", deleteAcademicStudent);

router.get("/leave-requests", listAcademicLeaveRequests);
router.get("/attendance", listAcademicAttendance);

export default router;


