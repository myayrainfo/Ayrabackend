import mongoose from "mongoose";

const financeSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    recordType: { type: String, trim: true },
    title: { type: String, trim: true },
    studentId: { type: String, trim: true },
    studentName: { type: String, trim: true },
    amount: { type: Number, default: 0 },
    status: { type: String, trim: true },
    dueDate: { type: String, trim: true },
    paidAt: { type: String, trim: true },
    remarks: { type: String, trim: true },
    description: { type: String, trim: true },
    details: { type: String, trim: true },
    category: { type: String, trim: true },
    type: { type: String, trim: true },
    entityCount: { type: Number, default: 0 },
    reference: { type: String, trim: true },
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    feeType: { type: String, trim: true },
    paymentDate: { type: String, trim: true },
    paymentMode: { type: String, trim: true },
    transactionId: { type: String, trim: true },
    receiptNo: { type: String, trim: true },
    semester: { type: Number },
  },
  { timestamps: true, collection: "fees", strict: false },
);

export default mongoose.models.Finance || mongoose.model("Finance", financeSchema);
