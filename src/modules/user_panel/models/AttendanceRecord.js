import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const attendanceRecordSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    studentName: { type: String, required: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    section: { type: String, required: true },
    date: { type: String, required: true },
    monthLabel: { type: String, default: "" },
    status: { type: String, required: true },
    teacherUsername: { type: String, default: "" },
    teacherName: { type: String, default: "" },
    subjectCode: { type: String, default: "" },
    subjectName: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export default getUserPanelModel("AttendanceRecord", attendanceRecordSchema);
