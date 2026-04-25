import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    role: { type: String, required: true, uppercase: true },
    phone: { type: String, trim: true },
    department: { type: String, trim: true },
    portal: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: "admins",
  },
);

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
