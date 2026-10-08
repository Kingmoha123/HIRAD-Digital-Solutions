import { useState } from 'react';
import { Plus, FileText, CheckCircle, XCircle, Eye, Trash2, Send } from 'lucide-react';
import { Card, Badge, Button, SearchBar, Modal, Input, Select, Textarea, Spinner } from '../../components/ui';
import { proposalsAPI, clientsAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

const STATUSES = {
  draft: { label: 'Draft', color: 'gray' },
  sent: { label: 'Sent', color: 'info' },
  accepted: { label: 'Accepted', color: 'active' },
  rejected: { label: 'Rejected', color: 'danger' },
  expired: { label: 'Expired', color: 'gray' },
};

export default function Proposals() {
  const { confirm } = useConfirm();
  const { data: proposalsRes, loading, refetch } = useApi(() => proposalsAPI.getAll({ limit: 100 }));
  const { data: clientsRes } = useApi(() => clientsAPI.getAll({ limit: 100 }));

  const proposals = proposalsRes?.data || [];
  const clients = clientsRes?.data || [];

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewProp, setViewProp] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    client: '',
    description: '',
    price: '',
    validUntil: '',
    status: 'draft',
    services: 'Web Development, UI/UX Design',
  });

  const filtered = proposals.filter(p => {
    const term = search.toLowerCase();
    const num = (p.number || '').toLowerCase();
    const cName = (p.clientName || '').toLowerCase();
    return !search || num.includes(term) || cName.includes(term);
  });

  const statusCount = (s) => proposals.filter(p => p.status === s).length;
  const totalValue = proposals.filter(p => p.status === 'accepted').reduce((s, p) => s + (p.price || 0), 0);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedClient = clients.find(c => (c._id || c.id) === form.client);
      const generatedNumber = `PROP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      await proposalsAPI.create({
        number: generatedNumber,
        client: form.client,
        clientName: selectedClient ? selectedClient.company : 'Client',
        description: form.description,
        price: Number(form.price) || 0,
        validUntil: form.validUntil ? new Date(form.validUntil) : new Date(Date.now() + 30 * 86400000),
        status: form.status,
        services: form.services ? form.services.split(',').map(s => s.trim()) : [],
      });

      setModalOpen(false);
      setForm({ client: '', description: '', price: '', validUntil: '', status: 'draft', services: 'Web Development, UI/UX Design' });
      refetch();
    } catch (err) {
      console.error('Failed to create proposal:', err);
      alert('Error creating proposal: ' + (err.message || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await proposalsAPI.update(id, { status });
      if (viewProp && (viewProp._id === id || viewProp.id === id)) {
        setViewProp({ ...viewProp, status });
      }
      refetch();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Proposal',
      message: 'Are you sure you want to permanently delete this proposal? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await proposalsAPI.delete(id);
      if (viewProp && (viewProp._id === id || viewProp.id === id)) {
        setViewProp(null);
      }
      refetch();
    } catch (err) {
      console.error('Failed to delete proposal:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Proposals</h1>
          <p className="page-subtitle">{proposals.length} proposals · {formatCurrency(totalValue)} accepted value</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> New Proposal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(STATUSES).slice(0, 4).map(([key, val]) => (
          <Card key={key} className="p-4 text-center">
            <p className="text-xl font-bold text-text-primary dark:text-white font-sora">{statusCount(key)}</p>
            <p className="text-xs text-text-muted mt-1">{val.label}</p>
          </Card>
        ))}
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search proposals..." className="max-w-sm" />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        /* Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(prop => {
            const id = prop._id || prop.id;
            return (
              <Card key={id} hover className="p-5 relative group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-xs text-electric font-bold">{prop.number}</span>
                    <p className="font-bold text-sm text-text-primary dark:text-white mt-0.5">{prop.clientName || 'Valued Client'}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge status={STATUSES[prop.status]?.color || 'gray'}>{STATUSES[prop.status]?.label || prop.status}</Badge>
                    <button
                      onClick={() => handleDelete(id)}
                      className="text-text-muted hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Delete proposal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {prop.services && prop.services.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {prop.services.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-electric/10 text-electric text-[10px] font-semibold rounded-full">{s}</span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-text-muted mb-4 line-clamp-2">{prop.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-text-muted">Value</p>
                    <p className="text-lg font-bold text-emerald-600 font-sora">{formatCurrency(prop.price || 0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Valid Until</p>
                    <p className="text-xs font-semibold text-text-primary dark:text-white">{formatDate(prop.validUntil)}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border dark:border-navy-border">
                  <Button variant="ghost" size="sm" className="flex-1 justify-center" onClick={() => setViewProp(prop)}>
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </Button>
                  {prop.status === 'draft' && (
                    <Button variant="ghost" size="sm" className="text-electric" onClick={() => handleUpdateStatus(id, 'sent')}>
                      <Send className="w-3.5 h-3.5" /> Send
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-text-muted border-2 border-dashed border-border dark:border-navy-border rounded-xl">
              No proposals found. Click "New Proposal" to create one.
            </div>
          )}
        </div>
      )}

      {/* View Proposal */}
      {viewProp && (
        <Modal open={!!viewProp} onClose={() => setViewProp(null)} title={`Proposal ${viewProp.number}`} size="lg">
          <div className="space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-lg font-bold text-text-primary dark:text-white font-sora">{viewProp.clientName}</p>
                <p className="text-sm text-text-muted">Proposal {viewProp.number}</p>
              </div>
              <Badge status={STATUSES[viewProp.status]?.color || 'gray'}>{STATUSES[viewProp.status]?.label || viewProp.status}</Badge>
            </div>

            {viewProp.services && viewProp.services.length > 0 && (
              <div>
                <p className="text-xs text-text-muted mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {viewProp.services.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-electric/10 text-electric text-xs font-semibold rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-text-muted mb-1">Description</p>
              <p className="text-sm text-text-primary dark:text-slate-200 bg-surface-secondary dark:bg-dark-surface-secondary p-3 rounded-xl">{viewProp.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-xs text-text-muted">Total Value</p>
                <p className="text-xl font-bold text-emerald-600 font-sora mt-1">{formatCurrency(viewProp.price || 0)}</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-xs text-text-muted">Created</p>
                <p className="text-sm font-bold text-text-primary dark:text-white mt-1">{formatDate(viewProp.createdAt)}</p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-xs text-text-muted">Valid Until</p>
                <p className="text-sm font-bold text-text-primary dark:text-white mt-1">{formatDate(viewProp.validUntil)}</p>
              </Card>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              {viewProp.status === 'draft' && (
                <Button size="sm" onClick={() => handleUpdateStatus(viewProp._id || viewProp.id, 'sent')}>
                  <Send className="w-4 h-4 mr-1" /> Send to Client
                </Button>
              )}
              {viewProp.status === 'sent' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleUpdateStatus(viewProp._id || viewProp.id, 'rejected')}
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Reject
                  </Button>
                  <Button
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    onClick={() => handleUpdateStatus(viewProp._id || viewProp.id, 'accepted')}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Accept Proposal
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* New Proposal Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Proposal" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <Select label="Client *" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} required>
            <option value="">Select client</option>
            {clients.map(c => (
              <option key={c._id || c.id} value={c._id || c.id}>{c.company || c.name}</option>
            ))}
          </Select>
          <Textarea label="Description *" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required />
          <Input label="Services (comma separated)" value={form.services} onChange={e => setForm({ ...form, services: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Proposed Value ($) *" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
            <Input label="Valid Until *" type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} required />
          </div>
          <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </Select>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Proposal'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
