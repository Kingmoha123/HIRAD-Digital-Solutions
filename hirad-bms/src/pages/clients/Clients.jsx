import { useState, useEffect } from 'react';
import { Plus, Mail, Phone, Globe, Building2, Trash2, Eye, Briefcase, DollarSign, FileText, CheckCircle, Clock, ExternalLink, X, ClipboardList } from 'lucide-react';
import { Card, Badge, Button, SearchBar, Modal, Input, Select, Textarea, Avatar, EmptyState, Spinner, ProgressBar } from '../../components/ui';
import { clientsAPI, projectsAPI, invoicesAPI, proposalsAPI, contractsAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function Clients() {
  const { confirm } = useConfirm();
  const { data: apiData, loading, refetch } = useApi(() => clientsAPI.getAll());
  const clients = apiData?.data || [];
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [view, setView] = useState('cards');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewClient, setViewClient] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', address: '', website: '', industry: '', status: 'active', notes: ''
  });

  const filtered = clients.filter(c => {
    const matchSearch =
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await clientsAPI.create(form);
      await refetch();
      setModalOpen(false);
      setForm({ name: '', company: '', email: '', phone: '', address: '', website: '', industry: '', status: 'active', notes: '' });
    } catch (err) {
      alert(err.message || 'Failed to save client');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Client',
      message: 'Are you sure you want to delete this client? All associated records and invoices will be affected.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;

    try {
      await clientsAPI.delete(id);
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to delete client');
    }
  };

  const statusCount = (s) => clients.filter(c => c.status === s).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="page-subtitle">{clients.length} total clients · {statusCount('active')} active</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Cards / List View Toggle */}
          <div className="flex border border-border dark:border-navy-border rounded-lg overflow-hidden">
            {['cards', 'list'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
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
            <Plus className="w-4 h-4" /> Add Client
          </Button>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'active', 'lead', 'prospect', 'inactive'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
              filterStatus === s
                ? 'bg-electric text-white shadow-sm'
                : 'bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary dark:text-slate-400 hover:bg-surface-secondary dark:hover:bg-dark-surface-card'
            }`}
          >
            {s === 'all' ? `All (${clients.length})` : `${s} (${statusCount(s)})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, company, email..."
          className="flex-1 max-w-sm"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Building2} title="No clients found" description="Try adjusting your search or filters." />
      ) : view === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(client => {
            const cid = client._id || client.id;
            return (
              <Card key={cid} hover className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={client.name} size="md" />
                      <div>
                        <p className="font-bold text-sm text-text-primary dark:text-white">{client.name}</p>
                        <p className="text-xs text-text-muted">{client.company || 'Individual Client'}</p>
                      </div>
                    </div>
                    <Badge status={client.status}>{client.status}</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-text-muted shrink-0" />
                      <span>{client.phone || '—'}</span>
                    </div>
                    {client.website && (
                      <div className="flex items-center gap-2 text-xs text-text-secondary dark:text-slate-400">
                        <Globe className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        <span className="truncate">{client.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex gap-3 pt-3 border-t border-border dark:border-navy-border">
                    <div className="flex-1 text-center">
                      <p className="text-xs text-text-muted">Revenue</p>
                      <p className="text-sm font-bold text-emerald-600">{formatCurrency(client.totalRevenue || 0)}</p>
                    </div>
                    <div className="w-px bg-border dark:bg-navy-border" />
                    <div className="flex-1 text-center">
                      <p className="text-xs text-text-muted">Projects</p>
                      <p className="text-sm font-bold text-electric">{client.activeProjects || 0}</p>
                    </div>
                    <div className="w-px bg-border dark:bg-navy-border" />
                    <div className="flex-1 text-center">
                      <p className="text-xs text-text-muted">Since</p>
                      <p className="text-sm font-bold text-text-primary dark:text-white">
                        {client.createdAt ? new Date(client.createdAt).getFullYear() : '2026'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="ghost" size="sm" className="flex-1 justify-center" onClick={() => setViewClient(client)}>
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-500/10 px-2.5"
                      onClick={() => handleDelete(cid)}
                      title="Delete Client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
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
                  <th>Client</th>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Revenue</th>
                  <th>Projects</th>
                  <th>Since</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(client => {
                  const cid = client._id || client.id;
                  const sinceYear = client.createdAt ? new Date(client.createdAt).getFullYear() : '2026';
                  return (
                    <tr key={cid}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={client.name} size="sm" />
                          <span className="font-semibold text-text-primary dark:text-white">{client.name}</span>
                        </div>
                      </td>
                      <td className="text-xs text-text-secondary dark:text-slate-300 font-medium">
                        {client.company || '—'}
                      </td>
                      <td className="text-xs text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-text-muted shrink-0" />
                          {client.email}
                        </span>
                      </td>
                      <td className="text-xs text-text-muted">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-text-muted shrink-0" />
                          {client.phone || '—'}
                        </span>
                      </td>
                      <td>
                        <Badge status={client.status}>{client.status}</Badge>
                      </td>
                      <td className="font-semibold text-emerald-600">
                        {formatCurrency(client.totalRevenue || 0)}
                      </td>
                      <td>
                        <span className="font-bold text-electric text-xs">
                          {client.activeProjects || 0}
                        </span>
                      </td>
                      <td className="text-xs text-text-muted">
                        {sinceYear}
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setViewClient(client)} title="View Profile">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-500/10 px-2"
                            onClick={() => handleDelete(cid)}
                            title="Delete Client"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
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

      {/* Add Client Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Client" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
            <Input label="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Company Ltd" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="client@company.com" required />
            <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+252 61 000 0000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Website" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://company.com" />
            <Input label="Industry" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} placeholder="Technology" />
          </div>
          <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Mogadishu, Somalia" />
          <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value="active">Active</option>
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="inactive">Inactive</option>
          </Select>
          <Textarea label="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes about this client..." rows={3} />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Add Client'}</Button>
          </div>
        </form>
      </Modal>

      {/* Comprehensive Client Profile Modal (Requirement #7) */}
      {viewClient && (
        <ClientProfileModal
          client={viewClient}
          onClose={() => setViewClient(null)}
          onUpdated={() => refetch()}
        />
      )}
    </div>
  );
}

// ─── DEDICATED CLIENT PROFILE MODAL (Requirement #7) ──────────────────────────
function ClientProfileModal({ client, onClose, onUpdated }) {
  const cid = client._id || client.id;
  const [activeTab, setActiveTab] = useState('overview');

  // Client's linked projects
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Client's linked invoices
  const [invoices, setInvoices] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  // Client's proposals & contracts
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoadingProjects(true);
      setLoadingInvoices(true);
      try {
        const [projRes, invRes, propRes, contRes] = await Promise.allSettled([
          projectsAPI.getAll({ client: cid, limit: 50 }),
          invoicesAPI.getAll({ client: cid, limit: 50 }),
          proposalsAPI.getAll({ client: cid, limit: 50 }),
          contractsAPI.getAll({ client: cid, limit: 50 }),
        ]);

        if (projRes.status === 'fulfilled') setProjects(projRes.value?.data || []);
        if (invRes.status === 'fulfilled') setInvoices(invRes.value?.data || []);
        if (propRes.status === 'fulfilled') setProposals(propRes.value?.data || []);
        if (contRes.status === 'fulfilled') setContracts(contRes.value?.data || []);
      } catch (err) {
        console.error('Error fetching client related data:', err);
      } finally {
        setLoadingProjects(false);
        setLoadingInvoices(false);
      }
    };
    fetchRelated();
  }, [cid]);

  const totalBilled = invoices.reduce((s, i) => s + (i.total || 0), 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0);
  const outstanding = invoices.filter(i => ['sent', 'partially_paid', 'overdue'].includes(i.status)).reduce((s, i) => s + (i.total || 0), 0);

  const TABS = [
    { id: 'overview', label: 'Overview & Contacts', icon: Building2 },
    { id: 'projects', label: `Projects (${projects.length})`, icon: Briefcase },
    { id: 'financials', label: `Invoices & Billing (${invoices.length})`, icon: DollarSign },
    { id: 'contracts', label: `Contracts & Proposals (${proposals.length + contracts.length})`, icon: ClipboardList },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bms-card w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-border dark:border-navy-border overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-border dark:border-navy-border bg-surface-secondary/40 dark:bg-dark-surface-secondary/40 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <Avatar name={client.name} size="lg" />
              <div>
                <h3 className="text-xl font-bold text-text-primary dark:text-white font-sora">{client.company || client.name}</h3>
                <p className="text-xs text-text-muted mt-0.5">Primary Contact: <span className="text-text-primary dark:text-white font-medium">{client.name}</span></p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge status={client.status}>{client.status}</Badge>
                  {client.industry && <span className="text-[10px] text-text-muted bg-surface-tertiary px-2 py-0.5 rounded-full">{client.industry}</span>}
                </div>
              </div>
            </div>

            <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-tertiary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pt-2 border-t border-border/60 dark:border-navy-border/60">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-electric text-white shadow-sm'
                    : 'text-text-secondary dark:text-slate-400 hover:bg-surface-tertiary dark:hover:bg-dark-surface-tertiary'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: OVERVIEW & CONTACTS */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="p-3.5 text-center">
                  <p className="text-[11px] text-text-muted">Total Revenue</p>
                  <p className="text-lg font-bold text-emerald-600 mt-1 font-sora">{formatCurrency(totalBilled || client.totalRevenue || 0)}</p>
                </Card>
                <Card className="p-3.5 text-center">
                  <p className="text-[11px] text-text-muted">Active Projects</p>
                  <p className="text-lg font-bold text-electric mt-1 font-sora">{projects.filter(p => p.status === 'active').length}</p>
                </Card>
                <Card className="p-3.5 text-center">
                  <p className="text-[11px] text-text-muted">Client Since</p>
                  <p className="text-xs font-bold text-text-primary dark:text-white mt-1.5">{formatDate(client.createdAt)}</p>
                </Card>
              </div>

              {/* Contact Information Card */}
              <Card className="p-4 space-y-3">
                <h4 className="font-bold text-xs text-text-muted uppercase tracking-wider">Company & Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-2">
                    <div>
                      <span className="text-text-muted text-[11px]">Email Address</span>
                      <p className="font-medium text-text-primary dark:text-white">{client.email || '—'}</p>
                    </div>
                    <div>
                      <span className="text-text-muted text-[11px]">Phone Number</span>
                      <p className="font-medium text-text-primary dark:text-white">{client.phone || '—'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-text-muted text-[11px]">Physical Address</span>
                      <p className="font-medium text-text-primary dark:text-white">{client.address || 'Mogadishu, Somalia'}</p>
                    </div>
                    <div>
                      <span className="text-text-muted text-[11px]">Website</span>
                      <p className="font-medium text-text-primary dark:text-white">
                        {client.website ? (
                          <a href={client.website.startsWith('http') ? client.website : `https://${client.website}`} target="_blank" rel="noreferrer" className="text-electric hover:underline flex items-center gap-1">
                            {client.website} <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              {client.notes && (
                <div>
                  <h4 className="font-bold text-xs text-text-muted uppercase tracking-wider mb-1.5">Client Brief & Notes</h4>
                  <p className="text-xs text-text-secondary dark:text-slate-300 bg-surface-secondary/40 dark:bg-dark-surface-secondary/40 p-3.5 rounded-xl leading-relaxed">
                    {client.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LINKED PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-text-primary dark:text-white font-sora">Projects for {client.company || client.name}</h4>
              {loadingProjects ? (
                <div className="flex justify-center py-8"><Spinner size="md" /></div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-border dark:border-navy-border rounded-xl">
                  <Briefcase className="w-6 h-6 text-text-muted mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-text-primary dark:text-white">No projects assigned yet</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {projects.map(p => {
                    const pid = p._id || p.id;
                    return (
                      <div key={pid} className="p-3.5 rounded-xl border border-border dark:border-navy-border bg-white dark:bg-dark-surface-secondary flex items-center justify-between text-xs">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-text-primary dark:text-white">{p.name}</span>
                            <Badge status={p.status} className="!text-[9px]">{p.status}</Badge>
                          </div>
                          <p className="text-[11px] text-text-muted mb-2">{p.service} · Due: {formatDate(p.deadline)}</p>
                          <div className="flex items-center gap-2 w-48">
                            <ProgressBar value={p.progress || 0} className="flex-1 h-1.5" />
                            <span className="text-[10px] text-text-muted">{p.progress || 0}%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600 font-sora">{formatCurrency(p.budget)}</p>
                          <p className="text-[10px] text-text-muted">Budget</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FINANCIALS & INVOICES */}
          {activeTab === 'financials' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <Card className="p-3">
                  <p className="text-[10px] text-text-muted">Total Billed</p>
                  <p className="text-base font-bold text-text-primary dark:text-white font-sora">{formatCurrency(totalBilled)}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-[10px] text-text-muted">Total Received</p>
                  <p className="text-base font-bold text-emerald-600 font-sora">{formatCurrency(totalPaid)}</p>
                </Card>
                <Card className="p-3">
                  <p className="text-[10px] text-text-muted">Outstanding</p>
                  <p className="text-base font-bold text-amber-500 font-sora">{formatCurrency(outstanding)}</p>
                </Card>
              </div>

              <div>
                <h4 className="font-bold text-xs text-text-muted uppercase tracking-wider mb-2">Invoices Issued</h4>
                {invoices.length === 0 ? (
                  <p className="text-xs text-text-muted py-6 text-center border border-dashed border-border rounded-xl">No invoices billed to this client yet.</p>
                ) : (
                  <div className="space-y-2">
                    {invoices.map(inv => {
                      const iid = inv._id || inv.id;
                      return (
                        <div key={iid} className="flex items-center justify-between p-3 rounded-xl border border-border dark:border-navy-border bg-white dark:bg-dark-surface-secondary text-xs">
                          <div>
                            <p className="font-bold text-text-primary dark:text-white">{inv.number}</p>
                            <p className="text-[10px] text-text-muted">Due: {formatDate(inv.dueDate)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-emerald-600 font-sora">{formatCurrency(inv.total)}</p>
                            <Badge status={inv.status} className="!text-[9px]">{inv.status}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: CONTRACTS & PROPOSALS */}
          {activeTab === 'contracts' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-xs text-text-muted uppercase tracking-wider mb-2">Contracts & Service Agreements</h4>
                {contracts.length === 0 ? (
                  <p className="text-xs text-text-muted py-4 text-center border border-dashed border-border rounded-xl mb-4">No signed contracts on file.</p>
                ) : (
                  <div className="space-y-2 mb-4">
                    {contracts.map(cont => (
                      <div key={cont._id || cont.id} className="p-3 rounded-xl border border-border dark:border-navy-border bg-white dark:bg-dark-surface-secondary text-xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-text-primary dark:text-white">{cont.title || cont.number}</p>
                          <p className="text-[10px] text-text-muted">Start: {formatDate(cont.startDate)} · End: {formatDate(cont.endDate)}</p>
                        </div>
                        <Badge status={cont.status}>{cont.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}

                <h4 className="font-bold text-xs text-text-muted uppercase tracking-wider mb-2">Commercial Proposals</h4>
                {proposals.length === 0 ? (
                  <p className="text-xs text-text-muted py-4 text-center border border-dashed border-border rounded-xl">No active proposals recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {proposals.map(prop => (
                      <div key={prop._id || prop.id} className="p-3 rounded-xl border border-border dark:border-navy-border bg-white dark:bg-dark-surface-secondary text-xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-text-primary dark:text-white">{prop.title || prop.number}</p>
                          <p className="text-[10px] text-text-muted">Sent: {formatDate(prop.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600 font-sora">{formatCurrency(prop.total || prop.value || 0)}</p>
                          <Badge status={prop.status}>{prop.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
