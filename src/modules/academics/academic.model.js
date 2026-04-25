import mongoose from "mongoose";

const academicSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    category: { type: String, trim: true },
    title: { type: String, trim: true },
    status: { type: String, trim: true },
    owner: { type: String, trim: true },
    department: { type: String, trim: true },
    semester: { type: Number },
    notes: { type: String, trim: true },
    itemType: { type: String, trim: true },
    requestedBy: { type: String, trim: true },
    approvedBy: { type: String, trim: true },
    reason: { type: String, trim: true },
  },
  { timestamps: true, strict: false },
);

export default mongoose.models.Academic || mongoose.model("Academic", academicSchema);
