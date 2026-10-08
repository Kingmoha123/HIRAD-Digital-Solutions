// Generic route builder using the CRUD factory with role-based authorization
import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { buildCRUD } from '../utils/crudFactory.js';

// ─── Models ────────────────────────────────────────────────────────────────
import Client from '../models/Client.model.js';
import Lead from '../models/Lead.model.js';
import Project from '../models/Project.model.js';
import Task from '../models/Task.model.js';
import Meeting from '../models/Meeting.model.js';
import Invoice from '../models/Invoice.model.js';
import Payment from '../models/Payment.model.js';
import Expense from '../models/Expense.model.js';
import Proposal from '../models/Proposal.model.js';
import Contract from '../models/Contract.model.js';
import Service from '../models/Service.model.js';
import Document from '../models/Document.model.js';
import TimeEntry from '../models/TimeEntry.model.js';
import User from '../models/User.model.js';

// Helper to build standard CRUD router with RBAC options
const crudRouter = (Model, options = {}) => {
  const router = Router();
  const { getAll, getOne, create, update, remove } = buildCRUD(Model, options);

  const readRoles = options.readRoles ? ['super_admin', ...options.readRoles] : null;
  const writeRoles = options.writeRoles ? ['super_admin', ...options.writeRoles] : null;

  const readAuth = readRoles ? [protect, authorize(...readRoles)] : [protect];
  const writeAuth = writeRoles ? [protect, authorize(...writeRoles)] : [protect];

  router.route('/')
    .get(...readAuth, getAll)
    .post(...writeAuth, create);

  router.route('/:id')
    .get(...readAuth, getOne)
    .put(...writeAuth, update)
    .delete(protect, authorize('super_admin', 'admin'), remove);

  return router;
};

// ─── CRM ───────────────────────────────────────────────────────────────────
export const clientRouter = crudRouter(Client, {
  searchFields: ['name', 'company', 'email'],
  populate: 'createdBy',
  readRoles: ['admin', 'project_manager', 'accountant', 'developer', 'designer', 'employee'],
  writeRoles: ['admin', 'project_manager'],
});

export const leadRouter = crudRouter(Lead, {
  searchFields: ['name', 'company', 'email'],
  populate: 'assignee',
  readRoles: ['admin', 'project_manager'],
  writeRoles: ['admin', 'project_manager'],
});

// ─── Projects & Tasks ─────────────────────────────────────────────────────
export const projectRouter = crudRouter(Project, {
  searchFields: ['name', 'description', 'clientName', 'service'],
  populate: [
    { path: 'client', select: 'company name' },
    { path: 'manager', select: 'name email role position' },
    { path: 'team', select: 'name email role position' },
  ],
  readRoles: ['admin', 'project_manager', 'developer', 'designer', 'employee'],
  writeRoles: ['admin', 'project_manager'],
  scopeFilter: (req) => {
    const role = req.user?.role;
    const userId = req.user?._id;
    const userName = req.user?.name;
    const isMine = req.query?.mine === 'true' || req.query?.mine === '1';

    // Super admin & admin: see all projects unless specifically filtering by mine
    if (role === 'super_admin' || role === 'admin') {
      if (isMine && userId) {
        return {
          $or: [
            { manager: userId },
            { team: userId },
            ...(userName ? [{ managerName: userName }] : []),
          ],
        };
      }
      return null;
    }

    // Project manager: sees all projects across the company, or assigned if mine=true
    if (role === 'project_manager') {
      if (isMine && userId) {
        return {
          $or: [
            { manager: userId },
            { team: userId },
            ...(userName ? [{ managerName: userName }] : []),
          ],
        };
      }
      return null;
    }

    // When requested via ?mine=true (My Projects)
    if (isMine && userId) {
      return {
        $or: [
          { team: userId },
          { manager: userId },
          ...(userName ? [{ managerName: userName }] : []),
        ],
      };
    }

    // Developer role:
    // Only sees development projects (Web, Mobile, System, Software, Portal, Engineering)
    // PLUS any project where they are directly assigned
    if (role === 'developer') {
      const devRegex = /dev|web|system|software|code|mobile|portal|app|api|backend|frontend|fullstack|engineering/i;
      return {
        $or: [
          { service: devRegex },
          { name: devRegex },
          ...(userId ? [{ team: userId }, { manager: userId }] : []),
          ...(userName ? [{ managerName: userName }] : []),
        ],
      };
    }

    // Designer role:
    // Only sees design projects (UI/UX, Branding, Graphic, Logo, Creative, Brand Refresh)
    // PLUS any project where they are directly assigned
    if (role === 'designer') {
      const designRegex = /design|ui|ux|brand|graphic|logo|creative|refresh|art|figma/i;
      return {
        $or: [
          { service: designRegex },
          { name: designRegex },
          ...(userId ? [{ team: userId }, { manager: userId }] : []),
          ...(userName ? [{ managerName: userName }] : []),
        ],
      };
    }

    // Generic employee: only projects assigned to them
    if (userId) {
      return {
        $or: [
          { team: userId },
          { manager: userId },
          ...(userName ? [{ managerName: userName }] : []),
        ],
      };
    }

    return null;
  },
});

