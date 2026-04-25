import mongoose from "mongoose";

const authAccountSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    role: { type: String, required: true, uppercase: true },
    name: { type: String, trim: true },
    displayName: { type: String, trim: true },
    passwordHash: { type: String, trim: true },
    allowedPortals: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    profile: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

authAccountSchema.index({ tenantId: 1, username: 1 }, { unique: true });

export default mongoose.models.AuthAccount || mongoose.model("AuthAccount", authAccountSchema);
