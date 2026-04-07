export {
  getTeachers as getMasterTeachers,
  getTeacher as getMasterTeacher,
  createTeacher as createMasterTeacher,
  updateTeacher as updateMasterTeacher,
  deleteTeacher as deleteMasterTeacher,
  getTeacherStats as getMasterTeacherStats,
} from "./master/teacher.controller.js";

export * from "./user/teacher.controller.js";


