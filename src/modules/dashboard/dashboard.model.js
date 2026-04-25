import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    snapshotType: { type: String, trim: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

export default mongoose.models.DashboardSnapshot || mongoose.model("DashboardSnapshot", dashboardSchema);
