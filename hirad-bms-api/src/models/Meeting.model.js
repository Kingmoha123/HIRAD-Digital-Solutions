import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['client', 'internal', 'other'], default: 'internal' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  clientName: { type: String },
  date: { type: Date, required: true },
  time: { type: String },
  duration: { type: Number, default: 60 },   // minutes
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  location: { type: String },
  link: { type: String },
  agenda: { type: String },
  notes: { type: String },
  actionItems: [{ text: String, assignee: String, dueDate: Date, done: Boolean }],
  status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Meeting', meetingSchema);
