import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const academicRecordSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    recordType: { type: String, required: true },
    referenceNo: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    owner: { type: String, required: true },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export default getUserPanelModel("AcademicRecord", academicRecordSchema);




