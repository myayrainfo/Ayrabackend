import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const curriculumPlanSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    program: { type: String, required: true },
    semester: { type: Number, required: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accept"],
      default: "pending",
    },
    revision: { type: String, required: true },
    owner: { type: String, default: "Academic Office" },
  },
  { timestamps: true },
);

export default getUserPanelModel("CurriculumPlan", curriculumPlanSchema);
