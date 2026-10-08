import { useState } from 'react';
import { Plus, Settings2, Edit, Trash2 } from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Select, Textarea, Spinner } from '../../components/ui';
import { servicesAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { useConfirm } from '../../context/ConfirmContext';
import { formatCurrency } from '../../utils/helpers';

const CATEGORY_COLORS = {
  Development: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  Design: 'bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400',
  Consulting: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  Infrastructure: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
  Marketing: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
};

export default function Services() {
  const { confirm } = useConfirm();
  const { data: servicesRes, loading, error, refetch } = useApi(() => servicesAPI.getAll({ limit: 100 }));
  const services = servicesRes?.data || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editService, setEditService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    startingPrice: '',
    status: 'active',
    deliveryTime: '',
    category: 'Development',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        startingPrice: Number(form.startingPrice) || 0,
      };

      if (editService) {
        await servicesAPI.update(editService._id || editService.id, payload);
      } else {
        await servicesAPI.create(payload);
      }
      setModalOpen(false);
      setEditService(null);
      setForm({ name: '', description: '', startingPrice: '', status: 'active', deliveryTime: '', category: 'Development' });
      refetch();
    } catch (err) {
      console.error('Failed to save service:', err);
      alert('Error saving service: ' + (err.message || 'Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (service) => {
    setEditService(service);
    setForm({
      name: service.name || '',
      description: service.description || '',
      startingPrice: String(service.startingPrice || ''),
      status: service.status || 'active',
      deliveryTime: service.deliveryTime || '',
      category: service.category || 'Development',
    });
    setModalOpen(true);
  };

  const deleteService = async (id) => {
    const ok = await confirm({
      title: 'Delete Service',
      message: 'Are you sure you want to permanently delete this service? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
    });
    if (!ok) return;
    try {
      await servicesAPI.delete(id);
      refetch();
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  const prices = services.map(s => s.startingPrice).filter(p => typeof p === 'number' && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const activeCount = services.filter(s => s.status === 'active').length;
  const inactiveCount = services.filter(s => s.status === 'inactive').length;
  const categoriesCount = [...new Set(services.map(s => s.category).filter(Boolean))].length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Services</h1>
          <p className="page-subtitle">{activeCount} active services offered by HIRAD</p>
        </div>
        <Button
          onClick={() => {
            setEditService(null);
            setForm({ name: '', description: '', startingPrice: '', status: 'active', deliveryTime: '', category: 'Development' });
            setModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-xl font-bold text-electric font-sora">{activeCount}</p>
          <p className="text-xs text-text-muted mt-1">Active Services</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xl font-bold text-slate-400 font-sora">{inactiveCount}</p>
          <p className="text-xs text-text-muted mt-1">Inactive Services</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xl font-bold text-emerald-600 font-sora">{formatCurrency(minPrice)}</p>
          <p className="text-xs text-text-muted mt-1">Starting From</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-xl font-bold text-text-primary dark:text-white font-sora">{categoriesCount}</p>
          <p className="text-xs text-text-muted mt-1">Categories</p>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-500">Failed to load services from database.</div>
      ) : (
        /* Service Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map(service => {
            const id = service._id || service.id;
            return (
              <Card key={id} hover className={`p-5 ${service.status === 'inactive' ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center flex-shrink-0">
                    <Settings2 className="w-5 h-5 text-electric" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge text-[10px] ${CATEGORY_COLORS[service.category] || ''}`}>{service.category}</span>
                    <Badge status={service.status}>{service.status}</Badge>
                  </div>
                </div>

                <h3 className="font-bold text-text-primary dark:text-white mb-2 font-sora">{service.name}</h3>
                <p className="text-xs text-text-muted mb-4 line-clamp-3">{service.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-text-muted">Starting from</p>
                    <p className="text-lg font-bold text-emerald-600 font-sora">{formatCurrency(service.startingPrice || 0)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Delivery</p>
                    <p className="text-xs font-semibold text-text-primary dark:text-white">{service.deliveryTime || 'Flexible'}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-border dark:border-navy-border">
                  <Button variant="ghost" size="sm" className="flex-1 justify-center" onClick={() => openEdit(service)}>
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => deleteService(id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </Card>
            );
          })}

          {services.length === 0 && (
            <div className="col-span-full text-center py-12 text-text-muted">
              No services found. Click "Add Service" to register HIRAD services.
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => { setModalOpen(false); setEditService(null); }} title={editService ? 'Edit Service' : 'Add Service'} size="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Service Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Textarea label="Description *" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Starting Price ($) *" type="number" value={form.startingPrice} onChange={e => setForm({ ...form, startingPrice: e.target.value })} required />
            <Input label="Delivery Time" value={form.deliveryTime} onChange={e => setForm({ ...form, deliveryTime: e.target.value })} placeholder="4-12 weeks" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Consulting">Consulting</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Marketing">Marketing</option>
            </Select>
            <Select label="Status" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setModalOpen(false); setEditService(null); }}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : (editService ? 'Save Changes' : 'Add Service')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
