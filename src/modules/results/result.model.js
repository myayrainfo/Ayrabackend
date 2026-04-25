import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    studentId: { type: String, trim: true },
    semester: { type: Number },
    subjectCode: { type: String, trim: true },
    subjectName: { type: String, trim: true },
    attendance: { type: Number },
    marks: { type: Number },
    grade: { type: String, trim: true },
    projectTitle: { type: String, trim: true },
    projectType: { type: String, trim: true },
    projectScore: { type: Number },
    remarks: { type: String, trim: true },
  },
  { timestamps: true, collection: "results" },
);

export default mongoose.models.Result || mongoose.model("Result", resultSchema);
