import mongoose from 'mongoose';

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  qty: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  clientName: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  projectName: { type: String },
  items: [invoiceItemSchema],
  subtotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },       // percentage
  discount: { type: Number, default: 0 },  // percentage
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['draft', 'sent', 'partially_paid', 'paid', 'overdue', 'cancelled'],
    default: 'draft',
  },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  paidDate: { type: Date },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Auto-number: INV-YYYY-NNN
invoiceSchema.statics.generateNumber = async function () {
  const year = new Date().getFullYear();
  const count = await this.countDocuments();
  return `INV-${year}-${String(count + 1).padStart(3, '0')}`;
};

export default mongoose.model('Invoice', invoiceSchema);
