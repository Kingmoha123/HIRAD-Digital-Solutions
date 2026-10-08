import { useState } from 'react';
import { Plus, CreditCard, Banknote, Smartphone, DollarSign, Trash2 } from 'lucide-react';
import { Card, Badge, Button, SearchBar, Modal, Input, Select, Avatar, Spinner } from '../../components/ui';
import { paymentsAPI, clientsAPI, invoicesAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

const METHOD_ICONS = {
  bank_transfer: Banknote,
  mobile_money: Smartphone,
  card: CreditCard,
  cash: DollarSign,
};

const METHOD_LABELS = {
  bank_transfer: 'Bank Transfer',
  mobile_money: 'Mobile Money',
  card: 'Card',
  cash: 'Cash',
  other: 'Other',
};

export default function Payments() {
  const { confirm } = useConfirm();
  const { data: payData, loading, refetch } = useApi(() => paymentsAPI.getAll());
  const { data: clientsData } = useApi(() => clientsAPI.getAll());
  const { data: invData } = useApi(() => invoicesAPI.getAll());

  const payments = payData?.data || [];
  const clientsList = clientsData?.data || [];
  const invoicesList = invData?.data || [];

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ client: '', invoice: '', amount: '', method: 'bank_transfer', currency: 'USD', date: new Date().toISOString().split('T')[0], reference: '', notes: '' });

  const filtered = payments.filter(p =>
    !search ||
    p.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    p.paymentId?.toLowerCase().includes(search.toLowerCase()) ||
    p.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const totalReceived = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonth = payments.filter(p => p.date && p.date.startsWith(currentMonthPrefix)).reduce((s, p) => s + (p.amount || 0), 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const client = clientsList.find(c => (c._id || c.id) === form.client);
      const invoice = invoicesList.find(i => (i._id || i.id) === form.invoice);
      const paymentId = `PAY-${String(payments.length + 1).padStart(3, '0')}`;
      await paymentsAPI.create({
        ...form,
        paymentId,
        clientName: client?.company || client?.name || '',
        invoiceNumber: invoice?.number || '',
        amount: Number(form.amount) || 0,
      });
      await refetch();
      setModalOpen(false);
      setForm({ client: '', invoice: '', amount: '', method: 'bank_transfer', currency: 'USD', date: new Date().toISOString().split('T')[0], reference: '', notes: '' });
    } catch (err) {
      alert(err.message || 'Failed to record payment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Payment Record',
      message: 'Are you sure you want to permanently delete this payment record? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await paymentsAPI.delete(id);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to delete payment');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-subtitle">{payments.length} total payments recorded</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> Record Payment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-l-emerald-500">
          <p className="text-xs text-text-muted">Total Received</p>
          <p className="text-2xl font-bold text-emerald-600 font-sora mt-1">{formatCurrency(totalReceived)}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-electric">
          <p className="text-xs text-text-muted">This Month</p>
          <p className="text-2xl font-bold text-electric font-sora mt-1">{formatCurrency(thisMonth)}</p>
        </Card>
        <Card className="p-5 border-l-4 border-l-cyan-brand">
          <p className="text-xs text-text-muted">Total Transactions</p>
          <p className="text-2xl font-bold text-text-primary dark:text-white font-sora mt-1">{payments.length}</p>
        </Card>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search by client, payment ID, or invoice..." className="max-w-sm" />

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="bms-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Client</th>
                <th>Invoice</th>
                <th>Method</th>
                <th>Date</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(payment => {
                const MethodIcon = METHOD_ICONS[payment.method] || DollarSign;
                return (
                  <tr key={payment._id || payment.id}>
                    <td>
                      <span className="font-mono text-sm font-semibold text-electric">{payment.paymentId}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={payment.clientName} size="xs" />
                        <span className="text-sm font-medium">{payment.clientName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-text-muted">{payment.invoiceNumber || '—'}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-xs">
                        <MethodIcon className="w-3.5 h-3.5 text-text-muted" />
                        <span>{METHOD_LABELS[payment.method] || payment.method}</span>
                      </div>
                    </td>
                    <td className="text-xs">{formatDate(payment.date)}</td>
                    <td className="text-xs text-text-muted font-mono">{payment.reference || '—'}</td>
                    <td>
                      <span className="text-base font-bold text-emerald-600">{formatCurrency(payment.amount)}</span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(payment._id || payment.id)} className="p-1 hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary rounded text-text-muted hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border dark:border-navy-border">
                <td colSpan={6} className="px-4 py-3 text-sm font-bold text-text-secondary dark:text-slate-400 text-right">Total</td>
                <td className="px-4 py-3">
                  <span className="text-base font-bold text-emerald-600">{formatCurrency(filtered.reduce((s, p) => s + (p.amount || 0), 0))}</span>
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Record Payment Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record Payment" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Client *" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} required>
              <option value="">Select client</option>
              {clientsList.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.company || c.name}</option>)}
            </Select>
            <Select label="Invoice" value={form.invoice} onChange={e => setForm({ ...form, invoice: e.target.value })}>
              <option value="">Select invoice (optional)</option>
              {invoicesList.filter(i => !form.client || (i.client?._id || i.client) === form.client).map(i => <option key={i._id || i.id} value={i._id || i.id}>{i.number}</option>)}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount *" type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" required />
            <Select label="Currency" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Payment Method *" value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="card">Card</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </Select>
            <Input label="Date *" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>
          <Input label="Reference / Transaction ID" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} placeholder="TXN-XXXXXXXX" />
          <Input label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Recording...' : 'Record Payment'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
