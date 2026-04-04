import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const teacherAlertSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    alertType: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    teacherName: { type: String, required: true },
    targetAudience: { type: String, default: "All Students" },
    audienceType: { type: String, default: "all-students" },
    audienceValue: { type: String, default: "" },
    teacherEmail: { type: String, default: "" },
    recipientEmails: { type: [String], default: [] },
    recipientCount: { type: Number, default: 0 },
    deliveryStatus: { type: String, default: "sent" },
    sentAt: { type: String, default: () => new Date().toISOString() },
    lastError: { type: String, default: "" },
  },
  { timestamps: true },
);

export default getUserPanelModel("TeacherAlert", teacherAlertSchema);
