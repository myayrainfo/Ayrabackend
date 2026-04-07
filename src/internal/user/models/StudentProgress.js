import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const studentProgressSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    studentId: { type: String, required: true },
    semester: { type: Number, required: true },
    subjectCode: { type: String, required: true },
    attendance: { type: Number, required: true },
    marks: { type: Number, required: true },
    remarks: { type: String, default: "" },
    advisorFlag: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default getUserPanelModel("StudentProgress", studentProgressSchema);




