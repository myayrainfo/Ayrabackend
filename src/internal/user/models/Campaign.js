import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const campaignSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    audience: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accept"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default getUserPanelModel("Campaign", campaignSchema);




