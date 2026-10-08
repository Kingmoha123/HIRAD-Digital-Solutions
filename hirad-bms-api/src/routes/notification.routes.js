import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Notification from '../models/Notification.model.js';

const router = Router();

// GET notifications for current user
router.get('/', protect, async (req, res) => {
  const userId = req.user?._id;
  const userRole = req.user?.role || 'employee';

  const filter = {
    $or: [
      { recipient: userId },
      { recipientRole: userRole },
      { recipientRole: 'all' },
    ],
  };

  const notifications = await Notification.find(filter)
    .sort({ createdAt: -1 })
    .limit(30);

  res.json({
    success: true,
    data: notifications,
  });
});

// POST new notification
router.post('/', protect, async (req, res) => {
  const { title, message, type, link, recipient, recipientRole } = req.body;

  const notification = await Notification.create({
    title,
    message,
    type: type || 'system',
    link,
    recipient: recipient || undefined,
    recipientRole: recipientRole || 'all',
  });

  res.status(201).json({
    success: true,
    data: notification,
  });
});

// PUT mark as read
router.put('/:id/read', protect, async (req, res) => {
  const notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true, $addToSet: { readBy: req.user?._id } },
    { new: true }
  );

  res.json({
    success: true,
    data: notification,
  });
});

// PUT mark all as read
router.put('/mark-all-read', protect, async (req, res) => {
  const userId = req.user?._id;
  const userRole = req.user?.role || 'employee';

  await Notification.updateMany(
    {
      $or: [
        { recipient: userId },
        { recipientRole: userRole },
        { recipientRole: 'all' },
      ],
    },
    { isRead: true, $addToSet: { readBy: userId } }
  );

  res.json({
    success: true,
    message: 'All notifications marked as read',
  });
});

export default router;
