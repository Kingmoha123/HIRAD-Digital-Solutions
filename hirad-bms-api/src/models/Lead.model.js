import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  email: { type: String, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  service: { type: String },
  source: {
    type: String,
    enum: ['Website', 'Referral', 'LinkedIn', 'Instagram', 'Conference', 'Cold Outreach', 'Other'],
    default: 'Website',
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'proposal', 'negotiation', 'won', 'lost'],
    default: 'new',
  },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  estimatedValue: { type: Number, default: 0 },
  notes: { type: String },
  nextFollowUp: { type: Date },
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);
