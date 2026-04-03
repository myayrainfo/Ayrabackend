import mongoose from 'mongoose';

const examScheduleSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    examType: {
      type: String,
      enum: ['Mid-Semester', 'End-Semester', 'Internal', 'Practical', 'Viva'],
      required: true,
    },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    venue: { type: String, required: true },
    duration: { type: Number, comment: 'in minutes', default: 180 },
    maxMarks: { type: Number, default: 100 },
    passingMarks: { type: Number, default: 40 },
    invigilators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
    status: {
      type: String,
      enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled', 'Postponed'],
      default: 'Scheduled',
    },
    instructions: { type: String },
    academicYear: { type: String },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null },
  },
  { timestamps: true }
);

examScheduleSchema.index({ date: 1, status: 1 });
examScheduleSchema.index({ course: 1 });

const ExamSchedule = mongoose.model('ExamSchedule', examScheduleSchema);
export default ExamSchedule;
