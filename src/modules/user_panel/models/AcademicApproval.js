import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const academicApprovalSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    itemType: { type: String, required: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accept"],
      default: "pending",
    },
    requestedBy: { type: String, required: true },
    approvedBy: { type: String, default: "" },
  },
  { timestamps: true },
);

export default getUserPanelModel("AcademicApproval", academicApprovalSchema);
