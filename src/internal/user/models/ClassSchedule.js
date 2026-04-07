import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const classScheduleSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    subjectCode: { type: String, required: true },
    className: { type: String, required: true },
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    room: { type: String, required: true },
    section: { type: String, required: true },
  },
  { timestamps: true },
);

export default getUserPanelModel("ClassSchedule", classScheduleSchema);