export const taskRouter = crudRouter(Task, {
  searchFields: ['name', 'description'],
  populate: [{ path: 'assignee', select: 'name' }, { path: 'project', select: 'name' }],
  readRoles: ['admin', 'project_manager', 'developer', 'designer', 'employee'],
  writeRoles: ['admin', 'project_manager', 'developer', 'designer', 'employee'],
  scopeFilter: (req) => {
    const isMine = req.query?.mine === 'true' || req.query?.mine === '1';
    if (isMine && req.user?._id) {
      return {
        $or: [
          { assignee: req.user._id },
          ...(req.user?.name ? [{ assigneeName: req.user.name }] : []),
        ],
      };
    }
    return null;
  },
});

// ─── Meetings & Calendar ───────────────────────────────────────────────────
export const meetingRouter = crudRouter(Meeting, {
  searchFields: ['title'],
  defaultSort: 'date',
  populate: [{ path: 'client', select: 'company name' }],
  readRoles: ['admin', 'project_manager', 'developer', 'designer', 'employee'],
  writeRoles: ['admin', 'project_manager', 'developer', 'designer', 'employee'],
});

// ─── Finance (Strictly Restricted) ─────────────────────────────────────────
export const invoiceRouter = crudRouter(Invoice, {
  searchFields: ['number', 'clientName'],
  populate: 'client',
  readRoles: ['admin', 'accountant'],
  writeRoles: ['admin', 'accountant'],
});

export const paymentRouter = crudRouter(Payment, {
  searchFields: ['paymentId', 'clientName', 'reference'],
  populate: 'client',
  readRoles: ['admin', 'accountant'],
  writeRoles: ['admin', 'accountant'],
});

export const expenseRouter = crudRouter(Expense, {
  searchFields: ['title', 'description'],
  populate: 'addedBy',
  readRoles: ['admin', 'accountant'],
  writeRoles: ['admin', 'accountant'],
});

// ─── Business ──────────────────────────────────────────────────────────────
export const proposalRouter = crudRouter(Proposal, {
  searchFields: ['number', 'clientName'],
  populate: 'client',
  readRoles: ['admin', 'project_manager'],
  writeRoles: ['admin', 'project_manager'],
});

export const contractRouter = crudRouter(Contract, {
  searchFields: ['number', 'clientName'],
  populate: 'client',
  readRoles: ['admin', 'project_manager'],
  writeRoles: ['admin', 'project_manager'],
});

export const serviceRouter = crudRouter(Service, {
  searchFields: ['name', 'description'],
  readRoles: ['admin', 'project_manager', 'developer', 'designer'],
  writeRoles: ['admin', 'project_manager'],
});

// ─── Documents & Time ──────────────────────────────────────────────────────
export const documentRouter = crudRouter(Document, {
  searchFields: ['name'],
  populate: [{ path: 'uploadedBy', select: 'name' }, { path: 'client', select: 'company' }],
  readRoles: ['admin', 'project_manager', 'developer', 'designer', 'employee', 'accountant'],
  writeRoles: ['admin', 'project_manager', 'developer', 'designer', 'employee', 'accountant'],
});

export const timeRouter = crudRouter(TimeEntry, {
  searchFields: ['description', 'projectName', 'taskName'],
  populate: [{ path: 'user', select: 'name' }, { path: 'project', select: 'name' }],
  readRoles: ['admin', 'project_manager', 'developer', 'designer', 'employee'],
  writeRoles: ['admin', 'project_manager', 'developer', 'designer', 'employee'],
});

// ─── Team & Users (Admin / PM restricted) ─────────────────────────────────
export const userRouter = crudRouter(User, {
  searchFields: ['name', 'email', 'position'],
  defaultSort: 'name',
  readRoles: ['admin', 'project_manager', 'developer', 'designer', 'employee', 'accountant'],
  writeRoles: ['admin'],
});

export const employeeRouter = crudRouter(User, {
  searchFields: ['name', 'email', 'position', 'department'],
  defaultSort: 'name',
  readRoles: ['admin', 'project_manager', 'developer', 'designer', 'employee', 'accountant'],
  writeRoles: ['admin'],
});
