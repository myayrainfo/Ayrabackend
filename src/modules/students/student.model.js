import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    username: { type: String, trim: true },
    studentId: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    displayName: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    department: { type: String, trim: true },
    semester: { type: Number },
    section: { type: String, trim: true },
    sgpa: { type: Number },
    cgpa: { type: Number },
    status: { type: String, trim: true },
    photoDataUrl: { type: String, default: "" },
    rollNo: { type: String, trim: true },
    year: { type: String, trim: true },
    feeStatus: { type: String, trim: true },
    avatar: { type: String, default: "" },
    programName: { type: String, trim: true },
  },
  { timestamps: true, collection: "students", strict: false },
);

export default mongoose.models.Student || mongoose.model("Student", studentSchema);
