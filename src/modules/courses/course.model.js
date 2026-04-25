import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    code: { type: String, trim: true },
    name: { type: String, trim: true },
    kind: { type: String, trim: true },
    department: { type: String, trim: true },
    semester: { type: Number },
    credits: { type: Number },
    facultyName: { type: String, trim: true },
    attendancePercentage: { type: Number },
  },
  { timestamps: true, collection: "courses" },
);

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
