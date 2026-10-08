import { useState, useMemo } from 'react';
import { Download, Users, Briefcase, CheckSquare, DollarSign, Clock, UserCheck, Calendar, Filter } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Card, Button, Spinner, Avatar, Badge } from '../../components/ui';
import { projectsAPI, clientsAPI, tasksAPI, expensesAPI, invoicesAPI, dashboardAPI, employeesAPI, timeAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { formatCurrency, formatDate } from '../../utils/helpers';

const REPORT_TYPES = [
  { id: 'financial', label: 'Financial Reports', icon: DollarSign },
  { id: 'projects', label: 'Project Reports', icon: Briefcase },
  { id: 'clients', label: 'Client Reports', icon: Users },
  { id: 'tasks', label: 'Task Reports', icon: CheckSquare },
  { id: 'employees', label: 'Employee & Time Reports', icon: Clock },
];

const COLORS = ['#2563EB', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

function ProjectReports({ projects }) {
  const activeCount = projects.filter(p => p.status === 'active').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;
  const onHoldCount = projects.filter(p => p.status === 'on_hold').length;

  const progressData = projects.slice(0, 10).map(p => ({
    name: p.name?.split(' ').slice(0, 2).join(' ') || 'Project',
    progress: p.progress || 0,
    budget: p.budget || 0,
    spent: p.spent || 0,
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Projects', value: projects.length, color: 'text-electric' },
          { label: 'Active', value: activeCount, color: 'text-emerald-600' },
          { label: 'Completed', value: completedCount, color: 'text-cyan-600' },
          { label: 'On Hold', value: onHoldCount, color: 'text-amber-600' },
        ].map(stat => (
          <Card key={stat.label} className="p-4 text-center">
            <p className={`text-2xl font-bold font-sora ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-text-muted mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h4 className="font-bold text-text-primary dark:text-white mb-4 font-sora">Project Progress Overview</h4>
        {progressData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={progressData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="progress" name="Progress %" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-text-muted text-center py-8">No project progress data recorded yet.</p>
        )}
      </Card>

      <Card className="p-5">
        <h4 className="font-bold text-text-primary dark:text-white mb-4 font-sora">Budget vs Spent</h4>
        {progressData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => formatCurrency(v)} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="budget" name="Budget" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" name="Spent" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-text-muted text-center py-8">No budget metrics available.</p>
        )}
      </Card>
    </div>
  );
}

function FinancialReports({ invoices, expenses, stats }) {
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const netIncome = totalRevenue - totalExpenses;
  const outstanding = invoices.filter(i => ['sent', 'partially_paid'].includes(i.status)).reduce((s, i) => s + (i.total || 0), 0);

  const categories = ['office', 'internet', 'software', 'transportation', 'marketing', 'equipment', 'other'];
  const expByCategory = categories.map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: expenses.filter(e => e.category === cat).reduce((s, e) => s + (e.amount || 0), 0),
  })).filter(c => c.value > 0);

  const monthlyChartData = stats?.chartData || stats?.monthlyChart || [];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), color: 'text-emerald-600' },
          { label: 'Total Expenses', value: formatCurrency(totalExpenses), color: 'text-red-500' },
          { label: 'Net Income', value: formatCurrency(netIncome), color: netIncome >= 0 ? 'text-emerald-600' : 'text-red-500' },
          { label: 'Outstanding Invoices', value: formatCurrency(outstanding), color: 'text-amber-600' },
        ].map(stat => (
          <Card key={stat.label} className="p-4 text-center">
            <p className={`text-xl font-bold font-sora ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-text-muted mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h4 className="font-bold text-text-primary dark:text-white mb-4 font-sora">Revenue vs Expenses (Monthly)</h4>
          {monthlyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => formatCurrency(v)} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#2563EB" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-text-muted text-center py-8">No monthly transaction data available.</p>
          )}
        </Card>

        <Card className="p-5">
          <h4 className="font-bold text-text-primary dark:text-white mb-4 font-sora">Expenses by Category</h4>
          {expByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={expByCategory} cx="50%" cy="50%" outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {expByCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-text-muted text-center py-8">No categorised expense data recorded.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

function TaskReports({ tasks }) {
  const statuses = ['todo', 'in_progress', 'review', 'completed'];
  const taskData = statuses.map(s => ({
    name: s.replace('_', ' '),
    count: tasks.filter(t => t.status === s).length,
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {taskData.map((s, i) => (
          <Card key={s.name} className="p-4 text-center">
            <p className="text-2xl font-bold font-sora" style={{ color: COLORS[i] }}>{s.count}</p>
            <p className="text-xs text-text-muted mt-1 capitalize">{s.name}</p>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h4 className="font-bold text-text-primary dark:text-white mb-4 font-sora">Tasks by Status</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={taskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="count" name="Tasks" radius={[4, 4, 0, 0]}>
              {taskData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function ClientReports({ clients }) {
  const clientRevenue = clients
    .map(c => ({
      name: c.company || c.name || 'Client',
      revenue: c.totalRevenue || 0,
      projects: c.activeProjects || 0,
    }))
    .filter(c => c.revenue > 0)
    .slice(0, 10);

  const activeClients = clients.filter(c => c.status === 'active').length;
  const leadClients = clients.filter(c => c.status === 'lead').length;
  const totalClientRev = clients.reduce((s, c) => s + (c.totalRevenue || 0), 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: clients.length },
          { label: 'Active', value: activeClients },
          { label: 'Leads', value: leadClients },
          { label: 'Total Revenue', value: formatCurrency(totalClientRev) },
        ].map(stat => (
          <Card key={stat.label} className="p-4 text-center">
            <p className="text-xl font-bold text-electric font-sora">{stat.value}</p>
            <p className="text-xs text-text-muted mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>
      <Card className="p-5">
        <h4 className="font-bold text-text-primary dark:text-white mb-4 font-sora">Revenue by Client</h4>
        {clientRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={clientRevenue} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip formatter={v => formatCurrency(v)} />
              <Bar dataKey="revenue" name="Revenue" fill="#2563EB" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-text-muted text-center py-8">No recorded client revenue yet.</p>
        )}
      </Card>
    </div>
  );
}

function EmployeeReports({ employees, timeEntries, tasks }) {
  const totalHours = timeEntries.reduce((acc, t) => acc + (Number(t.hours) || 0), 0);
  const billableHours = timeEntries.filter(t => t.billable !== false).reduce((acc, t) => acc + (Number(t.hours) || 0), 0);
  const activeStaff = employees.filter(e => e.status !== 'inactive');

  // Hours per employee
  const staffHoursMap = {};
  timeEntries.forEach(t => {
    const name = t.userName || t.user?.name || 'Staff';
    staffHoursMap[name] = (staffHoursMap[name] || 0) + (Number(t.hours) || 0);
  });

  const staffHoursData = Object.entries(staffHoursMap).map(([name, hours]) => ({
    name: name.split(' ')[0],
    fullName: name,
    hours,
  })).sort((a, b) => b.hours - a.hours).slice(0, 10);

  // Department distribution
  const deptMap = {};
  employees.forEach(e => {
    const dept = e.department || 'General';
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });

  const deptData = Object.entries(deptMap).map(([dept, count]) => ({
    name: dept,
    value: count,
  }));

  // Tasks completed per employee
  const staffCompletedTasks = {};
  tasks.filter(t => t.status === 'completed').forEach(t => {
    const name = t.assigneeName || 'Unassigned';
    staffCompletedTasks[name] = (staffCompletedTasks[name] || 0) + 1;
  });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Team Members', value: activeStaff.length, color: 'text-electric' },
          { label: 'Total Logged Hours', value: `${totalHours.toFixed(1)} hrs`, color: 'text-emerald-600' },
          { label: 'Billable Hours', value: `${billableHours.toFixed(1)} hrs`, color: 'text-cyan-600' },
          { label: 'Tasks Completed', value: tasks.filter(t => t.status === 'completed').length, color: 'text-amber-600' },
        ].map(stat => (
          <Card key={stat.label} className="p-4 text-center">
            <p className={`text-2xl font-bold font-sora ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-text-muted mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <h4 className="font-bold text-text-primary dark:text-white mb-4 font-sora">Hours Logged by Employee</h4>
          {staffHoursData.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={staffHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} unit="h" />
                <Tooltip formatter={(v) => [`${v} hours`, 'Logged Time']} />
                <Bar dataKey="hours" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-text-muted text-xs">
              No time entries logged yet. Employees can record hours under Time Tracking.
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h4 className="font-bold text-text-primary dark:text-white mb-4 font-sora">Team by Department</h4>
          {deptData.length > 0 ? (
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={deptData} cx="50%" cy="50%" outerRadius={75} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                  {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-text-muted text-xs">No department data recorded.</div>
          )}
        </Card>
      </div>

      {/* Staff Productivity Table */}
      <Card className="p-5">
        <h4 className="font-bold text-text-primary dark:text-white mb-4 font-sora">Team Productivity Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="bms-table w-full text-xs">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Role</th>
                <th>Tasks Completed</th>
                <th>Logged Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const eid = emp._id || emp.id;
                const hours = staffHoursMap[emp.name] || 0;
                const completed = staffCompletedTasks[emp.name] || 0;
                return (
                  <tr key={eid}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={emp.name} size="xs" />
                        <div>
                          <p className="font-semibold text-text-primary dark:text-white">{emp.name}</p>
                          <p className="text-[10px] text-text-muted">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{emp.department || 'General'}</td>
                    <td className="capitalize text-text-muted">{emp.position || emp.role?.replace('_', ' ')}</td>
                    <td className="font-semibold text-emerald-600">{completed}</td>
                    <td className="font-semibold text-electric">{hours > 0 ? `${hours.toFixed(1)} hrs` : '—'}</td>
                    <td><Badge status={emp.status || 'active'}>{emp.status || 'active'}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default function Reports() {
  const [activeReport, setActiveReport] = useState('financial');
  const [dateRange, setDateRange] = useState('all');

  const { data: statsRes, loading: loadingStats } = useApi(dashboardAPI.getStats);
  const { data: projectsRes, loading: loadingProjects } = useApi(() => projectsAPI.getAll({ limit: 200 }));
  const { data: clientsRes, loading: loadingClients } = useApi(() => clientsAPI.getAll({ limit: 200 }));
  const { data: tasksRes, loading: loadingTasks } = useApi(() => tasksAPI.getAll({ limit: 200 }));
  const { data: expensesRes, loading: loadingExpenses } = useApi(() => expensesAPI.getAll({ limit: 200 }));
  const { data: invoicesRes, loading: loadingInvoices } = useApi(() => invoicesAPI.getAll({ limit: 200 }));
  const { data: employeesRes, loading: loadingEmployees } = useApi(() => employeesAPI.getAll({ limit: 100 }));
  const { data: timeRes, loading: loadingTime } = useApi(() => timeAPI.getAll({ limit: 200 }));

  const isLoading = loadingStats || loadingProjects || loadingClients || loadingTasks || loadingExpenses || loadingInvoices || loadingEmployees || loadingTime;

  const stats = statsRes?.data;
  const rawProjects = projectsRes?.data || [];
  const rawClients = clientsRes?.data || [];
  const rawTasks = tasksRes?.data || [];
  const rawExpenses = expensesRes?.data || [];
  const rawInvoices = invoicesRes?.data || [];
  const employees = employeesRes?.data || [];
  const rawTime = timeRes?.data || [];

  // Date filtering logic
  const filterByDate = (items, dateField = 'createdAt') => {
    if (dateRange === 'all') return items;
    const now = new Date();
    const cutoff = new Date();
    if (dateRange === '30days') cutoff.setDate(now.getDate() - 30);
    else if (dateRange === 'thisMonth') cutoff.setDate(1);
    else if (dateRange === 'quarter') cutoff.setMonth(now.getMonth() - 3);
    else if (dateRange === 'year') cutoff.setFullYear(now.getFullYear(), 0, 1);

    return items.filter(item => {
      const d = item[dateField] ? new Date(item[dateField]) : null;
      return d && d >= cutoff;
    });
  };

  const projects = useMemo(() => filterByDate(rawProjects), [rawProjects, dateRange]);
  const clients = useMemo(() => filterByDate(rawClients), [rawClients, dateRange]);
  const tasks = useMemo(() => filterByDate(rawTasks), [rawTasks, dateRange]);
  const expenses = useMemo(() => filterByDate(rawExpenses, 'date'), [rawExpenses, dateRange]);
  const invoices = useMemo(() => filterByDate(rawInvoices, 'issueDate'), [rawInvoices, dateRange]);
  const timeEntries = useMemo(() => filterByDate(rawTime, 'date'), [rawTime, dateRange]);

  const handleExportCSV = () => {
    let headers = [];
    let rows = [];
    const dateStr = new Date().toISOString().slice(0, 10);

    if (activeReport === 'financial') {
      headers = ['Type', 'Number/Title', 'Client/Category', 'Amount', 'Status', 'Date'];
      rows = [
        ...invoices.map(i => [`"Invoice"`, `"${i.number}"`, `"${i.clientName || ''}"`, `"${i.total || 0}"`, `"${i.status}"`, `"${i.issueDate || ''}"`]),
        ...expenses.map(e => [`"Expense"`, `"${e.title}"`, `"${e.category}"`, `"-${e.amount || 0}"`, `"${e.status || 'approved'}"`, `"${e.date || ''}"`])
      ];
    } else if (activeReport === 'projects') {
      headers = ['Project Name', 'Client', 'Service', 'Status', 'Progress', 'Budget', 'Spent', 'Deadline'];
      rows = projects.map(p => [
        `"${p.name}"`, `"${p.clientName || ''}"`, `"${p.service || ''}"`, `"${p.status}"`, `"${p.progress || 0}%"`, `"${p.budget || 0}"`, `"${p.spent || 0}"`, `"${p.deadline || ''}"`
      ]);
    } else if (activeReport === 'clients') {
      headers = ['Company', 'Contact Person', 'Email', 'Phone', 'Industry', 'Status', 'Total Revenue'];
      rows = clients.map(c => [
        `"${c.company || c.name}"`, `"${c.name}"`, `"${c.email}"`, `"${c.phone || ''}"`, `"${c.industry || ''}"`, `"${c.status}"`, `"${c.totalRevenue || 0}"`
      ]);
    } else if (activeReport === 'tasks') {
      headers = ['Task Name', 'Project', 'Assignee', 'Priority', 'Status', 'Due Date'];
      rows = tasks.map(t => [
        `"${t.name}"`, `"${t.projectName || ''}"`, `"${t.assigneeName || ''}"`, `"${t.priority}"`, `"${t.status}"`, `"${t.dueDate || ''}"`
      ]);
    } else if (activeReport === 'employees') {
      headers = ['Employee Name', 'Email', 'Department', 'Position', 'Role', 'Status'];
      rows = employees.map(e => [
        `"${e.name}"`, `"${e.email}"`, `"${e.department || ''}"`, `"${e.position || ''}"`, `"${e.role || ''}"`, `"${e.status || 'active'}"`
      ]);
    }

    if (rows.length === 0) {
      alert('No data available to export for the current selection.');
      return;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HIRAD_${activeReport.toUpperCase()}_REPORT_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderReport = () => {
    switch (activeReport) {
      case 'projects': return <ProjectReports projects={projects} />;
      case 'financial': return <FinancialReports invoices={invoices} expenses={expenses} stats={stats} />;
      case 'tasks': return <TaskReports tasks={tasks} />;
      case 'clients': return <ClientReports clients={clients} />;
      case 'employees': return <EmployeeReports employees={employees} timeEntries={timeEntries} tasks={tasks} />;
      default: return <FinancialReports invoices={invoices} expenses={expenses} stats={stats} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Real-time business performance insights connected to live database</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date range dropdown */}
          <div className="flex items-center gap-1.5 bg-surface-tertiary dark:bg-dark-surface-secondary px-3 py-1.5 rounded-lg border border-border dark:border-navy-border text-xs">
            <Calendar className="w-3.5 h-3.5 text-text-muted" />
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="bg-transparent text-text-primary dark:text-white outline-none cursor-pointer"
            >
              <option value="all">All Time</option>
              <option value="30days">Last 30 Days</option>
              <option value="thisMonth">This Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>

          <Button variant="secondary" size="sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex flex-wrap gap-2">
        {REPORT_TYPES.map(rt => (
          <button
            key={rt.id}
            onClick={() => setActiveReport(rt.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeReport === rt.id
                ? 'bg-electric text-white shadow-lg'
                : 'bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary dark:text-slate-400 hover:bg-surface-secondary dark:hover:bg-dark-surface-card'
            }`}
          >
            <rt.icon className="w-4 h-4" />
            {rt.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        renderReport()
      )}
    </div>
  );
}
