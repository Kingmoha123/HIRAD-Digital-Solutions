import { useState } from 'react';
import { Plus, AlertTriangle, FileText, Trash2 } from 'lucide-react';
import { Card, Badge, Button, SearchBar, Modal, Input, Select, Spinner } from '../../components/ui';
import { contractsAPI, clientsAPI, projectsAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCurrency, formatDate, daysUntil } from '../../utils/helpers';

const STATUSES = {
  draft: { label: 'Draft', color: 'gray' },
  active: { label: 'Active', color: 'active' },
  expiring_soon: { label: 'Expiring Soon', color: 'warning' },
  expired: { label: 'Expired', color: 'gray' },
  terminated: { label: 'Terminated', color: 'danger' },
};

function getContractStatus(contract) {
  if (contract.status === 'draft' || contract.status === 'terminated') return contract.status;
  const days = daysUntil(contract.endDate);
  if (days < 0) return 'expired';
  if (days < 30) return 'expiring_soon';
  return 'active';
}

export default function Contracts() {
  const { confirm } = useConfirm();
  const { data: contractsRes, loading, refetch } = useApi(() => contractsAPI.getAll({ limit: 100 }));
  const { data: clientsRes } = useApi(() => clientsAPI.getAll({ limit: 100 }));
  const { data: projectsRes } = useApi(() => projectsAPI.getAll({ limit: 100 }));

  const contracts = contractsRes?.data || [];
  const clients = clientsRes?.data || [];
  const projects = projectsRes?.data || [];

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    client: '',
    project: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    value: '',
    status: 'active',
  });

  const filtered = contracts.filter(c => {
    const num = (c.number || '').toLowerCase();
    const cName = (c.clientName || '').toLowerCase();
    const term = search.toLowerCase();
    return !search || num.includes(term) || cName.includes(term);
  });

  const expiringContracts = contracts.filter(c => {
    const days = daysUntil(c.endDate);
    return days >= 0 && days < 30 && c.status === 'active';
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const selectedClient = clients.find(c => (c._id || c.id) === form.client);
      const selectedProject = projects.find(p => (p._id || p.id) === form.project);
      const generatedNumber = `CON-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

      await contractsAPI.create({
        number: generatedNumber,
        client: form.client,
        clientName: selectedClient ? selectedClient.company : 'Client',
        project: form.project || undefined,
        projectName: selectedProject ? selectedProject.name : undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        value: Number(form.value) || 0,
        status: form.status,
      });

      setModalOpen(false);
      setForm({ client: '', project: '', startDate: new Date().toISOString().split('T')[0], endDate: '', value: '', status: 'active' });
      refetch();
    } catch (err) {
      console.error('Failed to create contract:', err);
      alert('Error creating contract: ' + (err.message || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Contract',
      message: 'Are you sure you want to permanently delete this contract? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await contractsAPI.delete(id);
      refetch();
    } catch (err) {
      console.error('Failed to delete contract:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Contracts</h1>
          <p className="page-subtitle">
            {contracts.length} contracts · {contracts.filter(c => getContractStatus(c) === 'active').length} active
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" /> New Contract
        </Button>
      </div>

      {/* Expiry Alert */}
      {expiringContracts.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
              {expiringContracts.length} contract{expiringContracts.length > 1 ? 's' : ''} expiring soon
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">
              {expiringContracts.map(c => `${c.number} (${daysUntil(c.endDate)} days)`).join(' · ')}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(STATUSES).slice(0, 4).map(([key, val]) => (
          <Card key={key} className="p-4 text-center">
            <p className="text-xl font-bold text-text-primary dark:text-white font-sora">
              {contracts.filter(c => getContractStatus(c) === key).length}
            </p>
            <p className="text-xs text-text-muted mt-1">{val.label}</p>
          </Card>
        ))}
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Search contracts..." className="max-w-sm" />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        /* Table */
        <Card>
          <div className="overflow-x-auto">
            <table className="bms-table">
              <thead>
                <tr>
                  <th>Contract #</th>
                  <th>Client</th>
                  <th>Project</th>
                  <th>Value</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days Left</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(contract => {
                  const id = contract._id || contract.id;
                  const computedStatus = getContractStatus(contract);
                  const days = daysUntil(contract.endDate);
                  return (
                    <tr key={id}>
                      <td>
                        <span className="font-mono font-semibold text-electric text-sm">{contract.number}</span>
                      </td>
                      <td className="font-medium">{contract.clientName}</td>
                      <td className="text-xs text-text-muted max-w-[150px] truncate">{contract.projectName || 'General Service'}</td>
                      <td className="font-bold text-emerald-600">{formatCurrency(contract.value || 0)}</td>
                      <td className="text-xs">{formatDate(contract.startDate)}</td>
                      <td className="text-xs">{formatDate(contract.endDate)}</td>
                      <td>
                        {days >= 0 ? (
                          <span className={`text-xs font-semibold ${days < 30 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {days}d
                          </span>
                        ) : (
                          <span className="text-xs text-red-500 font-semibold">Expired</span>
                        )}
                      </td>
                      <td><Badge status={computedStatus}>{STATUSES[computedStatus]?.label || computedStatus}</Badge></td>
                      <td className="text-right">
                        <button
                          onClick={() => handleDelete(id)}
                          className="p-1.5 hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary rounded text-text-muted hover:text-rose-500 transition-colors"
                          title="Delete contract"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-text-muted">
                      No contracts found in database. Click "New Contract" to add one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New Contract Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Contract" size="lg">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select label="Client *" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} required>
              <option value="">Select client</option>
              {clients.map(c => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.company || c.name}</option>
              ))}
            </Select>
            <Select label="Project" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })}>
              <option value="">Select project (optional)</option>
              {projects.map(p => (
                <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
              ))}
            </Select>
          </div>
          <Input label="Contract Value ($) *" type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date *" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
            <Input label="End Date *" type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Contract'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
