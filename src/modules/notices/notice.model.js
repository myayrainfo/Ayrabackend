import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    noticeType: { type: String, trim: true },
    username: { type: String, trim: true },
    title: { type: String, trim: true },
    content: { type: String, trim: true },
    audience: { type: String, trim: true },
    channel: { type: String, trim: true },
    status: { type: String, trim: true },
    publishedAt: { type: String, trim: true },
    authorName: { type: String, trim: true },
  },
  { timestamps: true, collection: "notices" },
);

export default mongoose.models.Notice || mongoose.model("Notice", noticeSchema);
