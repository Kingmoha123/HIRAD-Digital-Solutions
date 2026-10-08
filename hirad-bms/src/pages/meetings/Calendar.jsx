import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Clock } from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Select, Textarea, Spinner } from '../../components/ui';
import { meetingsAPI, tasksAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'meeting',
    description: '',
  });

  const { data: meetingsRes, loading: loadingMeetings, refetch: refetchMeetings } = useApi(() => meetingsAPI.getAll({ limit: 200 }));
  const { data: tasksRes, loading: loadingTasks } = useApi(() => tasksAPI.getAll({ limit: 200 }));

  const meetings = meetingsRes?.data || [];
  const tasks = tasksRes?.data || [];

  const daysInMonth = getDaysInMonth(current.year, current.month);
  const firstDay = getFirstDayOfMonth(current.year, current.month);

  const prevMonth = () => {
    if (current.month === 0) setCurrent({ year: current.year - 1, month: 11 });
    else setCurrent({ ...current, month: current.month - 1 });
  };

  const nextMonth = () => {
    if (current.month === 11) setCurrent({ year: current.year + 1, month: 0 });
    else setCurrent({ ...current, month: current.month + 1 });
  };

  const getEventsForDay = (day) => {
    const monthStr = String(current.month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const datePrefix = `${current.year}-${monthStr}-${dayStr}`;

    const dayMeetings = meetings.filter(m => {
      const d = m.date ? (typeof m.date === 'string' ? m.date.slice(0, 10) : new Date(m.date).toISOString().slice(0, 10)) : '';
      return d === datePrefix;
    });

    const dayDeadlines = tasks.filter(t => {
      const d = t.dueDate ? (typeof t.dueDate === 'string' ? t.dueDate.slice(0, 10) : new Date(t.dueDate).toISOString().slice(0, 10)) : '';
      return d === datePrefix;
    });

    return { meetings: dayMeetings, deadlines: dayDeadlines };
  };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate) : null;

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await meetingsAPI.create({
        title: eventForm.title,
        date: eventForm.date,
        time: eventForm.time,
        agenda: eventForm.description,
        type: eventForm.type === 'meeting' ? 'internal' : 'other',
        status: 'upcoming',
      });
      setModalOpen(false);
      setEventForm({
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        type: 'meeting',
        description: '',
      });
      refetchMeetings();
    } catch (err) {
      console.error('Failed to create event:', err);
      alert('Error creating event: ' + (err.message || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  const upcomingMeetings = meetings
    .filter(m => m.status === 'upcoming')
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">Meetings, deadlines, and live operational schedule</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-text-primary dark:text-white font-sora">
                {MONTHS[current.month]} {current.year}
              </h3>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary text-text-secondary">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrent({ year: today.getFullYear(), month: today.getMonth() })}
                  className="px-3 py-1 text-xs font-semibold text-electric hover:bg-electric/10 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary text-text-secondary">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loadingMeetings || loadingTasks ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAYS.map(d => (
                    <div key={d} className="text-center text-[11px] font-semibold text-text-muted py-2">{d}</div>
                  ))}
                </div>

                {/* Day Cells */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {/* Days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();
                    const isSelected = day === selectedDate;
                    const { meetings: dayMeetings, deadlines } = getEventsForDay(day);

                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedDate(day === selectedDate ? null : day)}
                        className={`min-h-[68px] p-1.5 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'border-electric bg-electric/10'
                            : 'border-transparent hover:border-border dark:hover:border-navy-border hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary'
                        }`}
                      >
                        <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full mx-auto ${
                          isToday ? 'bg-electric text-white' : 'text-text-primary dark:text-white'
                        }`}>
                          {day}
                        </span>
                        <div className="mt-1 space-y-0.5">
                          {dayMeetings.slice(0, 1).map(m => (
                            <div key={m._id || m.id} className="text-[9px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1 py-0.5 rounded truncate">
                              📅 {m.title}
                            </div>
                          ))}
                          {deadlines.slice(0, 1).map(t => (
                            <div key={t._id || t.id} className="text-[9px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1 py-0.5 rounded truncate">
                              ⏰ {t.name}
                            </div>
                          ))}
                          {(dayMeetings.length + deadlines.length) > 2 && (
                            <div className="text-[9px] text-text-muted px-1">+{dayMeetings.length + deadlines.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected day events */}
          {selectedDate && selectedEvents && (
            <Card className="p-4">
              <h3 className="font-bold text-text-primary dark:text-white mb-3 font-sora">
                {MONTHS[current.month]} {selectedDate}
              </h3>
              {selectedEvents.meetings.length === 0 && selectedEvents.deadlines.length === 0 && (
                <p className="text-xs text-text-muted text-center py-4">No events scheduled on this day</p>
              )}
              {selectedEvents.meetings.map(m => (
                <div key={m._id || m.id} className="flex gap-3 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 mb-2">
                  <CalIcon className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-text-primary dark:text-white">{m.title}</p>
                    <p className="text-[11px] text-text-muted">{m.time || '10:00'} · {m.duration || 60} min</p>
                    <p className="text-[11px] text-text-muted">{m.location || 'Online'}</p>
                  </div>
                </div>
              ))}
              {selectedEvents.deadlines.map(t => (
                <div key={t._id || t.id} className="flex gap-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 mb-2">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-text-primary dark:text-white">{t.name}</p>
                    <p className="text-[11px] text-text-muted">Task deadline</p>
                    <Badge status={t.priority || 'medium'} className="mt-1 !text-[9px]">{t.priority || 'normal'}</Badge>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {/* Upcoming Events */}
          <Card className="p-4">
            <h3 className="font-bold text-text-primary dark:text-white mb-3 font-sora">Upcoming Meetings</h3>
            <div className="space-y-3">
              {upcomingMeetings.map(m => {
                const dateObj = new Date(m.date);
                const dayNum = isNaN(dateObj.getDate()) ? '1' : dateObj.getDate();
                const dStr = m.date ? (typeof m.date === 'string' ? m.date.slice(0, 10) : dateObj.toISOString().slice(0, 10)) : '';
                return (
                  <div key={m._id || m.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-electric/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[11px] font-bold text-electric">{dayNum}</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary dark:text-white">{m.title}</p>
                      <p className="text-[11px] text-text-muted">{dStr} · {m.time || '10:00'}</p>
                    </div>
                  </div>
                );
              })}
              {upcomingMeetings.length === 0 && (
                <p className="text-xs text-text-muted text-center py-4">No upcoming meetings</p>
              )}
            </div>
          </Card>

          {/* Legend */}
          <Card className="p-4">
            <h3 className="font-bold text-text-primary dark:text-white mb-3 text-sm font-sora">Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-400" />
                <span className="text-xs text-text-muted">Meetings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-amber-400" />
                <span className="text-xs text-text-muted">Task Deadlines</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-electric" />
                <span className="text-xs text-text-muted">Today</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Event">
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <Input
            label="Event Title *"
            value={eventForm.title}
            onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
            placeholder="Team meeting, review..."
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date *"
              type="date"
              value={eventForm.date}
              onChange={e => setEventForm({ ...eventForm, date: e.target.value })}
              required
            />
            <Input
              label="Time *"
              type="time"
              value={eventForm.time}
              onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
              required
            />
          </div>
          <Select
            label="Type"
            value={eventForm.type}
            onChange={e => setEventForm({ ...eventForm, type: e.target.value })}
          >
            <option value="meeting">Meeting</option>
            <option value="event">Event</option>
          </Select>
          <Textarea
            label="Description / Agenda"
            value={eventForm.description}
            onChange={e => setEventForm({ ...eventForm, description: e.target.value })}
            rows={2}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
