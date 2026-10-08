import { useState } from 'react';
import { classNames, getInitials } from '../../utils/helpers';

// ---- Badge ----
export function Badge({ status, children, className = '' }) {
  const statusMap = {
    active: 'badge-active', completed: 'badge-cyan', paid: 'badge-active',
    planning: 'badge-info', in_progress: 'badge-info', on_hold: 'badge-warning',
    review: 'badge-purple', cancelled: 'badge-danger', overdue: 'badge-danger',
    draft: 'badge-gray', sent: 'badge-info', pending: 'badge-warning',
    inactive: 'badge-gray', expired: 'badge-gray', terminated: 'badge-danger',
    won: 'badge-active', lost: 'badge-danger', new: 'badge-info',
    contacted: 'badge-purple', proposal: 'badge-warning', negotiation: 'badge-cyan',
    prospect: 'badge-purple', lead: 'badge-info', accepted: 'badge-active',
    rejected: 'badge-danger', todo: 'badge-gray', partially_paid: 'badge-warning',
    low: 'badge-gray', medium: 'badge-info', high: 'badge-warning', urgent: 'badge-danger',
    expiring_soon: 'badge-warning',
  };
  const cls = statusMap[status] || 'badge-gray';
  return <span className={classNames('badge', cls, className)}>{children}</span>;
}

// ---- Avatar ----
export function Avatar({ name, size = 'md', className = '' }) {
  const sizes = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };
  return (
    <div className={classNames('avatar flex-shrink-0', sizes[size], className)}>
      {getInitials(name)}
    </div>
  );
}

// ---- Progress Bar ----
export function ProgressBar({ value, max = 100, className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-electric' : pct >= 25 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className={classNames('progress-bar', className)}>
      <div className={classNames('progress-bar-fill', color)} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ---- Card ----
export function Card({ children, className = '', hover = false }) {
  return (
    <div className={classNames(hover ? 'bms-card-hover' : 'bms-card', className)}>
      {children}
    </div>
  );
}

// ---- Stat Card ----
export function StatCard({ icon: Icon, label, value, trend, trendLabel, color = 'blue', className = '' }) {
  const colorMap = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-electric',
    green: 'bg-green-50 dark:bg-green-900/20 text-emerald-600',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600',
  };
  return (
    <div className={classNames('stat-card', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary dark:text-slate-400">{label}</span>
        <div className={classNames('w-10 h-10 rounded-xl flex items-center justify-center', colorMap[color])}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>
      <div className="mt-1">
        <span className="text-2xl font-bold text-text-primary dark:text-white font-sora">{value}</span>
        {trend !== undefined && (
          <p className={classNames('text-xs mt-1', trend >= 0 ? 'text-emerald-500' : 'text-red-500')}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel}
          </p>
        )}
      </div>
    </div>
  );
}

// ---- Button ----
export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const variants = {
    primary: 'btn-bms-primary',
    secondary: 'btn-bms-secondary',
    ghost: 'btn-bms-ghost',
    danger: 'btn-bms-danger',
  };
  const sizes = {
    sm: '!px-3 !py-1.5 !text-xs',
    md: '',
    lg: '!px-6 !py-3 !text-base',
  };
  return (
    <button className={classNames(variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

// ---- Input ----
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="bms-label">{label}</label>}
      <input className={classNames('bms-input', error && 'border-red-400 focus:border-red-500 focus:ring-red-200')} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ---- Select ----
export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="bms-label">{label}</label>}
      <select className={classNames('bms-select', error && 'border-red-400')} {...props}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ---- Textarea ----
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && <label className="bms-label">{label}</label>}
      <textarea className={classNames('bms-input resize-none', error && 'border-red-400')} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ---- Modal ----
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className={classNames('modal-box', sizes[size])} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border dark:border-navy-border">
          <h3 className="text-lg font-bold text-text-primary dark:text-white font-sora">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary hover:text-text-primary dark:hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ---- Empty State ----
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-tertiary dark:bg-dark-surface-secondary flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-text-muted" />
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary dark:text-white mb-1">{title}</h3>
      {description && <p className="text-sm text-text-muted max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ---- Loading Spinner ----
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={classNames('border-2 border-electric/20 border-t-electric rounded-full animate-spin', sizes[size], className)} />
  );
}

// ---- Search Bar ----
export function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={classNames('relative', className)}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="bms-input pl-9"
      />
    </div>
  );
}

// ---- Tab List ----
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tab-list">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={classNames('tab-item', active === tab.id && 'active')}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded-full bg-surface-tertiary dark:bg-dark-surface-secondary text-text-muted">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ---- Dropdown ----
export function DropdownMenu({ trigger, items, className = '' }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={classNames('relative', className)}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bms-card shadow-dropdown z-50 py-1 animate-fade-in">
            {items.map((item, i) =>
              item.divider ? (
                <div key={i} className="h-px bg-border dark:bg-navy-border my-1" />
              ) : (
                <button
                  key={i}
                  onClick={() => { item.onClick(); setOpen(false); }}
                  className={classNames(
                    'w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors',
                    item.danger
                      ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      : 'text-text-primary dark:text-slate-200 hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary'
                  )}
                >
                  {item.icon && <item.icon className="w-4 h-4 flex-shrink-0" />}
                  {item.label}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

