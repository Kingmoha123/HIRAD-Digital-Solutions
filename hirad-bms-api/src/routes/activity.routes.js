import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import ActivityLog from '../models/ActivityLog.model.js';

const router = Router();

// GET all activities with pagination and filters (Admin & Project Manager)
router.get('/', protect, authorize('super_admin', 'admin', 'project_manager'), async (req, res) => {
  const { limit = 50, page = 1, action, user: filterUser } = req.query;
  const query = {};

  if (action && action !== 'all') {
    query.action = action;
  }
  if (filterUser) {
    query.$or = [
      { userName: { $regex: filterUser, $options: 'i' } },
      { relatedRecord: { $regex: filterUser, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await ActivityLog.countDocuments(query);
  const activities = await ActivityLog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: activities,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)) || 1,
    },
  });
});

// POST new activity entry
router.post('/', protect, async (req, res) => {
  const { action, title, details, relatedRecord, entityType, entityId } = req.body;

  const entry = await ActivityLog.create({
    user: req.user?._id,
    userName: req.user?.name || 'Authorized User',
    userRole: req.user?.role || 'staff',
    action: action || 'settings_changed',
    title: title || 'Operational Action',
    details: details || '',
    relatedRecord: relatedRecord || '',
    entityType: entityType || '',
    entityId: entityId || '',
    ipAddress: req.ip,
  });

  res.status(201).json({
    success: true,
    data: entry,
  });
});

export default router;
