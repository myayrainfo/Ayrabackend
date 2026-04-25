import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    subjectCode: { type: String, trim: true },
    subjectName: { type: String, trim: true },
    className: { type: String, trim: true },
    kind: { type: String, trim: true },
    department: { type: String, trim: true },
    semester: { type: Number },
    section: { type: String, trim: true },
    day: { type: String, trim: true },
    startTime: { type: String, trim: true },
    endTime: { type: String, trim: true },
    facultyName: { type: String, trim: true },
    room: { type: String, trim: true },
  },
  { timestamps: true, collection: "timetable" },
);

export default mongoose.models.Timetable || mongoose.model("Timetable", timetableSchema);
