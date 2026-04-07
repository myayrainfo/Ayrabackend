export {
  getStudents as getMasterStudents,
  getStudent as getMasterStudent,
  createStudent as createMasterStudent,
  updateStudent as updateMasterStudent,
  deleteStudent as deleteMasterStudent,
  getStudentStats as getMasterStudentStats,
} from "./master/student.controller.js";

export * from "./user/student.controller.js";


