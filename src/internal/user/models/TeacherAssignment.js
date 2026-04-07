import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const teacherAssignmentSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    teacherUsername: { type: String, required: true, index: true },
    teacherName: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    section: { type: String, required: true },
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
  },
  { timestamps: true },
);

export default getUserPanelModel("TeacherAssignment", teacherAssignmentSchema);




