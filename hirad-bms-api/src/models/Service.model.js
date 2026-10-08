import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['Development', 'Design', 'Consulting', 'Infrastructure', 'Marketing'],
    default: 'Development',
  },
  startingPrice: { type: Number, default: 0 },
  deliveryTime: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  features: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
