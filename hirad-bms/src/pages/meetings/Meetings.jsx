import { useState } from 'react';
import { Plus, Video, MapPin, Calendar, CheckCircle, Trash2, Clock, Users, FileText, CheckSquare, Zap, X, Save, ExternalLink } from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Select, Textarea, Spinner, Avatar } from '../../components/ui';
import { meetingsAPI, clientsAPI, tasksAPI, employeesAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useConfirm } from '../../context/ConfirmContext';
import { formatDate } from '../../utils/helpers';

export default function Meetings() {
  const { confirm } = useConfirm();
  const { data: meetingsRes, loading: loadingMeetings, refetch: refetchMeetings } = useApi(() => meetingsAPI.getAll({ limit: 100 }));
  const { data: clientsRes } = useApi(() => clientsAPI.getAll({ limit: 100 }));
  const { data: employeesRes } = useApi(() => employeesAPI.getAll({ limit: 100 }));

  const meetings = meetingsRes?.data || [];
  const clients = clientsRes?.data || [];
  const employees = employeesRes?.data || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'internal',
    client: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 60,
    location: '',
    link: '',
    agenda: '',
  });

  const upcoming = meetings.filter(m => m.status === 'upcoming');
  const completed = meetings.filter(m => m.status === 'completed');

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedClient = clients.find(c => (c._id || c.id) === form.client);
      const payload = {
        title: form.title,
        type: form.type,
        date: form.date,
        time: form.time,
        duration: Number(form.duration) || 60,
        location: form.location,
        link: form.link,
        agenda: form.agenda,
        status: 'upcoming',
        client: form.type === 'client' && form.client ? form.client : undefined,
        clientName: form.type === 'client' && selectedClient ? selectedClient.company : undefined,
      };

      await meetingsAPI.create(payload);
      setModalOpen(false);
      setForm({
        title: '',
        type: 'internal',
        client: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        duration: 60,
        location: '',
        link: '',
        agenda: '',
      });
      refetchMeetings();
    } catch (err) {
      console.error('Failed to create meeting:', err);
      alert('Error creating meeting: ' + (err.message || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await meetingsAPI.update(id, { status: 'completed' });
      refetchMeetings();
    } catch (err) {
      console.error('Failed to update meeting status:', err);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Meeting',
      message: 'Are you sure you want to permanently delete this meeting? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await meetingsAPI.delete(id);
      refetchMeetings();
    } catch (err) {
      console.error('Failed to delete meeting:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Meetings</h1>
          <p className="page-subtitle">{upcoming.length} upcoming · {completed.length} completed</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> Schedule Meeting
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center border-t-2 border-blue-400">
          <p className="text-2xl font-bold text-electric font-sora">{upcoming.length}</p>
          <p className="text-xs text-text-muted mt-1">Upcoming</p>
        </Card>
        <Card className="p-4 text-center border-t-2 border-emerald-400">
          <p className="text-2xl font-bold text-emerald-600 font-sora">{completed.length}</p>
          <p className="text-xs text-text-muted mt-1">Completed</p>
        </Card>
        <Card className="p-4 text-center border-t-2 border-amber-400">
          <p className="text-2xl font-bold text-amber-600 font-sora">{meetings.filter(m => m.type === 'client').length}</p>
          <p className="text-xs text-text-muted mt-1">Client Meetings</p>
        </Card>
      </div>

      {loadingMeetings ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Upcoming Meetings */}
          <div>
            <h2 className="text-base font-bold text-text-primary dark:text-white mb-3 font-sora">Upcoming Meetings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map(meeting => {
                const id = meeting._id || meeting.id;
                return (
                  <Card key={id} hover className={`p-5 border-l-4 ${meeting.type === 'client' ? 'border-l-electric' : 'border-l-cyan-brand'} relative group`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-sm text-text-primary dark:text-white">{meeting.title}</h3>
                        {meeting.clientName && (
                          <p className="text-xs text-text-muted mt-0.5">👤 {meeting.clientName}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge status={meeting.type === 'client' ? 'info' : 'gray'}>
                          {meeting.type === 'client' ? 'Client' : 'Internal'}
                        </Badge>
                        <button
                          onClick={() => handleDelete(id)}
                          className="text-text-muted hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          title="Delete meeting"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-text-muted" />
                        <span>{formatDate(meeting.date)} at {meeting.time || '10:00'}</span>
                        <span className="text-text-muted">({meeting.duration || 60} min)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-slate-400">
                        {meeting.link ? (
                          <Video className="w-3.5 h-3.5 text-text-muted" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-text-muted" />
                        )}
                        <span>{meeting.location || (meeting.link ? 'Virtual Meeting' : 'Office')}</span>
                      </div>
                    </div>

                    {meeting.agenda && (
                      <p className="text-xs text-text-muted bg-surface-secondary dark:bg-dark-surface-secondary p-2 rounded-lg mb-3 line-clamp-2">
                        📋 {meeting.agenda}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50 dark:border-navy-border/50">
                      {meeting.link && (
                        <a href={meeting.link.startsWith('http') ? meeting.link : `https://${meeting.link}`} target="_blank" rel="noreferrer" className="btn-bms-primary !text-xs !py-1.5 px-3">
                          <Video className="w-3.5 h-3.5 mr-1" /> Join
                        </a>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        className="!text-xs !py-1.5 px-2.5"
                        onClick={() => setSelectedMeeting(meeting)}
                      >
                        <FileText className="w-3.5 h-3.5 mr-1 text-electric" /> Notes & Actions
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!text-xs !py-1.5 px-2.5 ml-auto text-emerald-600 hover:bg-emerald-500/10"
                        onClick={() => handleMarkCompleted(id)}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Done
                      </Button>
                    </div>
                  </Card>
                );
              })}
              {upcoming.length === 0 && (
                <div className="col-span-2 text-center py-12 text-text-muted border-2 border-dashed border-border dark:border-navy-border rounded-xl">
                  No upcoming meetings scheduled
                </div>
              )}
            </div>
          </div>

          {/* Completed Meetings */}
          <div>
            <h2 className="text-base font-bold text-text-primary dark:text-white mb-3 font-sora">Completed Meetings</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="bms-table">
                  <thead>
                    <tr>
                      <th>Meeting</th>
                      <th>Type</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completed.map(m => {
                      const id = m._id || m.id;
                      return (
                        <tr key={id}>
                          <td className="font-medium">{m.title}</td>
                          <td className="capitalize text-xs">{m.type}</td>
                          <td className="text-xs text-text-muted">{m.clientName || 'Internal'}</td>
                          <td className="text-xs">{formatDate(m.date)} · {m.time || '10:00'}</td>
                          <td className="text-xs">{m.duration || 60} min</td>
                          <td>
                            <div className="flex items-center gap-1.5 text-emerald-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs font-medium">Completed</span>
                            </div>
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setSelectedMeeting(m)}
                                className="text-text-muted hover:text-electric p-1.5 transition-colors"
                                title="View Notes & Action Items"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(id)}
                                className="text-text-muted hover:text-rose-500 p-1.5 transition-colors"
                                title="Delete meeting"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {completed.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-text-muted">
                          No completed meetings recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Schedule Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Meeting" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Meeting Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="internal">Internal</option>
              <option value="client">Client</option>
            </Select>
            {form.type === 'client' && (
              <Select label="Client" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })}>
                <option value="">Select client</option>
                {clients.map(c => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.company || c.name}
                  </option>
                ))}
              </Select>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Date" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
            <Input label="Time" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required />
            <Input label="Duration (min)" type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Office / Zoom" />
            <Input label="Meeting Link" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
          </div>
          <Textarea label="Agenda" value={form.agenda} onChange={e => setForm({ ...form, agenda: e.target.value })} rows={3} placeholder="Meeting agenda and topics..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Scheduling...' : 'Schedule'}
            </Button>
          </div>
        </form>
      </Modal>
      {/* Meeting Notes & Action Items Modal (Requirement #14) */}
      {selectedMeeting && (
        <MeetingWorkspaceModal
          meeting={selectedMeeting}
          onClose={() => setSelectedMeeting(null)}
          employees={employees}
          onUpdated={() => refetchMeetings()}
        />
      )}
    </div>
  );
}

// ─── MEETING WORKSPACE & ACTION ITEMS CONVERTER (Requirement #14) ─────────────
function MeetingWorkspaceModal({ meeting, onClose, employees, onUpdated }) {
  const mid = meeting._id || meeting.id;
  const [notes, setNotes] = useState(meeting.notes || meeting.agenda || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedNotesNotice, setSavedNotesNotice] = useState(false);

  // Action Items State
  const initialItems = meeting.actionItems && Array.isArray(meeting.actionItems)
    ? meeting.actionItems
    : [
        { id: 'act-1', title: 'Follow up on deliverables with client team', assigneeName: 'Operations Team', dueDate: '', completed: false, convertedToTaskId: null },
      ];
  const [actionItems, setActionItems] = useState(initialItems);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemAssignee, setNewItemAssignee] = useState('');
  const [newItemDueDate, setNewItemDueDate] = useState('');
  const [convertingId, setConvertingId] = useState(null);

  // Save notes to backend
  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await meetingsAPI.update(mid, { notes, actionItems });
      setSavedNotesNotice(true);
      setTimeout(() => setSavedNotesNotice(false), 2000);
      onUpdated();
    } catch (err) {
      alert('Failed to save meeting notes');
    } finally {
      setSavingNotes(false);
    }
  };

  // Add action item
  const handleAddActionItem = async (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;
    const assigneeObj = employees.find(u => (u._id || u.id) === newItemAssignee);
    const item = {
      id: `act-${Date.now()}`,
      title: newItemTitle.trim(),
      assignee: newItemAssignee || undefined,
      assigneeName: assigneeObj?.name || 'Unassigned',
      dueDate: newItemDueDate || '',
      completed: false,
      convertedToTaskId: null,
    };
    const updated = [...actionItems, item];
    setActionItems(updated);
    setNewItemTitle('');
    setNewItemDueDate('');
    try {
      await meetingsAPI.update(mid, { actionItems: updated });
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle action item completed
  const toggleItemDone = async (itemId) => {
    const updated = actionItems.map(it => it.id === itemId ? { ...it, completed: !it.completed } : it);
    setActionItems(updated);
    try {
      await meetingsAPI.update(mid, { actionItems: updated });
    } catch (err) {
      console.error(err);
    }
  };

  // ⚡ CONVERT ACTION ITEM INTO BMS TASK (Requirement #14)
  const handleConvertToTask = async (item) => {
    setConvertingId(item.id);
    try {
      const createdTask = await tasksAPI.create({
        name: `[Meeting Action] ${item.title}`,
        description: `Generated from meeting: ${meeting.title} (${formatDate(meeting.date)})\nAssignee: ${item.assigneeName}`,
        assignee: item.assignee || undefined,
        assigneeName: item.assigneeName || 'Unassigned',
        dueDate: item.dueDate || undefined,
        priority: 'high',
        status: 'todo',
      });

      const updated = actionItems.map(it =>
        it.id === item.id ? { ...it, convertedToTaskId: createdTask?.data?._id || 'done' } : it
      );
      setActionItems(updated);
      await meetingsAPI.update(mid, { actionItems: updated });
      alert(`Action item converted into official BMS Task: "${item.title}"`);
    } catch (err) {
      alert('Failed to convert action item to task: ' + (err.message || 'Server error'));
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bms-card w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-border dark:border-navy-border overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border dark:border-navy-border bg-surface-secondary/40 dark:bg-dark-surface-secondary/40 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge status={meeting.type === 'client' ? 'info' : 'gray'}>
                  {meeting.type === 'client' ? 'Client Meeting' : 'Internal Ops'}
                </Badge>
                <span className="text-xs text-text-muted">{formatDate(meeting.date)} · {meeting.time || '10:00'} ({meeting.duration || 60}m)</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary dark:text-white font-sora">{meeting.title}</h3>
              {meeting.clientName && <p className="text-xs text-text-muted">Client: {meeting.clientName}</p>}
            </div>

            <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-surface-tertiary">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          {/* Notes & Minutes Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-electric" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted">Meeting Notes & Discussion Minutes</h4>
              </div>
              <Button size="sm" onClick={handleSaveNotes} disabled={savingNotes}>
                <Save className="w-3.5 h-3.5 mr-1" /> {savedNotesNotice ? '✓ Saved!' : (savingNotes ? 'Saving...' : 'Save Notes')}
              </Button>
            </div>
            <textarea
              rows={4}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Record key talking points, decisions reached, and meeting recap here..."
              className="w-full text-xs p-3 rounded-xl border border-border dark:border-navy-border bg-white dark:bg-dark-surface-secondary text-text-primary dark:text-white outline-none focus:border-electric resize-y leading-relaxed"
            />
          </div>

          {/* Action Items Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted">Action Items & Task Conversion</h4>
              </div>
              <span className="text-[11px] text-text-muted">{actionItems.length} action item{actionItems.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Add action item form */}
            <form onSubmit={handleAddActionItem} className="p-3 border border-border dark:border-navy-border rounded-xl bg-surface-secondary/40 dark:bg-dark-surface-secondary/40 space-y-2">
              <div className="flex gap-2">
                <input
                  value={newItemTitle}
                  onChange={e => setNewItemTitle(e.target.value)}
                  placeholder="New action item or deliverable..."
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-border dark:border-navy-border bg-white dark:bg-dark-surface-card text-text-primary dark:text-white outline-none focus:border-electric"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={newItemAssignee}
                  onChange={e => setNewItemAssignee(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-border dark:border-navy-border bg-white dark:bg-dark-surface-card text-text-primary dark:text-white outline-none cursor-pointer"
                >
                  <option value="">Assign To...</option>
                  {employees.map(u => (
                    <option key={u._id || u.id} value={u._id || u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newItemDueDate}
                  onChange={e => setNewItemDueDate(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-border dark:border-navy-border bg-white dark:bg-dark-surface-card text-text-primary dark:text-white outline-none"
                />
                <Button type="submit" size="sm" className="whitespace-nowrap">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Action
                </Button>
              </div>
            </form>

            {/* Action items list */}
            <div className="space-y-2">
              {actionItems.map(item => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    item.completed
                      ? 'bg-surface-secondary/40 border-border opacity-70'
                      : 'bg-white dark:bg-dark-surface-secondary border-border dark:border-navy-border'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 pr-3">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItemDone(item.id)}
                      className="rounded text-electric focus:ring-electric cursor-pointer"
                    />
                    <div>
                      <p className={`font-semibold ${item.completed ? 'line-through text-text-muted' : 'text-text-primary dark:text-white'}`}>
                        {item.title}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        Assignee: <span className="font-medium text-text-primary dark:text-white">{item.assigneeName || 'Unassigned'}</span>
                        {item.dueDate && <span> · Due: {item.dueDate}</span>}
                      </p>
                    </div>
                  </div>

                  <div>
                    {item.convertedToTaskId ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        ✓ In Task Board
                      </span>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="!text-[11px] !py-1 px-2.5 whitespace-nowrap bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/30"
                        onClick={() => handleConvertToTask(item)}
                        disabled={convertingId === item.id}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        {convertingId === item.id ? 'Converting...' : 'Convert to Task ⚡'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
