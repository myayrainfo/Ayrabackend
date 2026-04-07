import { Schema } from "mongoose";

import getUserPanelModel from "../config/connection.js";

const announcementSchema = new Schema(
  {
    tenantSlug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    audience: { type: String, required: true },
    channel: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accept"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default getUserPanelModel("UserPanelAnnouncement", announcementSchema, "user_panel_announcements");







