import { useState, useEffect } from 'react';
import { Play, Pause, Square, Plus, Clock, Trash2 } from 'lucide-react';
import { Card, Button, Select, Input, Avatar, Spinner } from '../../components/ui';
import { timeAPI, projectsAPI, tasksAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useAuth } from '../../context/AuthContext';
import { useConfirm } from '../../context/ConfirmContext';
import { formatDate } from '../../utils/helpers';

export default function TimeTracking() {
  const { user } = useAuth();
  const { confirm } = useConfirm();
  const { data: timeRes, loading, refetch } = useApi(() => timeAPI.getAll({ limit: 100 }));
  const { data: projectsRes } = useApi(() => projectsAPI.getAll({ limit: 100 }));
  const { data: tasksRes } = useApi(() => tasksAPI.getAll({ limit: 100 }));

  const entries = timeRes?.data || [];
  const projects = projectsRes?.data || [];
  const tasks = tasksRes?.data || [];

  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const [timerProject, setTimerProject] = useState('');
  const [timerTask, setTimerTask] = useState('');
  const [timerDesc, setTimerDesc] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [manualForm, setManualForm] = useState({
    project: '',
    task: '',
    description: '',
    hours: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const formatTimer = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const stopAndSave = async () => {
    if (timer > 0) {
      const projectObj = projects.find(p => (p._id || p.id) === timerProject);
      const taskObj = tasks.find(t => (t._id || t.id) === timerTask);
      const computedHours = Math.max(0.1, Number((timer / 3600).toFixed(2)));

      try {
        await timeAPI.create({
          user: user?._id || user?.id,
          userName: user?.name || 'Staff Member',
          project: timerProject || undefined,
          projectName: projectObj?.name,
          task: timerTask || undefined,
          taskName: taskObj?.name,
          description: timerDesc || 'Work session',
          hours: computedHours,
          date: new Date().toISOString(),
        });
        refetch();
      } catch (err) {
        console.error('Failed to log time entry:', err);
      }
    }
    setRunning(false);
    setTimer(0);
    setTimerProject('');
    setTimerTask('');
    setTimerDesc('');
  };

  const addManual = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const projectObj = projects.find(p => (p._id || p.id) === manualForm.project);
      const taskObj = tasks.find(t => (t._id || t.id) === manualForm.task);

      await timeAPI.create({
        user: user?._id || user?.id,
        userName: user?.name || 'Staff Member',
        project: manualForm.project || undefined,
        projectName: projectObj?.name,
        task: manualForm.task || undefined,
        taskName: taskObj?.name,
        description: manualForm.description || 'Manual entry',
        hours: Number(manualForm.hours) || 1,
        date: manualForm.date,
      });

      setManualMode(false);
      setManualForm({ project: '', task: '', description: '', hours: '', date: new Date().toISOString().split('T')[0] });
      refetch();
    } catch (err) {
      console.error('Failed to create manual entry:', err);
      alert('Error creating time entry: ' + (err.message || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Time Entry',
      message: 'Are you sure you want to permanently delete this time entry? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await timeAPI.delete(id);
      refetch();
    } catch (err) {
      console.error('Failed to delete time entry:', err);
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayHours = entries
    .filter(e => {
      const d = e.date ? (typeof e.date === 'string' ? e.date.slice(0, 10) : new Date(e.date).toISOString().slice(0, 10)) : '';
      return d === todayStr;
    })
    .reduce((s, e) => s + (e.hours || 0), 0);

  const totalHours = entries.reduce((s, e) => s + (e.hours || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Time Tracking</h1>
          <p className="page-subtitle">Track billable time on projects and client tasks</p>
        </div>
        <Button variant="secondary" onClick={() => setManualMode(true)}>
          <Plus className="w-4 h-4" /> Add Manual Entry
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-electric font-sora">{todayHours.toFixed(1)}h</p>
          <p className="text-xs text-text-muted mt-1">Logged Today</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-electric font-sora">{totalHours.toFixed(1)}h</p>
          <p className="text-xs text-text-muted mt-1">Total Hours Logged</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600 font-sora">{entries.length}</p>
          <p className="text-xs text-text-muted mt-1">Total Entries</p>
        </Card>
      </div>

      {/* Timer */}
      <Card className="p-6">
        <h3 className="font-bold text-text-primary dark:text-white mb-4 font-sora">Live Work Timer</h3>
        <div className="flex flex-col items-center gap-6">
          <div className="text-6xl font-bold text-text-primary dark:text-white font-sora tracking-wider">
            {formatTimer(timer)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
            <Select value={timerProject} onChange={e => setTimerProject(e.target.value)}>
              <option value="">Select project...</option>
              {projects.map(p => (
                <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
              ))}
            </Select>
            <Select value={timerTask} onChange={e => setTimerTask(e.target.value)}>
              <option value="">Select task (optional)...</option>
              {tasks.filter(t => !timerProject || t.project === timerProject).map(t => (
                <option key={t._id || t.id} value={t._id || t.id}>{t.name}</option>
              ))}
            </Select>
          </div>

          <input
            value={timerDesc}
            onChange={e => setTimerDesc(e.target.value)}
            placeholder="What are you working on right now?"
            className="bms-input w-full max-w-md text-center"
          />

          <div className="flex gap-3">
            {!running ? (
              <button
                onClick={() => setRunning(true)}
                className="w-14 h-14 rounded-full bg-electric flex items-center justify-center hover:bg-electric-dark transition-colors shadow-lg"
                title="Start Timer"
              >
                <Play className="w-6 h-6 text-white ml-1" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => setRunning(false)}
                  className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-600 transition-colors"
                  title="Pause Timer"
                >
                  <Pause className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={stopAndSave}
                  className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  title="Stop and Save to Database"
                >
                  <Square className="w-5 h-5 text-white" />
                </button>
              </>
            )}
          </div>
          {running && <p className="text-xs text-electric animate-pulse">Timer running...</p>}
        </div>
      </Card>

      {/* Recent Entries */}
      <Card>
        <div className="flex items-center justify-between p-4 border-b border-border dark:border-navy-border">
          <h3 className="font-bold text-text-primary dark:text-white font-sora">Time Entries</h3>
          <Clock className="w-4 h-4 text-text-muted" />
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="bms-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Project</th>
                  <th>Task</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Hours</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(entry => {
                  const id = entry._id || entry.id;
                  return (
                    <tr key={id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar name={entry.userName || 'Member'} size="xs" />
                          <span className="text-xs font-medium">{entry.userName || 'Member'}</span>
                        </div>
                      </td>
                      <td className="text-xs">{entry.projectName || 'General Work'}</td>
                      <td className="text-xs text-text-muted">{entry.taskName || '—'}</td>
                      <td className="text-xs text-text-muted max-w-xs truncate">{entry.description || '—'}</td>
                      <td className="text-xs">{formatDate(entry.date)}</td>
                      <td>
                        <span className="text-sm font-bold text-electric">{entry.hours}h</span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => handleDelete(id)}
                          className="p-1.5 text-text-muted hover:text-rose-500 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-text-muted">
                      No time entries logged yet. Start the timer or add a manual entry.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Manual Entry Modal */}
      {manualMode && (
        <div className="modal-backdrop">
          <div className="modal-box max-w-md animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-border dark:border-navy-border">
              <h3 className="text-lg font-bold font-sora">Add Time Entry</h3>
              <button onClick={() => setManualMode(false)} className="text-text-muted hover:text-text-primary">✕</button>
            </div>
            <form onSubmit={addManual} className="p-5 space-y-4">
              <Select label="Project" value={manualForm.project} onChange={e => setManualForm({ ...manualForm, project: e.target.value })}>
                <option value="">Select project</option>
                {projects.map(p => (
                  <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
                ))}
              </Select>
              <Select label="Task" value={manualForm.task} onChange={e => setManualForm({ ...manualForm, task: e.target.value })}>
                <option value="">Select task (optional)</option>
                {tasks.filter(t => !manualForm.project || t.project === manualForm.project).map(t => (
                  <option key={t._id || t.id} value={t._id || t.id}>{t.name}</option>
                ))}
              </Select>
              <Input label="Description" value={manualForm.description} onChange={e => setManualForm({ ...manualForm, description: e.target.value })} placeholder="What did you work on?" />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Hours" type="number" step="0.25" value={manualForm.hours} onChange={e => setManualForm({ ...manualForm, hours: e.target.value })} placeholder="2.5" required />
                <Input label="Date" type="date" value={manualForm.date} onChange={e => setManualForm({ ...manualForm, date: e.target.value })} required />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setManualMode(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save Entry'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
