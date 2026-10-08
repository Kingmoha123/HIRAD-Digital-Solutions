import { useState } from 'react';
import { Plus, GripVertical, Calendar, Clock, Flag, CheckCircle, Trash2, MessageSquare, Send, CheckCircle2, Eye, X, Save, Edit3, User } from 'lucide-react';
import { Card, Badge, Button, SearchBar, Modal, Input, Select, Textarea, Avatar, EmptyState, Spinner, ProgressBar } from '../../components/ui';
import { tasksAPI, projectsAPI, employeesAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatDate, timeAgo } from '../../utils/helpers';

export const TASK_STATUSES = {
  todo: { label: 'To Do', color: 'border-slate-400 text-slate-400' },
  in_progress: { label: 'In Progress', color: 'border-blue-500 text-blue-500' },
  review: { label: 'Review', color: 'border-amber-500 text-amber-500' },
  completed: { label: 'Completed', color: 'border-emerald-500 text-emerald-500' },
};

export const TASK_PRIORITIES = {
  low: { label: 'Low', color: 'text-slate-400' },
  medium: { label: 'Medium', color: 'text-blue-500' },
  high: { label: 'High', color: 'text-amber-500' },
  urgent: { label: 'Urgent', color: 'text-red-500' },
};

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'border-slate-300 dark:border-slate-700' },
  { id: 'in_progress', label: 'In Progress', color: 'border-blue-400' },
  { id: 'review', label: 'Review', color: 'border-amber-400' },
  { id: 'completed', label: 'Completed', color: 'border-emerald-400' },
];

