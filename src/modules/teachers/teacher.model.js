import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    username: { type: String, trim: true },
    employeeId: { type: String, trim: true },
    fullName: { type: String, trim: true },
    displayName: { type: String, trim: true },
    department: { type: String, trim: true },
    designation: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    status: { type: String, trim: true },
    teacherName: { type: String, trim: true },
    subjectCode: { type: String, trim: true },
    subjectName: { type: String, trim: true },
    semester: { type: Number },
    section: { type: String, trim: true },
    assignmentOnly: { type: Boolean, default: false },
    subjects: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    accountStatus: { type: String, trim: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true, collection: "teachers", strict: false },
);

export default mongoose.models.Teacher || mongoose.model("Teacher", teacherSchema);
