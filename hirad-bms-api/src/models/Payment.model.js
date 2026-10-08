import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  clientName: { type: String },
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  invoiceNumber: { type: String },
  amount: { type: Number, required: true },
  method: {
    type: String,
    enum: ['bank_transfer', 'card', 'cash', 'mobile_money', 'crypto', 'other'],
    default: 'bank_transfer',
  },
  currency: { type: String, default: 'USD' },
  date: { type: Date, default: Date.now },
  reference: { type: String },
  notes: { type: String },
  recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

paymentSchema.pre('save', async function (next) {
  if (!this.paymentId) {
    const count = await mongoose.model('Payment').countDocuments();
    this.paymentId = `PAY-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

export default mongoose.model('Payment', paymentSchema);
