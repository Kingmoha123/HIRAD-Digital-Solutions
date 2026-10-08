import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import Client from '../models/Client.model.js';
import Project from '../models/Project.model.js';
import Task from '../models/Task.model.js';
import User from '../models/User.model.js';
import Invoice from '../models/Invoice.model.js';
import Document from '../models/Document.model.js';

const router = Router();

// Global Search endpoint
router.get('/', protect, async (req, res) => {
  const query = (req.query.q || '').trim();
  if (!query || query.length < 2) {
    return res.json({
      success: true,
      data: {
        clients: [],
        projects: [],
        tasks: [],
        employees: [],
        invoices: [],
        documents: [],
      },
    });
  }

  const regex = new RegExp(query, 'i');
  const role = req.user?.role || 'employee';
  const canSeeFinance = ['super_admin', 'admin', 'accountant'].includes(role);

  try {
    const [clients, projects, tasks, employees, invoices, documents] = await Promise.all([
      // Clients
      Client.find({
        $or: [{ name: regex }, { company: regex }, { email: regex }],
      })
        .select('name company email status activeProjects totalRevenue')
        .limit(6),

      // Projects
      Project.find({
        $or: [{ name: regex }, { clientName: regex }, { service: regex }, { description: regex }],
      })
        .select('name clientName service status progress deadline priority')
        .limit(6),

      // Tasks
      Task.find({
        $or: [{ name: regex }, { projectName: regex }, { description: regex }],
      })
        .select('name projectName assigneeName priority status dueDate')
        .limit(6),

      // Employees
      User.find({
        $or: [{ name: regex }, { email: regex }, { position: regex }, { department: regex }],
      })
        .select('name email position department role status')
        .limit(6),

      // Invoices (only for authorized roles)
      canSeeFinance
        ? Invoice.find({
            $or: [{ number: regex }, { clientName: regex }, { projectName: regex }],
          })
            .select('number clientName total status dueDate issueDate')
            .limit(6)
        : Promise.resolve([]),

      // Documents
      Document.find({
        $or: [{ name: regex }, { category: regex }, { type: regex }],
      })
        .select('name category type size url createdAt')
        .limit(6),
    ]);

    res.json({
      success: true,
      data: {
        clients,
        projects,
        tasks,
        employees,
        invoices,
        documents,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || 'Global search failed',
    });
  }
});

export default router;
