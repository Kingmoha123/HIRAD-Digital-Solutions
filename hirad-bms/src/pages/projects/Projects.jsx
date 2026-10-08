import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Plus, Briefcase, Calendar, DollarSign, Users, Eye, Trash2, Code2, Palette,
  CheckSquare, FileText, Clock, AlertCircle, CheckCircle, ExternalLink, Paperclip,
  CheckCircle2, FolderOpen, Receipt, Layers, TrendingUp, Sparkles, Send
} from 'lucide-react';
import { Card, Badge, Button, SearchBar, Modal, Input, Select, Textarea, Avatar, ProgressBar, EmptyState, Spinner } from '../../components/ui';
import { projectsAPI, clientsAPI, employeesAPI, tasksAPI, invoicesAPI, documentsAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

export const PROJECT_STATUSES = {
  planning:    { label: 'Planning',    color: 'border-slate-400 text-slate-400' },
  active:      { label: 'Active',      color: 'border-blue-500 text-blue-500' },
  on_hold:     { label: 'On Hold',     color: 'border-amber-500 text-amber-500' },
  completed:   { label: 'Completed',   color: 'border-emerald-500 text-emerald-500' },
  cancelled:   { label: 'Cancelled',   color: 'border-red-500 text-red-500' },
};

const SERVICE_OPTIONS = [
  'Web Development',
  'System Development',
  'Mobile App Development',
  'UI/UX Design',
  'Branding & Identity',
  'IT Consulting',
];

export default function Projects() {
  const { user } = useAuth();
  const { confirm } = useConfirm();
  const location = useLocation();
  const isMine = location.pathname.includes('/mine');

  const { data: projData, loading, refetch } = useApi(
    () => projectsAPI.getAll(isMine ? { mine: true } : {}),
    [isMine]
  );
  const { data: clientsData } = useApi(() => clientsAPI.getAll());
  const { data: employeesData } = useApi(() => employeesAPI.getAll());

  const rawProjects = projData?.data || [];
  const clientsList = clientsData?.data || [];
  const employeesList = employeesData?.data || [];

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [view, setView] = useState('cards');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // New Project Form State
  const [form, setForm] = useState({
    name: '',
    client: '',
    service: 'Web Development',
    description: '',
    manager: '',
    team: [],
    status: 'planning',
    priority: 'medium',
    startDate: '',
    deadline: '',
    budget: '',
  });

  const canManageProjects = ['super_admin', 'admin', 'project_manager'].includes(user?.role);

  // Scoped project list ensuring strict client + server role separation
  const scopedProjects = useMemo(() => {
    return rawProjects.filter(p => {
      const pManagerId = p.manager?._id || p.manager;
      const pManagerName = p.manager?.name || p.managerName;
      const isAssigned =
        pManagerId === user?._id ||
        pManagerName === user?.name ||
        (Array.isArray(p.team) && p.team.some(m => (m._id || m) === user?._id));

      if (isMine) {
        return isAssigned;
      }

      if (['super_admin', 'admin', 'project_manager'].includes(user?.role)) {
        return true;
      }

      if (user?.role === 'developer') {
        const devRegex = /dev|web|system|software|code|mobile|portal|app|api|backend|frontend|fullstack|engineering/i;
        const matchesDev = devRegex.test(p.service || '') || devRegex.test(p.name || '');
        return matchesDev || isAssigned;
      }

      if (user?.role === 'designer') {
        const designRegex = /design|ui|ux|brand|graphic|logo|creative|refresh|art|figma/i;
        const matchesDesign = designRegex.test(p.service || '') || designRegex.test(p.name || '');
        return matchesDesign || isAssigned;
      }

      return isAssigned;
    });
  }, [rawProjects, isMine, user]);

  const filtered = useMemo(() => {
    return scopedProjects.filter(p => {
      const matchSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        p.service?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [scopedProjects, search, filterStatus]);

  const statusCount = (s) => scopedProjects.filter(p => p.status === s).length;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!canManageProjects) {
      alert('Only Project Managers and Administrators can create projects.');
      return;
    }
    setSubmitting(true);
    try {
      const selectedClient = clientsList.find(c => (c._id || c.id) === form.client);
      const selectedManager = employeesList.find(u => (u._id || u.id) === form.manager);
      await projectsAPI.create({
        ...form,
        clientName: selectedClient?.company || selectedClient?.name || 'Internal',
        managerName: selectedManager?.name || user?.name || '',
        budget: Number(form.budget) || 0,
        progress: 0,
        spent: 0,
      });
      await refetch();
      setModalOpen(false);
      setForm({
        name: '', client: '', service: 'Web Development', description: '', manager: '',
        team: [], status: 'planning', priority: 'medium', startDate: '', deadline: '', budget: ''
      });
    } catch (err) {
      alert(err.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!canManageProjects) {
      alert('Unauthorized: Only administrators and project managers can delete projects.');
      return;
    }
    const ok = await confirm({
      title: 'Delete Project',
      message: 'Are you sure you want to permanently delete this project? All associated tasks, milestones, and documents will be removed.',
      confirmText: 'Yes, Delete Project',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await projectsAPI.delete(id);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    }
  };

  const getServiceBadge = (service = '') => {
    const s = service.toLowerCase();
    if (/design|ui|ux|brand|creative/.test(s)) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
          <Palette className="w-3 h-3" /> {service || 'Design'}
        </span>
      );
    }
    if (/dev|web|system|mobile|portal|software/.test(s)) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Code2 className="w-3 h-3" /> {service || 'Development'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary border border-border">
        <Briefcase className="w-3 h-3" /> {service || 'General'}
      </span>
    );
  };

  const pageTitle = isMine ? 'My Projects' : (
    user?.role === 'developer' ? 'Development Projects' :
    user?.role === 'designer' ? 'Design Projects' :
    'Projects'
  );

  const pageSubtitle = isMine
    ? `${scopedProjects.length} project${scopedProjects.length !== 1 ? 's' : ''} directly assigned to you`
    : `${scopedProjects.length} project${scopedProjects.length !== 1 ? 's' : ''} · ${statusCount('active')} active · ${statusCount('completed')} completed`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="page-title">{pageTitle}</h1>
            {user?.role && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-electric/10 text-electric">
                {user.role} view
              </span>
            )}
          </div>
          <p className="page-subtitle">{pageSubtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex border border-border dark:border-navy-border rounded-lg overflow-hidden">
            {['cards', 'list'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  view === v
                    ? 'bg-electric text-white'
                    : 'text-text-secondary dark:text-slate-400 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* "+ New Project" strictly visible only to Project Managers and Admins */}
          {canManageProjects && (
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4" /> New Project
            </Button>
          )}
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filterStatus === 'all'
              ? 'bg-electric text-white shadow-sm'
              : 'bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary dark:text-slate-400 hover:bg-surface-secondary'
          }`}
        >
          All ({scopedProjects.length})
        </button>
        {Object.entries(PROJECT_STATUSES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filterStatus === key
                ? 'bg-electric text-white shadow-sm'
                : 'bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary dark:text-slate-400 hover:bg-surface-secondary'
            }`}
          >
            {val.label} ({statusCount(key)})
          </button>
        ))}
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder={isMine ? "Search my projects..." : "Search projects by name, client, or service..."}
        className="max-w-sm"
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={isMine ? "No projects assigned to you yet" : "No projects found"}
          description={
            isMine
              ? "When a project manager assigns you to a project, it will appear here."
              : "No projects match your current filters or department scope."
          }
        />
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(project => {
            const pid = project._id || project.id;
            return (
              <Card key={pid} hover className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="mb-1.5">{getServiceBadge(project.service)}</div>
                      <h3 className="font-bold text-sm text-text-primary dark:text-white truncate" title={project.name}>
                        {project.name}
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5">{project.clientName || 'Internal'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge status={project.status}>{PROJECT_STATUSES[project.status]?.label}</Badge>
                      <Badge status={project.priority} className="!text-[10px]">{project.priority}</Badge>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary dark:text-slate-400 mb-4 line-clamp-2">
                    {project.description || 'No description provided.'}
                  </p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-text-muted">Progress</span>
                      <span className="font-bold text-text-primary dark:text-white">{project.progress || 0}%</span>
                    </div>
                    <ProgressBar value={project.progress || 0} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due: {formatDate(project.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{formatCurrency(project.budget)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border dark:border-navy-border mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5" title={`Manager: ${project.managerName || 'Unassigned'}`}>
                      <Avatar name={project.managerName || 'PM'} size="xs" />
                      <span className="text-xs text-text-muted max-w-[100px] truncate">{project.managerName || 'Unassigned'}</span>
                    </div>
                    {/* Team avatars if present */}
                    {Array.isArray(project.team) && project.team.length > 0 && (
                      <div className="flex -space-x-1.5 overflow-hidden ml-2" title={`${project.team.length} assigned members`}>
                        {project.team.slice(0, 3).map((m, idx) => (
                          <div
                            key={m._id || m.id || idx}
                            className="w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center bg-surface-tertiary text-text-primary border border-surface dark:border-navy-surface"
                          >
                            {(m.name || 'U').charAt(0)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(project)}>
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                    {canManageProjects && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-500/10 px-2"
                        onClick={() => handleDelete(pid)}
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="bms-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Service</th>
                  <th>Client</th>
                  <th>Manager</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Deadline</th>
                  <th>Budget</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(project => {
                  const pid = project._id || project.id;
                  return (
                    <tr key={pid}>
                      <td className="font-semibold text-text-primary dark:text-white">{project.name}</td>
                      <td>{getServiceBadge(project.service)}</td>
                      <td className="text-xs">{project.clientName || 'Internal'}</td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <Avatar name={project.managerName || 'PM'} size="xs" />
                          <span className="text-xs">{project.managerName || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td><Badge status={project.status}>{PROJECT_STATUSES[project.status]?.label}</Badge></td>
                      <td className="w-28">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={project.progress || 0} className="flex-1" />
                          <span className="text-xs font-medium">{project.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="text-xs">{formatDate(project.deadline)}</td>
                      <td className="font-semibold text-emerald-600">{formatCurrency(project.budget)}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelected(project)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          {canManageProjects && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-500/10 px-2"
                              onClick={() => handleDelete(pid)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Project Workspace Modal (Requirement #11) */}
      {selected && (
        <ProjectWorkspaceModal
          project={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => { refetch(); }}
          canManage={canManageProjects}
          employeesList={employeesList}
          getServiceBadge={getServiceBadge}
        />
      )}

      {/* New Project Modal — Restricted to Project Managers & Admins */}
      {canManageProjects && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create New Project" size="lg">
          <form onSubmit={handleAdd} className="space-y-4">
            <Input
              label="Project Name *"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Somali E-Commerce Platform"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Client" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}>
                <option value="">— Internal Project —</option>
                {clientsList.map(c => (
                  <option key={c._id || c.id} value={c._id || c.id}>{c.company || c.name}</option>
                ))}
              </Select>
              <Select label="Service Category *" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                {SERVICE_OPTIONS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
            <Textarea
              label="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="Describe the project scope and deliverables..."
            />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Project Manager" value={form.manager} onChange={e => setForm({ ...form, manager: e.target.value })}>
                <option value="">Select manager (or leave for you)</option>
                {employeesList.map(u => (
                  <option key={u._id || u.id} value={u._id || u.id}>{u.name} ({u.role})</option>
                ))}
              </Select>
              <Select label="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>

            {/* Team Members Assignment */}
            <div>
              <label className="block text-xs font-medium text-text-secondary dark:text-slate-400 mb-1.5">
                Assign Team Members (Developers, Designers)
              </label>
              <div className="max-h-32 overflow-y-auto p-2 border border-border dark:border-navy-border rounded-lg space-y-1 bg-surface-secondary/50 dark:bg-dark-surface-secondary/50">
                {employeesList
                  .filter(u => ['developer', 'designer', 'employee'].includes(u.role))
                  .map(emp => {
                    const empId = emp._id || emp.id;
                    const isChecked = form.team.includes(empId);
                    return (
                      <label key={empId} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface-secondary cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setForm({ ...form, team: [...form.team, empId] });
                            } else {
                              setForm({ ...form, team: form.team.filter(id => id !== empId) });
                            }
                          }}
                          className="rounded text-electric focus:ring-electric"
                        />
                        <span className="font-medium text-text-primary dark:text-white">{emp.name}</span>
                        <span className="text-text-muted capitalize">({emp.role} · {emp.department})</span>
                      </label>
                    );
                  })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
              <Input label="Deadline" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Budget ($)" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
              <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {Object.entries(PROJECT_STATUSES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </Select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Project'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ─── DEDICATED PROJECT WORKSPACE MODAL (Requirement #11) ──────────────────────
function ProjectWorkspaceModal({ project, onClose, onUpdated, canManage, employeesList, getServiceBadge }) {
  const pid = project._id || project.id;
  const [activeTab, setActiveTab] = useState('overview');
  const [currentProject, setCurrentProject] = useState(project);

  // Live tasks for this project
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskForm, setTaskForm] = useState({ name: '', priority: 'medium', assignee: '', dueDate: '' });

  // Live documents for this project
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [docForm, setDocForm] = useState({ name: '', category: 'specification', fileUrl: '' });

  // Live invoices for this client
  const [invoices, setInvoices] = useState([]);

  // Milestones State
  const defaultMilestones = [
    { id: 1, title: 'Discovery & Requirement Analysis', completed: true, targetDate: currentProject.startDate },
    { id: 2, title: 'UI/UX Wireframes & Visual Architecture', completed: currentProject.progress >= 25, targetDate: 'Sprint 1' },
    { id: 3, title: 'Core Development & Database Integration', completed: currentProject.progress >= 60, targetDate: 'Sprint 2' },
    { id: 4, title: 'QA Testing, Security & Bug Remediation', completed: currentProject.progress >= 85, targetDate: 'Sprint 3' },
    { id: 5, title: 'Client UAT Handover & Production Release', completed: currentProject.progress === 100, targetDate: currentProject.deadline },
  ];
  const [milestones, setMilestones] = useState(defaultMilestones);

  // Load project tasks
  const loadTasks = async () => {
    setLoadingTasks(true);
    try {
      const res = await tasksAPI.getAll({ project: pid, limit: 100 });
      setTasks(res?.data || []);
    } catch (err) {
      console.error('Error loading project tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  // Load project documents
  const loadDocs = async () => {
    setLoadingDocs(true);
    try {
      const res = await documentsAPI.getAll({ project: pid, limit: 50 });
      setDocuments(res?.data || []);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  // Load client invoices
  const loadInvoices = async () => {
    try {
      const clientId = currentProject.client?._id || currentProject.client;
      if (clientId) {
        const res = await invoicesAPI.getAll({ client: clientId, limit: 20 });
        setInvoices(res?.data || []);
      }
    } catch (err) {
      console.error('Error loading invoices:', err);
    }
  };

  useEffect(() => {
    loadTasks();
    loadDocs();
    loadInvoices();
  }, [pid]);

  // Update project progress
  const updateProgress = async (newProgress) => {
    const p = Math.min(100, Math.max(0, newProgress));
    try {
      await projectsAPI.update(pid, { progress: p });
      setCurrentProject(prev => ({ ...prev, progress: p }));
      onUpdated();
    } catch (err) {
      alert('Failed to update progress');
    }
  };

  // Update status
  const updateStatus = async (newStatus) => {
    try {
      await projectsAPI.update(pid, { status: newStatus });
      setCurrentProject(prev => ({ ...prev, status: newStatus }));
      onUpdated();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  // Handle task create
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const assigneeObj = employeesList.find(u => (u._id || u.id) === taskForm.assignee);
      await tasksAPI.create({
        name: taskForm.name,
        project: pid,
        projectName: currentProject.name,
        assignee: taskForm.assignee || undefined,
        assigneeName: assigneeObj?.name || 'Unassigned',
        priority: taskForm.priority,
        dueDate: taskForm.dueDate || undefined,
        status: 'todo',
      });
      setTaskForm({ name: '', priority: 'medium', assignee: '', dueDate: '' });
      setShowAddTask(false);
      loadTasks();
      onUpdated();
    } catch (err) {
      alert(err.message || 'Failed to create task');
    }
  };

  // Toggle task complete
  const toggleTaskStatus = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    try {
      await tasksAPI.update(taskId, { status: nextStatus });
      setTasks(prev => prev.map(t => (t._id || t.id) === taskId ? { ...t, status: nextStatus } : t));
    } catch (err) {
      alert('Failed to update task');
    }
  };

  // Handle doc create
  const handleCreateDoc = async (e) => {
    e.preventDefault();
    try {
      await documentsAPI.create({
        name: docForm.name,
        project: pid,
        projectName: currentProject.name,
        client: currentProject.client?._id || currentProject.client,
        category: docForm.category,
        fileUrl: docForm.fileUrl || '#',
      });
      setDocForm({ name: '', category: 'specification', fileUrl: '' });
      setShowAddDoc(false);
      loadDocs();
    } catch (err) {
      alert(err.message || 'Failed to add document');
    }
  };

  // Toggle milestone
  const toggleMilestone = (mId) => {
    setMilestones(prev => prev.map(m => m.id === mId ? { ...m, completed: !m.completed } : m));
  };

  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const spentPercent = Math.round(((currentProject.spent || 0) / (currentProject.budget || 1)) * 100);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'tasks', label: `Tasks (${tasks.length})`, icon: CheckSquare },
    { id: 'team', label: `Team (${Array.isArray(currentProject.team) ? currentProject.team.length : 1})`, icon: Users },
    { id: 'timeline', label: 'Milestones', icon: Layers },
    { id: 'files', label: `Documents (${documents.length})`, icon: FolderOpen },
    { id: 'finance', label: 'Client & Finance', icon: DollarSign },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bms-card w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-border dark:border-navy-border overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Workspace Top Header */}
        <div className="p-5 border-b border-border dark:border-navy-border bg-surface-secondary/40 dark:bg-dark-surface-secondary/40 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getServiceBadge(currentProject.service)}
                <span className="text-[10px] text-text-muted">ID: {pid.slice(-6).toUpperCase()}</span>
              </div>
              <h2 className="text-xl font-bold text-text-primary dark:text-white font-sora">{currentProject.name}</h2>
              <p className="text-xs text-text-muted mt-0.5">{currentProject.clientName || 'Internal Company Project'}</p>
            </div>

            <div className="flex items-center gap-2">
              {canManage && (
                <select
                  value={currentProject.status}
                  onChange={e => updateStatus(e.target.value)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border dark:border-navy-border bg-white dark:bg-dark-surface-card text-text-primary dark:text-white outline-none cursor-pointer"
                >
                  {Object.entries(PROJECT_STATUSES).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              )}
              <Badge status={currentProject.priority} className="!text-[10px]">{currentProject.priority}</Badge>
              <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-tertiary transition-colors ml-2">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-border/60 dark:border-navy-border/60">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-electric text-white shadow-sm'
                    : 'text-text-secondary dark:text-slate-400 hover:bg-surface-tertiary dark:hover:bg-dark-surface-tertiary'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Progress & Quick Adjuster */}
              <Card className="p-4 bg-gradient-to-br from-electric/5 via-transparent to-transparent">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-electric" />
                    <span className="font-semibold text-xs text-text-primary dark:text-white">Delivery Progress</span>
                  </div>
                  <span className="font-bold text-sm text-electric">{currentProject.progress || 0}%</span>
                </div>
                <ProgressBar value={currentProject.progress || 0} className="h-2.5 mb-3" />
                {canManage && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-text-muted">Quick Update:</span>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateProgress((currentProject.progress || 0) - 10)} className="px-2 py-0.5 rounded bg-surface-tertiary text-text-primary text-[11px] hover:bg-surface-secondary">-10%</button>
                      <button onClick={() => updateProgress((currentProject.progress || 0) + 10)} className="px-2 py-0.5 rounded bg-electric/10 text-electric text-[11px] font-semibold hover:bg-electric/20">+10%</button>
                      <button onClick={() => updateProgress(100)} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold hover:bg-emerald-500/20">Mark 100%</button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Description */}
              <div>
                <h4 className="font-semibold text-xs text-text-muted uppercase tracking-wider mb-1.5">Project Scope</h4>
                <p className="text-xs text-text-secondary dark:text-slate-300 bg-surface-secondary/40 dark:bg-dark-surface-secondary/40 p-3.5 rounded-xl leading-relaxed">
                  {currentProject.description || 'No detailed project description recorded yet.'}
                </p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-surface-secondary dark:bg-dark-surface-secondary text-center">
                  <p className="text-[11px] text-text-muted">Start Date</p>
                  <p className="text-xs font-bold text-text-primary dark:text-white mt-1">{formatDate(currentProject.startDate)}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-secondary dark:bg-dark-surface-secondary text-center">
                  <p className="text-[11px] text-text-muted">Target Deadline</p>
                  <p className="text-xs font-bold text-text-primary dark:text-white mt-1">{formatDate(currentProject.deadline)}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-secondary dark:bg-dark-surface-secondary text-center">
                  <p className="text-[11px] text-text-muted">Budget</p>
                  <p className="text-xs font-bold text-emerald-600 mt-1">{formatCurrency(currentProject.budget)}</p>
                </div>
                <div className="p-3 rounded-xl bg-surface-secondary dark:bg-dark-surface-secondary text-center">
                  <p className="text-[11px] text-text-muted">Budget Burn</p>
                  <p className="text-xs font-bold text-electric mt-1">{spentPercent}%</p>
                </div>
              </div>

              {/* Project Manager & Client */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-3.5 flex items-center gap-3">
                  <Avatar name={currentProject.managerName || 'PM'} size="md" />
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-semibold">Project Lead</p>
                    <p className="font-bold text-xs text-text-primary dark:text-white">{currentProject.managerName || 'Unassigned'}</p>
                    <p className="text-[10px] text-electric">Operations & Delivery Manager</p>
                  </div>
                </Card>

                <Card className="p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-electric/10 text-electric flex items-center justify-center font-bold font-sora">
                    🏢
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-semibold">Client Company</p>
                    <p className="font-bold text-xs text-text-primary dark:text-white">{currentProject.clientName || 'Internal'}</p>
                    <p className="text-[10px] text-text-muted">Linked Client Account</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* 2. TASKS TAB */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-text-primary dark:text-white font-sora">Project Deliverable Tasks</h4>
                  <p className="text-xs text-text-muted">{completedTasksCount} of {tasks.length} tasks completed</p>
                </div>
                <Button size="sm" onClick={() => setShowAddTask(prev => !prev)}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> {showAddTask ? 'Close Form' : 'Add Task'}
                </Button>
              </div>

              {/* Inline Add Task Form */}
              {showAddTask && (
                <form onSubmit={handleCreateTask} className="p-4 border border-electric/30 bg-electric/5 rounded-xl space-y-3">
                  <Input
                    label="Task Name *"
                    value={taskForm.name}
                    onChange={e => setTaskForm({ ...taskForm, name: e.target.value })}
                    placeholder="e.g. Design authentication workflow"
                    required
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Select label="Assignee" value={taskForm.assignee} onChange={e => setTaskForm({ ...taskForm, assignee: e.target.value })}>
                      <option value="">Unassigned</option>
                      {employeesList.map(u => (
                        <option key={u._id || u.id} value={u._id || u.id}>{u.name} ({u.role})</option>
                      ))}
                    </Select>
                    <Select label="Priority" value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Select>
                    <Input label="Due Date" type="date" value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddTask(false)}>Cancel</Button>
                    <Button type="submit" size="sm">Save Task</Button>
                  </div>
                </form>
              )}

              {/* Tasks List */}
              {loadingTasks ? (
                <div className="flex justify-center py-8"><Spinner size="md" /></div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border dark:border-navy-border rounded-xl">
                  <CheckSquare className="w-6 h-6 text-text-muted mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-text-primary dark:text-white">No tasks created yet</p>
                  <p className="text-[11px] text-text-muted">Click "Add Task" above to break this project into sprints and assignments.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {tasks.map(t => {
                    const tid = t._id || t.id;
                    const isDone = t.status === 'completed';
                    return (
                      <div
                        key={tid}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-surface-secondary/40 border-border opacity-70'
                            : 'bg-white dark:bg-dark-surface-secondary border-border dark:border-navy-border'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleTaskStatus(tid, t.status)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                              isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-border dark:border-navy-border hover:border-electric'
                            }`}
                          >
                            {isDone && <CheckCircle className="w-3.5 h-3.5" />}
                          </button>
                          <div>
                            <p className={`text-xs font-semibold ${isDone ? 'line-through text-text-muted' : 'text-text-primary dark:text-white'}`}>
                              {t.name}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-text-muted">
                              <span>Assignee: {t.assigneeName || 'Unassigned'}</span>
                              {t.dueDate && <span>· Due: {formatDate(t.dueDate)}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge status={t.priority} className="!text-[9px]">{t.priority}</Badge>
                          <Badge status={t.status} className="!text-[9px]">{t.status.replace('_', ' ')}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. TEAM TAB */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-text-primary dark:text-white font-sora">Assigned Workspace Personnel</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Manager */}
                <div className="p-3.5 rounded-xl border border-electric/30 bg-electric/5 flex items-center gap-3">
                  <Avatar name={currentProject.managerName || 'PM'} size="md" />
                  <div>
                    <span className="text-[10px] font-bold text-electric uppercase">Project Manager</span>
                    <p className="font-bold text-xs text-text-primary dark:text-white">{currentProject.managerName || 'Unassigned'}</p>
                    <p className="text-[11px] text-text-muted">Team Lead & Delivery Owner</p>
                  </div>
                </div>

                {/* Team members */}
                {Array.isArray(currentProject.team) && currentProject.team.map((member, i) => (
                  <div key={member._id || member.id || i} className="p-3.5 rounded-xl border border-border dark:border-navy-border bg-white dark:bg-dark-surface-secondary flex items-center gap-3">
                    <Avatar name={member.name || 'Member'} size="md" />
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase capitalize">{member.role || 'Contributor'}</span>
                      <p className="font-bold text-xs text-text-primary dark:text-white">{member.name || 'Team Member'}</p>
                      <p className="text-[11px] text-text-muted">{member.position || member.department || 'Digital Solutions'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. TIMELINE & MILESTONES TAB */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-text-primary dark:text-white font-sora">Delivery Milestones & Roadmap</h4>
                  <p className="text-xs text-text-muted">Track major project gates and deliverable approvals</p>
                </div>
              </div>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border dark:before:bg-navy-border">
                {milestones.map((m, idx) => (
                  <div key={m.id} className="flex items-start gap-3 relative">
                    <button
                      onClick={() => toggleMilestone(m.id)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all z-10 ${
                        m.completed ? 'bg-emerald-500 text-white' : 'bg-surface-tertiary dark:bg-dark-surface-tertiary text-text-muted border border-border'
                      }`}
                    >
                      {m.completed ? '✓' : idx + 1}
                    </button>
                    <div className="flex-1 p-3 rounded-xl border border-border dark:border-navy-border bg-white dark:bg-dark-surface-secondary">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${m.completed ? 'line-through text-text-muted' : 'text-text-primary dark:text-white'}`}>
                          {m.title}
                        </span>
                        <span className="text-[10px] text-text-muted">{m.targetDate || 'Pending'}</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-1">
                        Status: {m.completed ? 'Deliverable Approved' : 'In Progress / Pending Review'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. FILES & DOCUMENTS TAB */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-text-primary dark:text-white font-sora">Project Documents & Assets</h4>
                  <p className="text-xs text-text-muted">Specifications, proposals, designs, and source materials</p>
                </div>
                <Button size="sm" onClick={() => setShowAddDoc(prev => !prev)}>
                  <Plus className="w-3.5 h-3.5 mr-1" /> {showAddDoc ? 'Close Form' : 'Add File'}
                </Button>
              </div>

              {showAddDoc && (
                <form onSubmit={handleCreateDoc} className="p-4 border border-electric/30 bg-electric/5 rounded-xl space-y-3">
                  <Input label="Document Title *" value={docForm.name} onChange={e => setDocForm({ ...docForm, name: e.target.value })} placeholder="e.g. Technical Architecture Specification" required />
                  <div className="grid grid-cols-2 gap-3">
                    <Select label="Category" value={docForm.category} onChange={e => setDocForm({ ...docForm, category: e.target.value })}>
                      <option value="specification">Specification</option>
                      <option value="contract">Contract / Proposal</option>
                      <option value="design">Design / Figma</option>
                      <option value="asset">Media Asset</option>
                      <option value="other">Other</option>
                    </Select>
                    <Input label="Link / URL" value={docForm.fileUrl} onChange={e => setDocForm({ ...docForm, fileUrl: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddDoc(false)}>Cancel</Button>
                    <Button type="submit" size="sm">Save Document</Button>
                  </div>
                </form>
              )}

              {loadingDocs ? (
                <div className="flex justify-center py-8"><Spinner size="md" /></div>
              ) : documents.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border dark:border-navy-border rounded-xl">
                  <FolderOpen className="w-6 h-6 text-text-muted mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-text-primary dark:text-white">No documents attached</p>
                  <p className="text-[11px] text-text-muted">Attach project specifications, assets, or design links here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.map(doc => {
                    const did = doc._id || doc.id;
                    return (
                      <div key={did} className="flex items-center justify-between p-3 rounded-xl border border-border dark:border-navy-border bg-white dark:bg-dark-surface-secondary">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-electric/10 text-electric flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary dark:text-white">{doc.name}</p>
                            <p className="text-[10px] text-text-muted capitalize">{doc.category || 'Document'} · Added {formatDate(doc.createdAt)}</p>
                          </div>
                        </div>
                        {doc.fileUrl && doc.fileUrl !== '#' && (
                          <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-electric text-xs flex items-center gap-1 hover:underline">
                            Open <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 6. CLIENT & FINANCE TAB */}
          {activeTab === 'finance' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="p-3.5 text-center">
                  <p className="text-[11px] text-text-muted">Total Budget</p>
                  <p className="text-base font-bold text-emerald-600 mt-1 font-sora">{formatCurrency(currentProject.budget)}</p>
                </Card>
                <Card className="p-3.5 text-center">
                  <p className="text-[11px] text-text-muted">Total Spent</p>
                  <p className="text-base font-bold text-red-500 mt-1 font-sora">{formatCurrency(currentProject.spent)}</p>
                </Card>
                <Card className="p-3.5 text-center">
                  <p className="text-[11px] text-text-muted">Remaining Balance</p>
                  <p className="text-base font-bold text-electric mt-1 font-sora">{formatCurrency(Math.max(0, (currentProject.budget || 0) - (currentProject.spent || 0)))}</p>
                </Card>
              </div>

              <div>
                <h4 className="font-bold text-sm text-text-primary dark:text-white mb-2 font-sora">Associated Invoices</h4>
                {invoices.length === 0 ? (
                  <p className="text-xs text-text-muted py-4 text-center border border-dashed border-border rounded-xl">No invoices billed to this client yet.</p>
                ) : (
                  <div className="space-y-2">
                    {invoices.map(inv => {
                      const iid = inv._id || inv.id;
                      return (
                        <div key={iid} className="flex items-center justify-between p-3 rounded-xl border border-border dark:border-navy-border bg-white dark:bg-dark-surface-secondary text-xs">
                          <div>
                            <p className="font-bold text-text-primary dark:text-white">{inv.number}</p>
                            <p className="text-[10px] text-text-muted">Due: {formatDate(inv.dueDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600 font-sora">{formatCurrency(inv.total)}</p>
                            <Badge status={inv.status} className="!text-[9px]">{inv.status}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
