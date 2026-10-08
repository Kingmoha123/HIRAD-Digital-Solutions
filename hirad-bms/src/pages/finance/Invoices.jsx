import { useState } from 'react';
import { Plus, Receipt, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Eye, FileDown, Trash2 } from 'lucide-react';
import { Card, Badge, Button, SearchBar, Modal, Input, Select, Avatar, StatCard, Spinner } from '../../components/ui';
import { invoicesAPI, clientsAPI, projectsAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

export const INVOICE_STATUSES = {
  draft:          { label: 'Draft',          color: 'border-slate-400 text-slate-400' },
  sent:           { label: 'Sent',           color: 'border-blue-500 text-blue-500' },
  paid:           { label: 'Paid',           color: 'border-emerald-500 text-emerald-500' },
  partially_paid: { label: 'Partially Paid', color: 'border-cyan-500 text-cyan-500' },
  overdue:        { label: 'Overdue',        color: 'border-red-500 text-red-500' },
  cancelled:      { label: 'Cancelled',      color: 'border-slate-400 text-slate-400' },
};

export default function Invoices() {
  const { confirm } = useConfirm();
  const { data: invData, loading, refetch } = useApi(() => invoicesAPI.getAll());
  const { data: clientsData } = useApi(() => clientsAPI.getAll());
  const { data: projData } = useApi(() => projectsAPI.getAll());

  const invoices = invData?.data || [];
  const clientsList = clientsData?.data || [];
  const projectsList = projData?.data || [];

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewInv, setViewInv] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    client: '', project: '', issueDate: new Date().toISOString().split('T')[0],
    dueDate: '', description: '', qty: 1, unitPrice: 0, tax: 0, discount: 0,
  });

  const filtered = invoices.filter(inv => {
    const matchSearch = !search || inv.number?.toLowerCase().includes(search.toLowerCase()) || inv.clientName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0);
  const outstanding = invoices.filter(i => ['sent','partially_paid'].includes(i.status)).reduce((s, i) => s + (i.total || 0), 0);
  const overdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.total || 0), 0);

  const statusCount = (s) => invoices.filter(i => i.status === s).length;

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedClient = clientsList.find(c => (c._id || c.id) === form.client);
      const selectedProject = projectsList.find(p => (p._id || p.id) === form.project);
      const subtotal = Number(form.qty) * Number(form.unitPrice);
      const taxAmount = (subtotal * Number(form.tax || 0)) / 100;
      const total = subtotal + taxAmount;
      const year = new Date().getFullYear();
      const num = `INV-${year}-${String(invoices.length + 1).padStart(3, '0')}`;

      await invoicesAPI.create({
        number: num,
        client: form.client,
        clientName: selectedClient?.company || selectedClient?.name || 'Client',
        project: form.project || undefined,
        projectName: selectedProject?.name || '',
        issueDate: form.issueDate,
        dueDate: form.dueDate,
        items: [{ description: form.description || 'Professional Services', qty: Number(form.qty), unitPrice: Number(form.unitPrice) }],
        subtotal,
        tax: Number(form.tax || 0),
        discount: Number(form.discount || 0),
        total,
        status: 'sent',
      });
      await refetch();
      setModalOpen(false);
      setForm({ client: '', project: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '', description: '', qty: 1, unitPrice: 0, tax: 0, discount: 0 });
    } catch (err) {
      alert(err.message || 'Failed to create invoice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await invoicesAPI.update(id, { status: 'paid', paidDate: new Date() });
      await refetch();
      if (viewInv && (viewInv._id === id || viewInv.id === id)) {
        setViewInv(prev => ({ ...prev, status: 'paid' }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update invoice status');
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Invoice',
      message: 'Are you sure you want to delete this invoice? The ledger entry and billing records will be permanently removed.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await invoicesAPI.delete(id);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to delete invoice');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Invoices</h1>
          <p className="page-subtitle">{invoices.length} total invoices</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> New Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-text-muted">Total Paid</p>
          <p className="text-xl font-bold text-emerald-600 font-sora mt-1">{formatCurrency(totalRevenue)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-muted">Outstanding</p>
          <p className="text-xl font-bold text-electric font-sora mt-1">{formatCurrency(outstanding)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-muted">Overdue</p>
          <p className="text-xl font-bold text-red-500 font-sora mt-1">{formatCurrency(overdue)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-muted">Draft</p>
          <p className="text-xl font-bold text-slate-400 font-sora mt-1">{statusCount('draft')}</p>
        </Card>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {['all', ...Object.keys(INVOICE_STATUSES)].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${filterStatus === s ? 'bg-electric text-white' : 'bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary dark:text-slate-400 hover:bg-surface-secondary'}`}>
            {s === 'all' ? `All (${invoices.length})` : `${INVOICE_STATUSES[s]?.label} (${statusCount(s)})`}
          </button>
        ))}
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by invoice number or client..." className="max-w-sm" />

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="bms-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Project</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv._id || inv.id}>
                  <td>
                    <span className="font-mono font-semibold text-electric">{inv.number}</span>
                  </td>
                  <td>{inv.clientName}</td>
                  <td className="text-xs text-text-muted max-w-[150px] truncate">{inv.projectName || '—'}</td>
                  <td className="text-xs">{formatDate(inv.issueDate)}</td>
                  <td className="text-xs">{formatDate(inv.dueDate)}</td>
                  <td className="font-bold text-text-primary dark:text-white">{formatCurrency(inv.total)}</td>
                  <td><Badge status={inv.status}>{INVOICE_STATUSES[inv.status]?.label}</Badge></td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setViewInv(inv)} className="p-1.5 hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary rounded text-text-muted hover:text-electric transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(inv._id || inv.id)} className="p-1.5 hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary rounded text-text-muted hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Invoice Modal */}
      {viewInv && (
        <Modal open={!!viewInv} onClose={() => setViewInv(null)} title={`Invoice ${viewInv.number}`} size="lg">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric to-cyan-brand flex items-center justify-center">
                    <span className="text-white font-bold text-xs font-sora">H</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-text-primary dark:text-white font-sora">HIRAD Digital Solutions</p>
                    <p className="text-[11px] text-text-muted">info@hirad.io · www.hirad.io</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-electric font-mono">{viewInv.number}</p>
                <Badge status={viewInv.status}>{INVOICE_STATUSES[viewInv.status]?.label}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-text-muted mb-1">Bill To</p>
                <p className="font-semibold text-text-primary dark:text-white">{viewInv.clientName}</p>
              </div>
              <div className="text-right">
                <div className="space-y-1 text-xs">
                  <div><span className="text-text-muted">Issue Date:</span> <span className="font-medium">{formatDate(viewInv.issueDate)}</span></div>
                  <div><span className="text-text-muted">Due Date:</span> <span className="font-medium">{formatDate(viewInv.dueDate)}</span></div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="border border-border dark:border-navy-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-surface-secondary dark:bg-dark-surface-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted">Unit Price</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-text-muted">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(viewInv.items || []).map((item, i) => (
                    <tr key={i} className="border-t border-border dark:border-navy-border">
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3 text-right">{item.qty}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatCurrency(item.qty * item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="space-y-2 w-48 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Subtotal</span>
                  <span>{formatCurrency(viewInv.subtotal || viewInv.total)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-border dark:border-navy-border text-electric">
                  <span>Total</span>
                  <span>{formatCurrency(viewInv.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              {viewInv.status !== 'paid' && (
                <Button size="sm" onClick={() => handleMarkPaid(viewInv._id || viewInv.id)}>
                  <CheckCircle className="w-4 h-4" /> Mark as Paid
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* New Invoice Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Invoice">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Client *" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} required>
              <option value="">Select client</option>
              {clientsList.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.company || c.name}</option>)}
            </Select>
            <Select label="Project" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })}>
              <option value="">Select project (optional)</option>
              {projectsList.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Issue Date *" type="date" value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} required />
            <Input label="Due Date *" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required />
          </div>
          <div className="border border-border dark:border-navy-border rounded-xl p-4">
            <p className="text-xs font-semibold text-text-muted mb-3">Line Item</p>
            <div className="grid grid-cols-12 gap-2 mb-2 text-xs text-text-muted">
              <span className="col-span-6">Description</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-4 text-right">Unit Price ($)</span>
            </div>
            <div className="grid grid-cols-12 gap-2 items-center">
              <input className="bms-input col-span-6 !text-xs !py-2" placeholder="Service description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              <input className="bms-input col-span-2 text-center !text-xs !py-2" type="number" min="1" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} required />
              <input className="bms-input col-span-4 text-right !text-xs !py-2" type="number" min="0" placeholder="0.00" value={form.unitPrice} onChange={e => setForm({ ...form, unitPrice: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tax (%)" type="number" value={form.tax} onChange={e => setForm({ ...form, tax: e.target.value })} />
            <Input label="Discount (%)" type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create Invoice'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
