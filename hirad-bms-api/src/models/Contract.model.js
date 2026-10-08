import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  number: { type: String, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  clientName: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  projectName: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  value: { type: Number, required: true },
  status: {
    type: String,
    enum: ['draft', 'active', 'expired', 'terminated', 'renewed'],
    default: 'draft',
  },
  documentUrl: { type: String },
  terms: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

contractSchema.statics.generateNumber = async function () {
  const year = new Date().getFullYear();
  const count = await this.countDocuments();
  return `CON-${year}-${String(count + 1).padStart(3, '0')}`;
};

// Virtual: days until expiry
contractSchema.virtual('daysUntilExpiry').get(function () {
  return Math.ceil((new Date(this.endDate) - new Date()) / 86400000);
});

export default mongoose.model('Contract', contractSchema);
