import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const supportContactSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    department: { type: String, required: true },
    semester: { type: Number, required: true },
    section: { type: String, required: true },
    classCoordinatorName: { type: String, required: true },
    classCoordinatorEmail: { type: String, required: true },
    classCoordinatorPhone: { type: String, default: "" },
    mentorName: { type: String, required: true },
    mentorEmail: { type: String, required: true },
    mentorPhone: { type: String, default: "" },
    mentorRoom: { type: String, default: "" },
  },
  { timestamps: true },
);

export default getUserPanelModel("SupportContact", supportContactSchema);
