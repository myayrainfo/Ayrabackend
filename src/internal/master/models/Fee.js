import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    receiptNo: {
      type: String,
      unique: true,
      trim: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },

    // ── Amounts ─────────────────────────────────────────────
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: {
      type: Number,
      default: function () {
        return this.totalAmount - this.paidAmount;
      },
    },

    feeType: {
      type: String,
      enum: ['Tuition Fee', 'Exam Fee', 'Library Fee', 'Hostel Fee', 'Transport Fee', 'Other'],
      default: 'Tuition Fee',
    },

    // ── Payment ─────────────────────────────────────────────
    paymentDate: { type: Date },
    paymentMode: {
      type: String,
      enum: ['Cash', 'Online', 'DD', 'Cheque', 'UPI'],
      default: 'Online',
    },
    transactionId: { type: String },

    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Partial', 'Overdue'],
      default: 'Pending',
    },

    academicYear: { type: String },
    semester: { type: Number },
    remarks: { type: String },

    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', default: null },
  },
  { timestamps: true }
);

// Auto-generate receipt number
feeSchema.pre('save', async function (next) {
  if (!this.receiptNo) {
    const count = await mongoose.model('Fee').countDocuments();
    this.receiptNo = `FEE${String(count + 1).padStart(5, '0')}`;
  }
  // Keep balance amount in sync
  this.balanceAmount = this.totalAmount - this.paidAmount;
  next();
});

feeSchema.index({ student: 1 });
feeSchema.index({ status: 1 });
feeSchema.index({ academicYear: 1 });

const Fee = mongoose.model('Fee', feeSchema);
export default Fee;




