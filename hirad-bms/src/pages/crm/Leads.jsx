import { useState } from 'react';
import { Plus, GripVertical, Phone, Mail, DollarSign, Trash2, ArrowRight } from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Select, Textarea, Spinner } from '../../components/ui';
import { leadsAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

const PIPELINE = [
  { id: 'new', label: 'New', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-purple-500' },
  { id: 'proposal', label: 'Proposal', color: 'bg-amber-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-cyan-500' },
  { id: 'won', label: 'Won', color: 'bg-emerald-500' },
  { id: 'lost', label: 'Lost', color: 'bg-red-500' },
];

export default function Leads() {
  const { confirm } = useConfirm();
  const { data: leadsRes, loading, error, refetch } = useApi(() => leadsAPI.getAll({ limit: 100 }));
  const leads = leadsRes?.data || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    source: 'website',
    status: 'new',
    estimatedValue: '',
    notes: '',
  });
  const [view, setView] = useState('kanban');

  const getLeadsForStage = (status) => leads.filter(l => l.status === status);

  const moveToStage = async (leadId, newStatus) => {
    try {
      await leadsAPI.update(leadId, { status: newStatus });
      refetch();
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  const handleDelete = async (leadId) => {
    const ok = await confirm({
      title: 'Remove Lead',
      message: 'Are you sure you want to permanently remove this lead from the pipeline? This action cannot be undone.',
      confirmText: 'Remove',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await leadsAPI.delete(leadId);
      refetch();
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await leadsAPI.create({
        ...form,
        estimatedValue: Number(form.estimatedValue) || 0,
      });
      setModalOpen(false);
      setForm({ name: '', company: '', email: '', phone: '', service: '', source: 'website', status: 'new', estimatedValue: '', notes: '' });
      refetch();
    } catch (err) {
      console.error('Failed to create lead:', err);
      alert('Error creating lead: ' + (err.message || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  const totalValue = leads.filter(l => l.status !== 'lost').reduce((s, l) => s + (l.estimatedValue || 0), 0);
  const wonValue = leads.filter(l => l.status === 'won').reduce((s, l) => s + (l.estimatedValue || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Lead Pipeline</h1>
          <p className="page-subtitle">Pipeline value: {formatCurrency(totalValue)} · Won: {formatCurrency(wonValue)}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-border dark:border-navy-border rounded-lg overflow-hidden">
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 text-xs font-medium ${view === 'kanban' ? 'bg-electric text-white' : 'text-text-secondary dark:text-slate-400 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary'}`}
            >
              Billboard
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 text-xs font-medium ${view === 'list' ? 'bg-electric text-white' : 'text-text-secondary dark:text-slate-400 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary'}`}
            >
              List
            </button>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Lead
          </Button>
        </div>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {PIPELINE.map(stage => {
          const stageLeads = getLeadsForStage(stage.id);
          const stageValue = stageLeads.reduce((s, l) => s + (l.estimatedValue || 0), 0);
          return (
            <Card key={stage.id} className="p-3 text-center">
              <div className={`w-2 h-2 rounded-full ${stage.color} mx-auto mb-2`} />
              <p className="text-xs font-semibold text-text-primary dark:text-white">{stageLeads.length}</p>
              <p className="text-[10px] text-text-muted">{stage.label}</p>
              {stageValue > 0 && <p className="text-[10px] text-emerald-500 font-semibold">{formatCurrency(stageValue)}</p>}
            </Card>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-500">Failed to load leads from database.</div>
      ) : (
        <>
          {/* Kanban Board */}
          {view === 'kanban' && (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {PIPELINE.map(stage => {
                const stageLeads = getLeadsForStage(stage.id);
                return (
                  <div key={stage.id} className="kanban-column flex-shrink-0 min-w-[280px]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                      <span className="text-sm font-bold text-text-primary dark:text-white">{stage.label}</span>
                      <span className="ml-auto text-xs text-text-muted bg-surface-tertiary dark:bg-dark-surface-tertiary px-2 py-0.5 rounded-full">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {stageLeads.map(lead => {
                        const id = lead._id || lead.id;
                        return (
                          <Card key={id} className="p-3.5 group relative hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div>
                                <p className="text-sm font-semibold text-text-primary dark:text-white">{lead.name}</p>
                                <p className="text-xs text-text-muted">{lead.company || 'Direct Contact'}</p>
                              </div>
                              <button
                                onClick={() => handleDelete(id)}
                                title="Delete Lead"
                                className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 transition-opacity p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {lead.service && <p className="text-xs text-text-muted mb-2">{lead.service}</p>}
                            {lead.estimatedValue > 0 && (
                              <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold mb-3">
                                <DollarSign className="w-3 h-3" />
                                {formatCurrency(lead.estimatedValue)}
                              </div>
                            )}
                            <div className="flex items-center gap-1 text-[10px] text-text-muted mb-3">
                              <span className="capitalize">{lead.source}</span>
                              <span>·</span>
                              <span>{formatDate(lead.createdAt)}</span>
                            </div>
                            {/* Move buttons */}
                            <div className="flex gap-1 flex-wrap">
                              {PIPELINE.filter(s => s.id !== stage.id && s.id !== 'lost').slice(0, 2).map(s => (
                                <button
                                  key={s.id}
                                  onClick={() => moveToStage(id, s.id)}
                                  className="flex-1 text-[10px] px-2 py-1 rounded bg-surface-tertiary dark:bg-dark-surface-tertiary text-text-muted hover:bg-electric/10 hover:text-electric transition-colors"
                                >
                                  → {s.label}
                                </button>
                              ))}
                            </div>
                          </Card>
                        );
                      })}

                      {stageLeads.length === 0 && (
                        <div className="text-center py-8 text-xs text-text-muted border-2 border-dashed border-border dark:border-navy-border rounded-xl">
                          No leads
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {view === 'list' && (
            <Card>
              <div className="overflow-x-auto">
                <table className="bms-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Company</th>
                      <th>Service</th>
                      <th>Source</th>
                      <th>Value</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map(lead => {
                      const id = lead._id || lead.id;
                      return (
                        <tr key={id}>
                          <td>
                            <div>
                              <p className="font-semibold">{lead.name}</p>
                              <p className="text-xs text-text-muted">{lead.email}</p>
                            </div>
                          </td>
                          <td>{lead.company || '—'}</td>
                          <td>{lead.service || '—'}</td>
                          <td className="capitalize">{lead.source}</td>
                          <td className="font-semibold text-emerald-600">
                            {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : '—'}
                          </td>
                          <td><Badge status={lead.status}>{lead.status}</Badge></td>
                          <td className="text-xs text-text-muted">{formatDate(lead.createdAt)}</td>
                          <td className="text-right">
                            <button
                              onClick={() => handleDelete(id)}
                              className="text-text-muted hover:text-rose-500 p-1.5 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {leads.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-text-muted">
                          No leads found in database. Click "Add Lead" to get started.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Add Lead Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Lead" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <Input label="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Service Interested In" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} />
            <Input label="Estimated Value ($)" type="number" value={form.estimatedValue} onChange={e => setForm({ ...form, estimatedValue: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Source" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="conference">Conference</option>
              <option value="cold_outreach">Cold Outreach</option>
              <option value="other">Other</option>
            </Select>
            <Select label="Initial Stage" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              {PIPELINE.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </Select>
          </div>
          <Textarea label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
