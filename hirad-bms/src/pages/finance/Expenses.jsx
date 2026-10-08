import { useState } from 'react';
import { Plus, Upload, Tag, Wallet, Trash2 } from 'lucide-react';
import { Card, Badge, Button, SearchBar, Modal, Input, Select, Textarea, Avatar, Spinner } from '../../components/ui';
import { expensesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

const CATEGORIES = ['office', 'internet', 'software', 'transportation', 'marketing', 'equipment', 'other'];
const CATEGORY_COLORS = {
  office: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  internet: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
  software: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  transportation: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  marketing: 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
  equipment: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  other: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};
const CATEGORY_EMOJIS = { office: '🏢', internet: '🌐', software: '💻', transportation: '🚗', marketing: '📢', equipment: '🖥️', other: '📦' };

export default function Expenses() {
  const { user } = useAuth();
  const { confirm } = useConfirm();
  const { data: expData, loading, refetch } = useApi(() => expensesAPI.getAll());
  const expenses = expData?.data || [];

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'office', amount: '', date: new Date().toISOString().split('T')[0], method: 'bank_transfer', description: '' });

  const filtered = expenses.filter(e => {
    const matchSearch = !search || e.title?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || e.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const byCategory = CATEGORIES.map(cat => ({
    cat,
    total: expenses.filter(e => e.category === cat).reduce((s, e) => s + (e.amount || 0), 0),
    count: expenses.filter(e => e.category === cat).length,
  })).filter(c => c.count > 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await expensesAPI.create({
        ...form,
        amount: Number(form.amount) || 0,
        addedBy: user?._id || user?.id,
        addedByName: user?.name || 'User',
        approved: true,
      });
      await refetch();
      setModalOpen(false);
      setForm({ title: '', category: 'office', amount: '', date: new Date().toISOString().split('T')[0], method: 'bank_transfer', description: '' });
    } catch (err) {
      alert(err.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Expense',
      message: 'Are you sure you want to permanently delete this expense? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await expensesAPI.delete(id);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expenses</h1>
          <p className="page-subtitle">Total: {formatCurrency(totalExpenses)} · {expenses.length} entries</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> Add Expense
        </Button>
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {byCategory.map(c => (
          <Card key={c.cat} className="p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span>{CATEGORY_EMOJIS[c.cat]}</span>
              <span className="text-xs font-semibold capitalize text-text-secondary dark:text-slate-400">{c.cat}</span>
            </div>
            <p className="text-lg font-bold text-text-primary dark:text-white font-sora">{formatCurrency(c.total)}</p>
            <p className="text-[11px] text-text-muted">{c.count} entries</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <SearchBar value={search} onChange={setSearch} placeholder="Search expenses..." className="max-w-xs" />
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterCat('all')} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${filterCat === 'all' ? 'bg-electric text-white' : 'bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary dark:text-slate-400 hover:bg-surface-secondary'}`}>
            All ({expenses.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = expenses.filter(e => e.category === cat).length;
            if (!count) return null;
            return (
              <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${filterCat === cat ? 'bg-electric text-white' : 'bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary dark:text-slate-400 hover:bg-surface-secondary'}`}>
                {CATEGORY_EMOJIS[cat]} {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="bms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th>Added By</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(exp => (
                <tr key={exp._id || exp.id}>
                  <td className="font-semibold text-sm">{exp.title}</td>
                  <td>
                    <span className={`badge capitalize ${CATEGORY_COLORS[exp.category] || ''}`}>
                      {CATEGORY_EMOJIS[exp.category]} {exp.category}
                    </span>
                  </td>
                  <td>
                    <span className="text-base font-bold text-red-500">-{formatCurrency(exp.amount)}</span>
                  </td>
                  <td className="text-xs">{formatDate(exp.date)}</td>
                  <td className="text-xs capitalize text-text-muted">{exp.method?.replace('_', ' ')}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={exp.addedByName} size="xs" />
                      <span className="text-xs">{exp.addedByName}</span>
                    </div>
                  </td>
                  <td className="text-xs text-text-muted max-w-[200px] truncate">{exp.description || '—'}</td>
                  <td>
                    <button onClick={() => handleDelete(exp._id || exp.id)} className="p-1 hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary rounded text-text-muted hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border dark:border-navy-border">
                <td colSpan={2} className="px-4 py-3 text-sm font-bold text-text-secondary dark:text-slate-400">Total</td>
                <td className="px-4 py-3">
                  <span className="text-base font-bold text-red-500">-{formatCurrency(filtered.reduce((s, e) => s + (e.amount || 0), 0))}</span>
                </td>
                <td colSpan={5} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Add Expense Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Expense" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Expense Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Office rent, Software subscription..." required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category *" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map(cat => <option key={cat} value={cat} className="capitalize">{CATEGORY_EMOJIS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
            </Select>
            <Input label="Amount *" type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Payment Method" value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="other">Other</option>
            </Select>
            <Input label="Date *" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>
          <Textarea label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Additional details..." />
          <div className="border-2 border-dashed border-border dark:border-navy-border rounded-xl p-4 text-center cursor-pointer hover:border-electric/50 transition-colors">
            <Upload className="w-6 h-6 text-text-muted mx-auto mb-2" />
            <p className="text-xs text-text-muted">Click to upload receipt (optional)</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