export default function Tasks() {
  const { confirm } = useConfirm();
  const { data: tasksData, loading, refetch } = useApi(() => tasksAPI.getAll());
  const { data: projData } = useApi(() => projectsAPI.getAll());
  const { data: empData } = useApi(() => employeesAPI.getAll());

  const tasks = tasksData?.data || [];
  const projectsList = projData?.data || [];
  const employeesList = empData?.data || [];

  const [search, setSearch] = useState('');
  const [view, setView] = useState('kanban');
  const [filterPriority, setFilterPriority] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', project: '', assignee: '', priority: 'medium', status: 'todo', startDate: '', dueDate: '', estimatedHours: '' });

  const getTasksForColumn = (status) =>
    tasks.filter(t => {
      const matchStatus = t.status === status;
      const matchSearch = !search || t.name?.toLowerCase().includes(search.toLowerCase());
      const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
      return matchStatus && matchSearch && matchPriority;
    });

  const moveTask = async (taskId, newStatus) => {
    try {
      await tasksAPI.update(taskId, { status: newStatus });
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to update task');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const project = projectsList.find(p => (p._id || p.id) === form.project);
      const assignee = employeesList.find(u => (u._id || u.id) === form.assignee);
      await tasksAPI.create({
        ...form,
        projectName: project?.name || '',
        assigneeName: assignee?.name || '',
        estimatedHours: Number(form.estimatedHours) || 0,
        actualHours: 0,
      });
      await refetch();
      setModalOpen(false);
      setForm({ name: '', description: '', project: '', assignee: '', priority: 'medium', status: 'todo', startDate: '', dueDate: '', estimatedHours: '' });
    } catch (err) {
      alert(err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Task',
      message: 'Are you sure you want to permanently delete this task? This action cannot be undone.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await tasksAPI.delete(id);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    }
  };

  const priorityColors = { low: 'text-slate-400', medium: 'text-blue-500', high: 'text-amber-500', urgent: 'text-red-500' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">{tasks.filter(t => t.status !== 'completed').length} pending · {tasks.filter(t => t.status === 'completed').length} completed</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-border dark:border-navy-border rounded-lg overflow-hidden">
            {[{ value: 'kanban', label: 'Billboard' }, { value: 'list', label: 'List' }].map(v => (
              <button key={v.value} onClick={() => setView(v.value)} className={`px-3 py-1.5 text-xs font-medium ${view === v.value ? 'bg-electric text-white' : 'text-text-secondary dark:text-slate-400 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary'}`}>{v.label}</button>
            ))}
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." className="max-w-xs" />
        <div className="flex gap-2">
          {['all', 'low', 'medium', 'high', 'urgent'].map(p => (
            <button key={p} onClick={() => setFilterPriority(p)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${filterPriority === p ? 'bg-electric text-white' : 'bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary dark:text-slate-400 hover:bg-surface-secondary'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {COLUMNS.map(col => (
          <Card key={col.id} className={`p-3 border-t-2 ${col.color} text-center`}>
            <p className="text-xl font-bold text-text-primary dark:text-white font-sora">{getTasksForColumn(col.id).length}</p>
            <p className="text-xs text-text-muted">{col.label}</p>
          </Card>
        ))}
      </div>

      {/* Kanban */}
      {view === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => {
            const colTasks = getTasksForColumn(col.id);
            return (
              <div key={col.id} className="kanban-column flex-shrink-0">
                <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${col.color}`}>
                  <span className="text-sm font-bold text-text-primary dark:text-white">{col.label}</span>
                  <span className="ml-auto text-xs text-text-muted bg-surface-tertiary dark:bg-dark-surface-tertiary px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>

                <div className="space-y-3">
                  {colTasks.map(task => (
                    <Card
                      key={task._id || task.id}
                      className="p-3.5 cursor-pointer hover:border-electric transition-colors"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Flag className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${priorityColors[task.priority]}`} />
                        <p className="text-sm font-semibold text-text-primary dark:text-white flex-1 leading-tight hover:text-electric transition-colors">{task.name}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(task._id || task.id); }}
                          className="text-text-muted hover:text-red-500 transition-colors p-0.5"
                          title="Delete task"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-text-muted mb-2 ml-5">{task.projectName}</p>

                      <div className="flex items-center gap-2 ml-5 mb-3">
                        <Avatar name={task.assigneeName} size="xs" />
                        <span className="text-[11px] text-text-muted">{task.assigneeName}</span>
                      </div>

                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-[11px] text-text-muted ml-5 mb-3">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}

                      {/* Status move */}
                      <div className="flex gap-1 ml-5">
                        {COLUMNS.filter(c => c.id !== col.id).map(c => (
                          <button
                            key={c.id}
                            onClick={(e) => { e.stopPropagation(); moveTask(task._id || task.id, c.id); }}
                            className="flex-1 text-[9px] px-1.5 py-1 rounded bg-surface-tertiary dark:bg-dark-surface-tertiary text-text-muted hover:bg-electric/10 hover:text-electric transition-colors truncate"
                          >
                            {c.id === 'completed' ? '✓ Done' : `→ ${c.label.split(' ')[0]}`}
                          </button>
                        ))}
                      </div>
                    </Card>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-xs text-text-muted border-2 border-dashed border-border dark:border-navy-border rounded-xl">
                      No tasks in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="bms-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Hours</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.filter(t => {
                  const matchSearch = !search || t.name?.toLowerCase().includes(search.toLowerCase());
                  const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
                  return matchSearch && matchPriority;
                }).map(task => (
                  <tr key={task._id || task.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        {task.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-border dark:border-navy-border flex-shrink-0" />
                        )}
                        <span
                          onClick={() => setSelectedTask(task)}
                          className={`font-medium text-sm cursor-pointer hover:text-electric transition-colors ${task.status === 'completed' ? 'line-through text-text-muted' : 'text-text-primary dark:text-white'}`}
                        >
                          {task.name}
                        </span>
                      </div>
                    </td>
                    <td className="text-xs text-text-muted">{task.projectName || '—'}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assigneeName} size="xs" />
                        <span className="text-xs">{task.assigneeName || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td><Badge status={task.priority}>{task.priority}</Badge></td>
                    <td><Badge status={task.status}>{TASK_STATUSES[task.status]?.label}</Badge></td>
                    <td className="text-xs">{formatDate(task.dueDate)}</td>
                    <td className="text-xs">
                      <span className="text-text-primary dark:text-white font-medium">{task.actualHours || 0}h</span>
                      <span className="text-text-muted">/{task.estimatedHours || 0}h</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="text-text-muted hover:text-electric p-1 transition-colors"
                          title="View task details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {COLUMNS.filter(c => c.id !== task.status).map(c => (
                          <button key={c.id} onClick={() => moveTask(task._id || task.id, c.id)} className="text-[10px] px-2 py-1 rounded bg-surface-tertiary dark:bg-dark-surface-secondary text-text-muted hover:text-electric transition-colors">
                            {c.id === 'completed' ? '✓' : `→${c.label[0]}`}
                          </button>
                        ))}
                        <button onClick={() => handleDelete(task._id || task.id)} className="text-text-muted hover:text-red-500 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Task Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Task" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Task Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Project" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })}>
              <option value="">No project</option>
              {projectsList.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>)}
            </Select>
            <Select label="Assign To" value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}>
              <option value="">Select assignee</option>
              {employeesList.map(u => <option key={u._id || u.id} value={u._id || u.id}>{u.name}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              {Object.entries(TASK_PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </Select>
            <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {Object.entries(TASK_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Start Date" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            <Input label="Est. Hours" type="number" value={form.estimatedHours} onChange={e => setForm({ ...form, estimatedHours: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Task'}</Button>
          </div>
        </form>
      </Modal>

      {/* Task Detail Modal (Requirement #13) */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          projects={projectsList}
          employees={employeesList}
          onUpdated={() => refetch()}
        />
      )}
    </div>
  );
}

// ─── DEDICATED TASK DETAIL MODAL (Requirement #13) ────────────────────────────
function TaskDetailModal({ task, onClose, projects, employees, onUpdated }) {
  const { user } = useAuth();
  const tid = task._id || task.id;
  const [currentTask, setCurrentTask] = useState(task);
  const [description, setDescription] = useState(task.description || '');
  const [hoursToAdd, setHoursToAdd] = useState('');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(task.comments || []);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Update status
  const handleStatusChange = async (newStatus) => {
    try {
      await tasksAPI.update(tid, { status: newStatus });
      setCurrentTask(prev => ({ ...prev, status: newStatus }));
      onUpdated();
    } catch (err) {
      alert('Failed to update task status');
    }
  };

  // Update priority
  const handlePriorityChange = async (newPriority) => {
    try {
      await tasksAPI.update(tid, { priority: newPriority });
      setCurrentTask(prev => ({ ...prev, priority: newPriority }));
      onUpdated();
    } catch (err) {
      alert('Failed to update priority');
    }
  };

  // Update assignee
  const handleAssigneeChange = async (newAssigneeId) => {
    const assigneeObj = employees.find(u => (u._id || u.id) === newAssigneeId);
    try {
      await tasksAPI.update(tid, {
        assignee: newAssigneeId || undefined,
        assigneeName: assigneeObj?.name || 'Unassigned',
      });
      setCurrentTask(prev => ({ ...prev, assignee: newAssigneeId, assigneeName: assigneeObj?.name || 'Unassigned' }));
      onUpdated();
    } catch (err) {
      alert('Failed to reassign task');
    }
  };

  // Save description
  const handleSaveDescription = async () => {
    setSaving(true);
    try {
      await tasksAPI.update(tid, { description });
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2000);
      onUpdated();
    } catch (err) {
      alert('Failed to save description');
    } finally {
      setSaving(false);
    }
  };

  // Log time
  const handleLogHours = async (additionalHours) => {
    const hrs = Number(additionalHours);
    if (!hrs || hrs <= 0) return;
    const newTotal = (currentTask.actualHours || 0) + hrs;
    try {
      await tasksAPI.update(tid, { actualHours: newTotal });
      setCurrentTask(prev => ({ ...prev, actualHours: newTotal }));
      setHoursToAdd('');
      onUpdated();
    } catch (err) {
      alert('Failed to log hours');
    }
  };

  // Post comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentItem = {
      id: `comm-${Date.now()}`,
      authorName: user?.name || 'Team Member',
      text: newComment.trim(),
      createdAt: new Date().toISOString(),
    };
    const updatedComments = [...comments, commentItem];
    setComments(updatedComments);
    setNewComment('');
    try {
      await tasksAPI.update(tid, { comments: updatedComments });
    } catch (err) {
      console.error(err);
    }
  };

  const isCompleted = currentTask.status === 'completed';
  const est = currentTask.estimatedHours || 1;
  const actual = currentTask.actualHours || 0;
  const timeProgress = Math.min(100, Math.round((actual / est) * 100));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bms-card w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-border dark:border-navy-border overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border dark:border-navy-border bg-surface-secondary/40 dark:bg-dark-surface-secondary/40 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-full">
                  {currentTask.projectName || 'Internal Task'}
                </span>
                <span className="text-[10px] text-text-muted">ID: {tid.slice(-6).toUpperCase()}</span>
              </div>
              <h3 className={`text-lg font-bold text-text-primary dark:text-white font-sora ${isCompleted ? 'line-through text-text-muted' : ''}`}>
                {currentTask.name}
              </h3>
            </div>

            <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-surface-tertiary">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <select
              value={currentTask.status}
              onChange={e => handleStatusChange(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-border dark:border-navy-border bg-white dark:bg-dark-surface-card text-text-primary dark:text-white outline-none cursor-pointer"
            >
              {Object.entries(TASK_STATUSES).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>

            <select
              value={currentTask.priority}
              onChange={e => handlePriorityChange(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-border dark:border-navy-border bg-white dark:bg-dark-surface-card text-text-primary dark:text-white outline-none cursor-pointer"
            >
              {Object.entries(TASK_PRIORITIES).map(([k, v]) => (
                <option key={k} value={k}>Priority: {v.label}</option>
              ))}
            </select>

            <button
              onClick={() => handleStatusChange(isCompleted ? 'in_progress' : 'completed')}
              className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ml-auto flex items-center gap-1.5 ${
                isCompleted
                  ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {isCompleted ? 'Reopen Task' : 'Mark Completed ✓'}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Details Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-surface-secondary dark:bg-dark-surface-secondary">
              <span className="text-[10px] text-text-muted uppercase">Assignee</span>
              <div className="flex items-center gap-2 mt-1">
                <Avatar name={currentTask.assigneeName} size="xs" />
                <select
                  value={currentTask.assignee || ''}
                  onChange={e => handleAssigneeChange(e.target.value)}
                  className="bg-transparent font-semibold text-text-primary dark:text-white outline-none cursor-pointer w-full truncate"
                >
                  <option value="">Unassigned</option>
                  {employees.map(u => (
                    <option key={u._id || u.id} value={u._id || u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary dark:bg-dark-surface-secondary">
              <span className="text-[10px] text-text-muted uppercase">Target Due Date</span>
              <p className="font-semibold text-text-primary dark:text-white mt-1">
                {currentTask.dueDate ? formatDate(currentTask.dueDate) : 'No deadline'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary dark:bg-dark-surface-secondary col-span-2 sm:col-span-1">
              <span className="text-[10px] text-text-muted uppercase">Created</span>
              <p className="font-semibold text-text-primary dark:text-white mt-1">
                {formatDate(currentTask.createdAt)}
              </p>
            </div>
          </div>

          {/* Time Tracking Section */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-electric" />
                <span className="font-bold text-xs uppercase tracking-wider text-text-muted">Logged Hours & Tracking</span>
              </div>
              <span className="text-xs font-bold font-sora text-text-primary dark:text-white">
                {actual}h <span className="text-text-muted font-normal">/ {est}h est.</span>
              </span>
            </div>

            <ProgressBar value={actual} max={est} className="h-2" />

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-text-muted">Quick log time:</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => handleLogHours(1)} className="px-2.5 py-1 text-xs rounded bg-surface-tertiary hover:bg-surface-secondary text-text-primary font-medium">+1h</button>
                <button onClick={() => handleLogHours(2)} className="px-2.5 py-1 text-xs rounded bg-surface-tertiary hover:bg-surface-secondary text-text-primary font-medium">+2h</button>
                <div className="flex items-center gap-1 ml-1">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={hoursToAdd}
                    onChange={e => setHoursToAdd(e.target.value)}
                    placeholder="hrs"
                    className="w-14 px-2 py-1 text-xs rounded border border-border dark:border-navy-border bg-white dark:bg-dark-surface-card text-center outline-none"
                  />
                  <Button size="sm" onClick={() => handleLogHours(hoursToAdd)} disabled={!hoursToAdd}>
                    Log
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted">Task Description</h4>
              <Button size="sm" variant="ghost" onClick={handleSaveDescription} disabled={saving} className="text-xs">
                <Save className="w-3.5 h-3.5 mr-1" /> {savedNotice ? '✓ Saved!' : (saving ? 'Saving...' : 'Save')}
              </Button>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed acceptance criteria or implementation notes..."
              className="w-full text-xs p-3 rounded-xl border border-border dark:border-navy-border bg-white dark:bg-dark-surface-secondary text-text-primary dark:text-white outline-none focus:border-electric resize-y leading-relaxed"
            />
          </div>

          {/* Discussion & Updates Thread */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-electric" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted">Discussion & Work Updates ({comments.length})</h4>
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Write an update, question, or note..."
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-border dark:border-navy-border bg-white dark:bg-dark-surface-card text-text-primary dark:text-white outline-none focus:border-electric"
              />
              <Button type="submit" size="sm" disabled={!newComment.trim()}>
                <Send className="w-3.5 h-3.5 mr-1" /> Post
              </Button>
            </form>

            <div className="space-y-2">
              {comments.map(c => (
                <div key={c.id} className="p-3 rounded-xl bg-surface-secondary/50 dark:bg-dark-surface-secondary/50 border border-border/50 dark:border-navy-border/50 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-text-primary dark:text-white">{c.authorName}</span>
                    <span className="text-[10px] text-text-muted">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="text-text-secondary dark:text-slate-300 leading-relaxed">{c.text}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-xs text-text-muted text-center py-4 border border-dashed border-border dark:border-navy-border rounded-xl">
                  No comments or updates posted yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
