import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  recipientRole: {
    type: String,
    enum: ['all', 'super_admin', 'admin', 'project_manager', 'developer', 'designer', 'accountant', 'employee'],
    default: 'all',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['task', 'invoice', 'payment', 'project', 'meeting', 'proposal', 'contract', 'system'],
    default: 'system',
  },
  link: {
    type: String,
    trim: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
}, { timestamps: true });

notificationSchema.index({ createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
