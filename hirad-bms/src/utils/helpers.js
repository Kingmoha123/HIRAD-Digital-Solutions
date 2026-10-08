// Utility helpers for the BMS

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const timeAgo = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export const statusBadgeClass = (status) => {
  const map = {
    active: 'badge-active',
    completed: 'badge-cyan',
    paid: 'badge-active',
    planning: 'badge-info',
    in_progress: 'badge-info',
    on_hold: 'badge-warning',
    review: 'badge-purple',
    cancelled: 'badge-danger',
    overdue: 'badge-danger',
    draft: 'badge-gray',
    sent: 'badge-info',
    pending: 'badge-warning',
    inactive: 'badge-gray',
    expired: 'badge-gray',
    terminated: 'badge-danger',
    won: 'badge-active',
    lost: 'badge-danger',
    new: 'badge-info',
    contacted: 'badge-purple',
    proposal: 'badge-warning',
    negotiation: 'badge-cyan',
    prospect: 'badge-purple',
    lead: 'badge-info',
    accepted: 'badge-active',
    rejected: 'badge-danger',
    todo: 'badge-gray',
    partially_paid: 'badge-warning',
    expiring_soon: 'badge-warning',
  };
  return map[status] || 'badge-gray';
};

export const priorityBadgeClass = (priority) => {
  const map = {
    low: 'badge-gray',
    medium: 'badge-info',
    high: 'badge-warning',
    urgent: 'badge-danger',
  };
  return map[priority] || 'badge-gray';
};

export const getProgressColor = (progress) => {
  if (progress >= 80) return 'bg-emerald-500';
  if (progress >= 50) return 'bg-electric';
  if (progress >= 25) return 'bg-amber-500';
  return 'bg-red-500';
};

export const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
};

export const daysUntil = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  return Math.ceil((date - now) / 86400000);
};

export const isOverdue = (dateStr) => daysUntil(dateStr) < 0;

export const truncate = (str, max = 50) => {
  if (!str) return '';
  return str.length > max ? str.slice(0, max) + '…' : str;
};

export const classNames = (...classes) => classes.filter(Boolean).join(' ');

// Filter helpers
export const filterBySearch = (items, query, fields) => {
  if (!query) return items;
  const q = query.toLowerCase();
  return items.filter(item =>
    fields.some(field => {
      const val = item[field];
      return val && String(val).toLowerCase().includes(q);
    })
  );
};

export const sortByField = (items, field, dir = 'asc') => {
  return [...items].sort((a, b) => {
    const va = a[field], vb = b[field];
    if (va < vb) return dir === 'asc' ? -1 : 1;
    if (va > vb) return dir === 'asc' ? 1 : -1;
    return 0;
  });
};
