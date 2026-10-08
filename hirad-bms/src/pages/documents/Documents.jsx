import { useState } from 'react';
import { Upload, Download, Eye, Trash2 } from 'lucide-react';
import { Card, Badge, Button, SearchBar, Modal, Select, Input, Avatar, Spinner } from '../../components/ui';
import { documentsAPI, clientsAPI, projectsAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useConfirm } from '../../context/ConfirmContext';
import { formatDate } from '../../utils/helpers';

const CATEGORIES = [
  { id: 'all', label: 'All Documents' },
  { id: 'project_files', label: 'Project Files' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'proposals', label: 'Proposals' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'company', label: 'Company Documents' },
  { id: 'client', label: 'Client Documents' },
];

const TYPE_ICONS = {
  pdf: '📄',
  docx: '📝',
  xlsx: '📊',
  png: '🖼️',
  jpg: '🖼️',
  zip: '🗜️',
};

const CAT_COLORS = {
  project_files: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  contracts: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  proposals: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  invoices: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  company: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  client: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400',
};

export default function Documents() {
  const { confirm } = useConfirm();
  const { data: docsRes, loading, refetch } = useApi(() => documentsAPI.getAll({ limit: 100 }));
  const { data: clientsRes } = useApi(() => clientsAPI.getAll({ limit: 100 }));
  const { data: projectsRes } = useApi(() => projectsAPI.getAll({ limit: 100 }));

  const documents = docsRes?.data || [];
  const clients = clientsRes?.data || [];
  const projects = projectsRes?.data || [];

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [view, setView] = useState('grid');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'company',
    type: 'pdf',
    size: '1.2 MB',
    url: '',
    client: '',
    project: '',
  });

  const filtered = documents.filter(d => {
    const matchSearch = !search || (d.name || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || d.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await documentsAPI.create({
        name: form.name,
        category: form.category,
        type: form.type,
        size: form.size || '1.0 MB',
        url: form.url || `https://storage.hirad.so/docs/${encodeURIComponent(form.name)}.${form.type}`,
        client: form.client || undefined,
        project: form.project || undefined,
        uploadedByName: 'HIRAD Team',
      });

      setUploadOpen(false);
      setForm({ name: '', category: 'company', type: 'pdf', size: '1.2 MB', url: '', client: '', project: '' });
      refetch();
    } catch (err) {
      console.error('Failed to upload document:', err);
      alert('Error uploading document: ' + (err.message || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete Document',
      message: 'Are you sure you want to permanently delete this document? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await documentsAPI.delete(id);
      refetch();
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">{documents.length} documents stored in database</p>
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
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="w-4 h-4" /> Upload
          </Button>
        </div>
      </div>

      {/* Category sidebar + content */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Categories */}
        <div className="lg:w-56 flex-shrink-0">
          <Card className="p-3">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">Categories</p>
            <div className="space-y-0.5">
              {CATEGORIES.map(cat => {
                const count = cat.id === 'all' ? documents.length : documents.filter(d => d.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCat(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                      filterCat === cat.id
                        ? 'bg-electric/10 text-electric font-semibold'
                        : 'text-text-secondary dark:text-slate-400 hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-xs text-text-muted">{count}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Document List */}
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search documents..." className="mb-4" />

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(doc => {
                const id = doc._id || doc.id;
                return (
                  <Card key={id} hover className="p-4 relative group">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-surface-tertiary dark:bg-dark-surface-secondary flex items-center justify-center text-2xl flex-shrink-0">
                        {TYPE_ICONS[doc.type] || '📄'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text-primary dark:text-white truncate">{doc.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{doc.size || '1.0 MB'}</p>
                        <span className={`badge mt-1.5 text-[10px] capitalize ${CAT_COLORS[doc.category] || ''}`}>
                          {(doc.category || 'other').replace('_', ' ')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(id)}
                        className="text-text-muted hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border dark:border-navy-border">
                      <p className="text-[11px] text-text-muted mb-3">
                        Uploaded by {doc.uploadedByName || 'Team'} · {formatDate(doc.createdAt || doc.uploadedAt)}
                      </p>
                      <div className="flex gap-2">
                        <a
                          href={doc.url || '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 btn-bms-ghost !py-1.5 !text-xs justify-center"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </a>
                      </div>
                    </div>
                  </Card>
                );
              })}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12 text-text-muted border-2 border-dashed border-border dark:border-navy-border rounded-xl">
                  No documents found. Click "Upload" to register files.
                </div>
              )}
            </div>
          ) : (
            <Card>
              <div className="overflow-x-auto">
                <table className="bms-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Size</th>
                      <th>Uploaded By</th>
                      <th>Date</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(doc => {
                      const id = doc._id || doc.id;
                      return (
                        <tr key={id}>
                          <td>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{TYPE_ICONS[doc.type] || '📄'}</span>
                              <span className="font-medium text-sm">{doc.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge text-[10px] capitalize ${CAT_COLORS[doc.category] || ''}`}>
                              {(doc.category || 'other').replace('_', ' ')}
                            </span>
                          </td>
                          <td className="text-xs uppercase font-mono text-text-muted">.{doc.type || 'file'}</td>
                          <td className="text-xs text-text-muted">{doc.size || '1.0 MB'}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <Avatar name={doc.uploadedByName || 'Team'} size="xs" />
                              <span className="text-xs">{doc.uploadedByName || 'Team'}</span>
                            </div>
                          </td>
                          <td className="text-xs">{formatDate(doc.createdAt || doc.uploadedAt)}</td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <a
                                href={doc.url || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary rounded text-text-muted hover:text-electric transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleDelete(id)}
                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-text-muted hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
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
        </div>
      </div>

      {/* Upload Modal */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Document">
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Document Name *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Master Services Agreement"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </Select>
            <Select
              label="File Format"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              <option value="pdf">PDF Document (.pdf)</option>
              <option value="docx">Word (.docx)</option>
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="png">PNG Image (.png)</option>
              <option value="zip">Archive (.zip)</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Link to Client (optional)"
              value={form.client}
              onChange={e => setForm({ ...form, client: e.target.value })}
            >
              <option value="">No client</option>
              {clients.map(c => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.company || c.name}</option>
              ))}
            </Select>
            <Select
              label="Link to Project (optional)"
              value={form.project}
              onChange={e => setForm({ ...form, project: e.target.value })}
            >
              <option value="">No project</option>
              {projects.map(p => (
                <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
              ))}
            </Select>
          </div>
          <Input
            label="File Storage URL or Path (optional)"
            value={form.url}
            onChange={e => setForm({ ...form, url: e.target.value })}
            placeholder="https://... or auto-generated"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Uploading...' : 'Save Document'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
