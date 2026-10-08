import { useState, useMemo } from 'react';
import {
  Users, Briefcase, CheckSquare, TrendingUp, AlertTriangle,
  Clock, DollarSign, Wallet, ArrowUpRight, ArrowDownRight,
  ChevronRight, Calendar, UserCheck, AlertCircle, CheckCircle2,
  Receipt, CreditCard, Activity, Bell
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Link } from 'react-router-dom';
import { Card, Badge, ProgressBar, Avatar, Spinner } from '../../components/ui';
import { formatCurrency, formatDate, daysUntil, timeAgo } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI, projectsAPI, tasksAPI, meetingsAPI, clientsAPI, invoicesAPI, paymentsAPI, activitiesAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export default function Dashboard() {
  const { user } = useAuth();
  const userRole = user?.role || 'employee';
  const canViewFinance = ['super_admin', 'admin', 'accountant'].includes(userRole);

  const { data: dashData, loading: dashLoading } = useApi(() => dashboardAPI.getStats());
  const { data: projectsData } = useApi(() => projectsAPI.getAll({ limit: 20 }));
  const { data: tasksData } = useApi(() => tasksAPI.getAll({ limit: 30 }));
  const { data: meetingsData } = useApi(() => meetingsAPI.getAll({ status: 'upcoming', limit: 5, sort: 'date' }));
  const { data: clientsData } = useApi(() => clientsAPI.getAll({ limit: 5 }));
  const { data: invoicesData } = useApi(() => invoicesAPI.getAll({ limit: 5 }));
  const { data: paymentsData } = useApi(() => paymentsAPI.getAll({ limit: 5 }));
  const { data: activitiesData } = useApi(() => activitiesAPI.getAll({ limit: 10 }));

  const stats = dashData?.data?.stats || {};
  const chartData = dashData?.data?.chartData || [];
  const allProjects = projectsData?.data || [];
  const allTasks = tasksData?.data || [];
  const activeProjects = allProjects.filter(p => p.status === 'active').slice(0, 5);
  const recentTasks = allTasks.slice(0, 5);
  const upcomingMeetings = meetingsData?.data || [];
  const recentClients = clientsData?.data || [];
  const recentInvoices = invoicesData?.data || [];
  const recentPayments = paymentsData?.data || [];
  const activityLogs = activitiesData?.data || [];

  const currentYear = new Date().getFullYear();
  const totalRev = stats.totalRevenue ?? chartData.reduce((acc, c) => acc + (c.revenue || 0), 0);
  const totalExp = stats.totalExpenses ?? chartData.reduce((acc, c) => acc + (c.expenses || 0), 0);
  const netProfit = stats.netProfit ?? (totalRev - totalExp);
  const totalTasksCount = stats.totalTasks || (stats.todoTasks || 0) + (stats.inProgressTasks || 0) + (stats.reviewTasks || 0) + (stats.completedTasks || 0) || 1;

  // Derived chart data for donut
  const projectStatusData = [
    { name: 'Active', value: stats.activeProjects || 0, color: '#2563EB' },
    { name: 'Completed', value: stats.completedProjects || 0, color: '#10B981' },
    { name: 'On Hold', value: stats.onHoldProjects || 0, color: '#F59E0B' },
    { name: 'Planning', value: stats.planningProjects || 0, color: '#06B6D4' },
  ];

  const taskStatusData = [
    { name: 'To Do', value: stats.todoTasks || 0, color: '#94A3B8' },
    { name: 'In Progress', value: stats.inProgressTasks || 0, color: '#2563EB' },
    { name: 'Review', value: stats.reviewTasks || 0, color: '#F59E0B' },
    { name: 'Completed', value: stats.completedTasks || 0, color: '#10B981' },
  ];

  if (dashLoading) return (
    <div className="flex items-center justify-center h-64">
      <Spinner size="lg" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="page-title">Dashboard</h1>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-electric/10 text-electric border border-electric/20">
              {userRole.replace('_', ' ')}
            </span>
          </div>
          <p className="page-subtitle">Welcome back, {user?.name}. Here's your workspace overview for today.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted bg-surface-tertiary dark:bg-dark-surface-secondary px-3 py-2 rounded-lg">
          <Clock className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards */}
      {canViewFinance ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={UserCheck} label="Total Clients" value={stats.totalClients ?? '—'} color="blue" />
          <StatCard icon={Briefcase} label="Active Projects" value={stats.activeProjects ?? '—'} color="cyan" />
          <StatCard icon={CheckSquare} label="Pending Tasks" value={stats.pendingTasks ?? '—'} color="amber" />
          <StatCard icon={CheckSquare} label="Completed Tasks" value={stats.completedTasks ?? '—'} color="green" />
          <StatCard icon={TrendingUp} label="Monthly Revenue" value={stats.monthlyRevenue != null ? formatCurrency(stats.monthlyRevenue) : '—'} color="green" />
          <StatCard icon={AlertTriangle} label="Pending Payments" value={stats.pendingPayments != null ? formatCurrency(stats.pendingPayments) : '—'} color="amber" />
          <StatCard icon={Wallet} label="Monthly Expenses" value={stats.monthlyExpenses != null ? formatCurrency(stats.monthlyExpenses) : '—'} color="red" />
          <StatCard icon={Users} label="Active Employees" value={stats.activeEmployees ?? '—'} color="purple" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Briefcase} label="Active Projects" value={stats.activeProjects ?? '—'} color="blue" />
          <StatCard icon={Clock} label="In Progress Tasks" value={stats.inProgressTasks ?? '—'} color="cyan" />
          <StatCard icon={AlertTriangle} label="Tasks In Review" value={stats.reviewTasks ?? '—'} color="amber" />
          <StatCard icon={CheckSquare} label="Completed Tasks" value={stats.completedTasks ?? '—'} color="green" />
        </div>
      )}

      {/* Charts Row */}
      {canViewFinance ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ---- Premium Revenue Chart ---- */}
          <div className="lg:col-span-2">
            <Card className="p-0 overflow-hidden">
              {/* Header with gradient background */}
              <div className="relative px-6 pt-5 pb-4"
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
                <div className="absolute top-0 right-0 w-48 h-24 rounded-full opacity-20 blur-3xl"
                  style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />
                <div className="absolute bottom-0 left-1/3 w-32 h-16 rounded-full opacity-15 blur-2xl"
                  style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

                <div className="relative flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white font-sora text-base">Financial Overview</h3>
                    <p className="text-slate-400 text-xs mt-0.5">Revenue · Expenses · Net Profit — {currentYear}</p>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Revenue</p>
                      <p className="text-sm font-bold text-emerald-400 font-sora">{formatCurrency(totalRev)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Total Expenses</p>
                      <p className="text-sm font-bold text-red-400 font-sora">{formatCurrency(totalExp)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">Net Profit</p>
                      <p className="text-sm font-bold text-cyan-400 font-sora">{formatCurrency(netProfit)}</p>
                    </div>
                  </div>
                </div>

                {/* Legend pills */}
                <div className="flex gap-3 mt-3 relative">
                  {[
                    { color: '#2563EB', label: 'Revenue', dot: true },
                    { color: '#EF4444', label: 'Expenses', dot: true },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
                      <span className="text-[11px] text-slate-400">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="px-2 pb-4 pt-2 bg-white dark:bg-dark-surface-secondary">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, bottom: 0, left: -10 }}
                    barCategoryGap="30%"
                    barGap={4}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.08)" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#94A3B8' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip formatter={v => formatCurrency(v)} />
                    <Bar dataKey="revenue" name="Revenue" fill="#2563EB" radius={[5, 5, 0, 0]} maxBarSize={28} />
                    <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[5, 5, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Project + Task Status */}
          <div className="space-y-4">
            <Card className="p-5">
              <h3 className="font-bold text-text-primary dark:text-white font-sora mb-4">Project Status</h3>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                    {projectStatusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
                {projectStatusData.map(item => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-[11px] text-text-muted">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-bold text-text-primary dark:text-white font-sora mb-4">Task Progress</h3>
              <div className="space-y-3">
                {taskStatusData.map(item => (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-secondary dark:text-slate-400">{item.name}</span>
                      <span className="font-semibold text-text-primary dark:text-white">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-surface-tertiary dark:bg-dark-surface-secondary rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.round((item.value / totalTasksCount) * 100))}%`, background: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Non-financial role: Developer/Designer sprint layout */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="font-bold text-text-primary dark:text-white font-sora mb-4">Project Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="value">
                  {projectStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val, name) => [val, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
              {projectStatusData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-text-secondary dark:text-slate-300 font-medium">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-primary dark:text-white font-sora">Task Velocity & Sprint Breakdown</h3>
              <Link to="/tasks" className="text-xs text-electric hover:underline flex items-center gap-1">
                Go to Billboard <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {taskStatusData.map(item => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-text-secondary dark:text-slate-400 font-medium">{item.name}</span>
                    <span className="font-bold text-text-primary dark:text-white">{item.value} tasks</span>
                  </div>
                  <div className="h-2 bg-surface-tertiary dark:bg-dark-surface-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((item.value / totalTasksCount) * 100))}%`, background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Projects */}
        <div className="lg:col-span-2">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-primary dark:text-white font-sora">Active Projects</h3>
              <Link to="/projects" className="text-xs text-electric hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {activeProjects.map(project => (
                <div key={project._id || project.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-electric" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm text-text-primary dark:text-white truncate">{project.name}</span>
                      <Badge status={project.status}>{project.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-xs text-text-muted mb-2">{project.clientName} · Due {formatDate(project.deadline)}</p>
                    <div className="flex items-center gap-3">
                      <ProgressBar value={project.progress} className="flex-1 h-1.5" />
                      <span className="text-xs font-semibold text-electric w-10 text-right">{project.progress}%</span>
                    </div>
                  </div>
                </div>
              ))}
              {activeProjects.length === 0 && (
                <p className="text-xs text-text-muted text-center py-6">No active projects found.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Upcoming Meetings */}
        <div>
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-text-primary dark:text-white font-sora">Upcoming Meetings</h3>
              <Link to="/meetings" className="text-xs text-electric hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingMeetings.map(meeting => (
                <div key={meeting._id || meeting.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-secondary dark:bg-dark-surface-secondary">
                  <div className="w-8 h-8 rounded-lg bg-electric/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-electric" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary dark:text-white truncate">{meeting.title}</p>
                    <p className="text-[11px] text-text-muted">{formatDate(meeting.date)} · {meeting.time || '10:00'}</p>
                    <p className="text-[11px] text-text-muted truncate">{meeting.location || 'Online'}</p>
                  </div>
                </div>
              ))}
              {upcomingMeetings.length === 0 && (
                <p className="text-xs text-text-muted text-center py-6">No upcoming meetings.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Tasks */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text-primary dark:text-white font-sora">Recent Tasks</h3>
          <Link to="/tasks" className="text-xs text-electric hover:underline flex items-center gap-1">
            Billboard <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
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
              </tr>
            </thead>
            <tbody>
              {recentTasks.map(task => (
                <tr key={task._id || task.id}>
                  <td className="font-medium text-xs text-text-primary dark:text-white">{task.name}</td>
                  <td className="text-xs text-text-muted">{task.projectName || '—'}</td>
                  <td className="text-xs">{task.assigneeName || 'Unassigned'}</td>
                  <td>
                    <Badge status={task.priority} className="!text-[10px]">{task.priority}</Badge>
                  </td>
                  <td>
                    <Badge status={task.status} className="!text-[10px]">{task.status.replace('_', ' ')}</Badge>
                  </td>
                  <td className="text-xs text-text-muted">{formatDate(task.dueDate)}</td>
                </tr>
              ))}
              {recentTasks.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-text-muted text-xs">
                    No recent tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-500',
    cyan: 'bg-cyan-500/10 text-cyan-500',
    green: 'bg-emerald-500/10 text-emerald-500',
    amber: 'bg-amber-500/10 text-amber-500',
    red: 'bg-rose-500/10 text-rose-500',
    purple: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <Card className="p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color] || colors.blue}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-text-muted truncate">{label}</p>
        <p className="text-xl font-bold font-sora text-text-primary dark:text-white truncate mt-0.5">{value}</p>
      </div>
    </Card>
  );
}
