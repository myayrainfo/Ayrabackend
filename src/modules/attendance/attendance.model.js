import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: String, trim: true },
    studentName: { type: String, trim: true },
    subjectCode: { type: String, trim: true },
    date: { type: String, trim: true },
    status: { type: String, trim: true },
    department: { type: String, trim: true },
    semester: { type: Number },
    section: { type: String, trim: true },
    monthLabel: { type: String, trim: true },
  },
  { timestamps: true, collection: "attendance" },
);

export default mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);
