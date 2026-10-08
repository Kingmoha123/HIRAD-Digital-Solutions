import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['office', 'internet', 'software', 'transportation', 'marketing', 'equipment', 'salaries', 'other'],
    default: 'other',
  },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  method: {
    type: String,
    enum: ['bank_transfer', 'card', 'cash', 'other'],
    default: 'card',
  },
  description: { type: String },
  receipt: { type: String },  // URL to uploaded receipt
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  addedByName: { type: String },
  approved: { type: Boolean, default: false },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
