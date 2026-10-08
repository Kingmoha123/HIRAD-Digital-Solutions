import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['project_files', 'contracts', 'proposals', 'invoices', 'company', 'client', 'other'],
    default: 'other',
  },
  type: { type: String },       // file extension: pdf, docx, etc.
  size: { type: String },       // human-readable: "2.4 MB"
  sizeBytes: { type: Number },
  url: { type: String, required: true },  // storage path / URL
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedByName: { type: String },
  tags: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);
