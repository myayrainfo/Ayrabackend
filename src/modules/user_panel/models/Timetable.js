import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const timetableSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    section: { type: String, required: true },
    day: { type: String, required: true },
    slot: { type: String, required: true },
    subjectName: { type: String, required: true },
    facultyName: { type: String, required: true },
    room: { type: String, required: true },
  },
  { timestamps: true },
);

export default getUserPanelModel("Timetable", timetableSchema);
