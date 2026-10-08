import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true },
  website: { type: String, trim: true },
  industry: { type: String, trim: true },
  status: {
    type: String,
    enum: ['active', 'inactive', 'prospect', 'lead'],
    default: 'active',
  },
  totalRevenue: { type: Number, default: 0 },
  activeProjects: { type: Number, default: 0 },
  notes: { type: String },
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

clientSchema.index({ company: 'text', name: 'text', email: 'text' });

export default mongoose.model('Client', clientSchema);
