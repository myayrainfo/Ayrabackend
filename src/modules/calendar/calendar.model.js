import mongoose from "mongoose";

const calendarSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    year: { type: Number },
    eventDate: { type: String, trim: true },
    eventName: { type: String, trim: true },
    eventType: { type: String, trim: true },
    venue: { type: String, trim: true },
    coordinator: { type: String, trim: true },
    audience: { type: String, trim: true },
  },
  { timestamps: true },
);

export default mongoose.models.CalendarEvent || mongoose.model("CalendarEvent", calendarSchema);
