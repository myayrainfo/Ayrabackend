import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    courseCode: { type: String, trim: true },
    courseName: { type: String, trim: true },
    date: { type: String, trim: true },
    startTime: { type: String, trim: true },
    endTime: { type: String, trim: true },
    venue: { type: String, trim: true },
    examType: { type: String, trim: true },
    department: { type: String, trim: true },
    semester: { type: Number },
  },
  { timestamps: true, collection: "exams" },
);

export default mongoose.models.Exam || mongoose.model("Exam", examSchema);
