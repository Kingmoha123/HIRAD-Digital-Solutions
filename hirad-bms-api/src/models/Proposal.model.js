import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  number: { type: String, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  clientName: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  services: [{ type: String }],
  description: { type: String },
  price: { type: Number, required: true },
  validUntil: { type: Date },
  status: {
    type: String,
    enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
    default: 'draft',
  },
  notes: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

proposalSchema.statics.generateNumber = async function () {
  const year = new Date().getFullYear();
  const count = await this.countDocuments();
  return `PROP-${year}-${String(count + 1).padStart(3, '0')}`;
};

export default mongoose.model('Proposal', proposalSchema);
