import mongoose from 'mongoose';

const timeEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  projectName: { type: String },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  taskName: { type: String },
  description: { type: String, trim: true },
  hours: { type: Number, required: true, min: 0.1 },
  date: { type: Date, default: Date.now },
  billable: { type: Boolean, default: true },
  hourlyRate: { type: Number, default: 0 },
}, { timestamps: true });

// Virtual: billable amount
timeEntrySchema.virtual('billableAmount').get(function () {
  return this.billable ? this.hours * this.hourlyRate : 0;
});

export default mongoose.model('TimeEntry', timeEntrySchema);
