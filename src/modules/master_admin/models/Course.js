import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Course code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
    },
    department: { type: String, required: true },
    credits: { type: Number, required: true, min: 1, max: 6 },
    semester: {
      type: String,
      enum: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'],
      required: true,
    },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null },
    enrolledStudents: { type: Number, default: 0 },
    capacity: { type: Number, default: 60 },
    description: { type: String },
    syllabus: { type: String },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Completed'],
      default: 'Active',
    },
    academicYear: { type: String }, // e.g. "2024-25"
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null },
  },
  { timestamps: true }
);

courseSchema.index({ department: 1, semester: 1 });
courseSchema.index({ name: 'text', code: 'text' });

const Course = mongoose.model('Course', courseSchema);
export default Course;
