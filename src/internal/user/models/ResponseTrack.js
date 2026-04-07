import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const responseTrackSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    sourceType: { type: String, required: true },
    title: { type: String, required: true },
    responseRate: { type: Number, required: true },
    escalations: { type: Number, default: 0 },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);

export default getUserPanelModel("ResponseTrack", responseTrackSchema);




