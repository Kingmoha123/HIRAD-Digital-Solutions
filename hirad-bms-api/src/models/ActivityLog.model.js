import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  userRole: {
    type: String,
    trim: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'client_created',
      'client_updated',
      'client_deleted',
      'project_created',
      'project_updated',
      'project_deleted',
      'task_created',
      'task_assigned',
      'task_completed',
      'task_deleted',
      'invoice_created',
      'invoice_paid',
      'payment_added',
      'employee_added',
      'employee_updated',
      'meeting_scheduled',
      'proposal_created',
      'contract_created',
      'document_uploaded',
      'settings_changed',
    ],
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    trim: true,
  },
  relatedRecord: {
    type: String,
    trim: true,
  },
  entityType: {
    type: String,
    trim: true,
  },
  entityId: {
    type: String,
    trim: true,
  },
  ipAddress: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ action: 1 });

export default mongoose.model('ActivityLog', activityLogSchema);
