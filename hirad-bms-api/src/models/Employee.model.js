import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  position: { type: String, required: true, trim: true },
  department: {
    type: String,
    enum: ['Management', 'Development', 'Design', 'Marketing', 'Finance', 'Operations'],
    default: 'Development',
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'project_manager', 'developer', 'designer', 'accountant', 'employee'],
    default: 'employee',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  skills: [{ type: String, trim: true }],
  avatar: { type: String },
  joinDate: { type: Date, default: Date.now },
  performanceRating: { type: Number, min: 1, max: 5, default: 5 },
  notes: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
