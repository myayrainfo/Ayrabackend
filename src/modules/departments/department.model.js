import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, trim: true },
    code: { type: String, trim: true },
    hodName: { type: String, trim: true },
    description: { type: String, trim: true },
    status: { type: String, trim: true },
  },
  { timestamps: true, collection: "departments" },
);

export default mongoose.models.Department || mongoose.model("Department", departmentSchema);
