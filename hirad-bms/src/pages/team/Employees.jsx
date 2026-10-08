import { useState } from 'react';
import { Plus, UserCircle, Mail, Phone, Calendar, Trash2, Eye } from 'lucide-react';
import { Card, Badge, Button, SearchBar, Modal, Input, Select, Avatar, EmptyState, Spinner } from '../../components/ui';
import { employeesAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useConfirm } from '../../context/ConfirmContext';
import { formatDate } from '../../utils/helpers';

const DEPARTMENTS = ['Management', 'Development', 'Design', 'Marketing', 'Finance', 'Operations'];

const DEPT_COLORS = {
  Management: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  Development: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  Design: 'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
  Marketing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  Finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  Operations: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
};

export default function Employees() {
  const { confirm } = useConfirm();
  const { data: employeesRes, loading, refetch } = useApi(() => employeesAPI.getAll({ limit: 100 }));
  const employees = employeesRes?.data || [];

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [view, setView] = useState('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewEmp, setViewEmp] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: 'Development',
    role: 'employee',
    password: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
  });

  const filtered = employees.filter(e => {
    const term = search.toLowerCase();
    const nameMatch = (e.name || '').toLowerCase().includes(term);
    const posMatch = (e.position || '').toLowerCase().includes(term);
    const emailMatch = (e.email || '').toLowerCase().includes(term);
    const matchSearch = !search || nameMatch || posMatch || emailMatch;
    const matchDept = filterDept === 'all' || e.department === filterDept;
    return matchSearch && matchDept;
  });

  const deptCount = (d) => employees.filter(e => e.department === d).length;

  const handleAdd = async (ev) => {
    ev.preventDefault();
    setSubmitting(true);
    try {
      await employeesAPI.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        position: form.position,
        department: form.department,
        role: form.role,
        password: form.password || 'Hirad@123',
        status: form.status,
        joinDate: form.joinDate,
      });

      setModalOpen(false);
      setForm({
        name: '',
        email: '',
        phone: '',
        position: '',
        department: 'Development',
        role: 'employee',
        password: '',
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
      });
      refetch();
    } catch (err) {
      console.error('Failed to create employee:', err);
      alert('Error creating employee: ' + (err.message || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Remove Team Member',
      message: 'Are you sure you want to remove this employee from the directory? Their system access and assignments will be revoked.',
      confirmText: 'Yes, Remove',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await employeesAPI.delete(id);
      if (viewEmp && (viewEmp._id === id || viewEmp.id === id)) {
        setViewEmp(null);
      }
      refetch();
    } catch (err) {
      console.error('Failed to delete employee:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">
            {employees.filter(e => e.status === 'active').length} active · {employees.length} total team members
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-border dark:border-navy-border rounded-lg overflow-hidden">
            {['grid', 'list'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium capitalize ${
                  view === v
                    ? 'bg-electric text-white'
                    : 'text-text-secondary dark:text-slate-400 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Employee
          </Button>
        </div>
      </div>

      {/* Department Summary */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterDept('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
            filterDept === 'all'
              ? 'bg-electric text-white'
              : 'bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary dark:text-slate-400 hover:bg-surface-secondary'
          }`}
        >
          All ({employees.length})
        </button>
        {DEPARTMENTS.map(dept => {
          const count = deptCount(dept);
          if (!count) return null;
          return (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                filterDept === dept
                  ? 'bg-electric text-white'
                  : 'bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary dark:text-slate-400 hover:bg-surface-secondary'
              }`}
            >
              {dept} ({count})
            </button>
          );
        })}
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by name, position, or email..." className="max-w-sm" />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={UserCircle} title="No employees found" />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(emp => {
            const id = emp._id || emp.id;
            return (
              <Card key={id} hover className="p-5 relative group">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar name={emp.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-text-primary dark:text-white truncate">{emp.name}</h3>
                    <p className="text-xs text-text-muted mt-0.5 truncate">{emp.position || 'Team Member'}</p>
                    <span className={`badge mt-1.5 text-[10px] ${DEPT_COLORS[emp.department] || ''}`}>
                      {emp.department || 'General'}
                    </span>
                  </div>
                  <Badge status={emp.status}>{emp.status}</Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  {emp.phone && (
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Joined {formatDate(emp.joinDate || emp.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border dark:border-navy-border">
                  <Button variant="ghost" size="sm" className="flex-1 justify-center" onClick={() => setViewEmp(emp)}>
                    <Eye className="w-3.5 h-3.5" /> Profile
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    onClick={() => handleDelete(id)}
                    title="Remove Employee"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
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
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => {
                  const id = emp._id || emp.id;
                  return (
                    <tr key={id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={emp.name} size="sm" />
                          <span className="font-semibold">{emp.name}</span>
                        </div>
                      </td>
                      <td className="text-xs">{emp.position || '—'}</td>
                      <td>
                        <span className={`badge text-[10px] ${DEPT_COLORS[emp.department] || ''}`}>
                          {emp.department || 'General'}
                        </span>
                      </td>
                      <td className="text-xs text-text-muted">{emp.email}</td>
                      <td className="text-xs text-text-muted">{emp.phone || '—'}</td>
                      <td className="text-xs">{formatDate(emp.joinDate || emp.createdAt)}</td>
                      <td><Badge status={emp.status}>{emp.status}</Badge></td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setViewEmp(emp)}>
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <button
                            onClick={() => handleDelete(id)}
                            className="p-1.5 text-text-muted hover:text-rose-500 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Employee Profile Modal */}
      {viewEmp && (
        <Modal open={!!viewEmp} onClose={() => setViewEmp(null)} title="Employee Profile" size="lg">
          <div className="space-y-5">
            <div className="flex items-center gap-5">
              <Avatar name={viewEmp.name} size="xl" />
              <div>
                <h3 className="text-xl font-bold text-text-primary dark:text-white font-sora">{viewEmp.name}</h3>
                <p className="text-text-muted">{viewEmp.position || 'Team Member'}</p>
                <span className={`badge mt-1 ${DEPT_COLORS[viewEmp.department] || ''}`}>
                  {viewEmp.department || 'General'}
                </span>
              </div>
              <div className="ml-auto"><Badge status={viewEmp.status}>{viewEmp.status}</Badge></div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div><p className="text-xs text-text-muted">Email</p><p className="font-medium dark:text-white">{viewEmp.email}</p></div>
                <div><p className="text-xs text-text-muted">Phone</p><p className="font-medium dark:text-white">{viewEmp.phone || '—'}</p></div>
              </div>
              <div className="space-y-3">
                <div><p className="text-xs text-text-muted">Department</p><p className="font-medium dark:text-white">{viewEmp.department || 'General'}</p></div>
                <div><p className="text-xs text-text-muted">Role</p><p className="font-medium capitalize dark:text-white">{viewEmp.role?.replace('_', ' ') || 'Employee'}</p></div>
                <div><p className="text-xs text-text-muted">Joined</p><p className="font-medium dark:text-white">{formatDate(viewEmp.joinDate || viewEmp.createdAt)}</p></div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Employee Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Employee" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Input label="Position *" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} placeholder="Senior Developer" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
            <Select label="System Role" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="employee">Employee</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="project_manager">Project Manager</option>
              <option value="accountant">Accountant</option>
              <option value="admin">Admin</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Initial Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Default: Hirad@123" />
            <Input label="Join Date" type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
