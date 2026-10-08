import { useState, useEffect } from 'react';
import hiradIcon from '../../assets/hirad-icon.svg?url';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Briefcase, CheckSquare, Calendar, Clock,
  FileText, DollarSign, BarChart2, Settings, Bell, Search, Sun, Moon,
  ChevronDown, ChevronRight, Menu, X, LogOut, UserCircle, Building2,
  TrendingUp, Receipt, CreditCard, Wallet, FolderOpen, Target, Handshake,
  ClipboardList, UserCheck, Layers, Megaphone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useConfirm } from '../../context/ConfirmContext';
import { Avatar, Badge } from '../ui';
import { classNames, timeAgo } from '../../utils/helpers';
import { tasksAPI, invoicesAPI, meetingsAPI, paymentsAPI, clientsAPI, searchAPI, notificationsAPI } from '../../services/api';

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'crm',
    label: 'CRM',
    icon: Target,
    roles: ['super_admin', 'admin', 'project_manager'],
    children: [
      { label: 'Leads', path: '/crm/leads', icon: Megaphone, roles: ['super_admin', 'admin', 'project_manager'] },
      { label: 'Clients', path: '/crm/clients', icon: UserCheck, roles: ['super_admin', 'admin', 'project_manager', 'accountant'] },
    ],
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: Briefcase,
    roles: ['super_admin', 'admin', 'project_manager', 'developer', 'designer', 'employee'],
    children: [
      { label: 'All Projects', path: '/projects', icon: Layers },
      { label: 'My Projects', path: '/projects/mine', icon: Briefcase },
    ],
  },
  {
    id: 'work',
    label: 'Work Management',
    icon: CheckSquare,
    roles: ['super_admin', 'admin', 'project_manager', 'developer', 'designer', 'employee'],
    children: [
      { label: 'Tasks', path: '/tasks', icon: CheckSquare },
      { label: 'Calendar', path: '/calendar', icon: Calendar },
      { label: 'Meetings', path: '/meetings', icon: Users },
      { label: 'Time Tracking', path: '/time', icon: Clock },
    ],
  },
  {
    id: 'business',
    label: 'Business',
    icon: Handshake,
    roles: ['super_admin', 'admin', 'project_manager'],
    children: [
      { label: 'Services', path: '/services', icon: Building2 },
      { label: 'Proposals', path: '/proposals', icon: FileText },
      { label: 'Contracts', path: '/contracts', icon: ClipboardList },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    roles: ['super_admin', 'admin', 'accountant'],
    children: [
      { label: 'Invoices', path: '/finance/invoices', icon: Receipt },
      { label: 'Payments', path: '/finance/payments', icon: CreditCard },
      { label: 'Expenses', path: '/finance/expenses', icon: Wallet },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: FolderOpen,
    path: '/documents',
    roles: ['super_admin', 'admin', 'project_manager', 'developer', 'designer', 'employee', 'accountant'],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart2,
    path: '/reports',
    roles: ['super_admin', 'admin', 'accountant', 'project_manager'],
  },
  {
    id: 'team',
    label: 'Team',
    icon: Users,
    roles: ['super_admin', 'admin', 'project_manager'],
    children: [
      { label: 'Employees', path: '/team/employees', icon: UserCircle },
      { label: 'Departments', path: '/team/departments', icon: Building2 },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

function NavItem({ item, collapsed, onClose }) {
  const location = useLocation();
  const [open, setOpen] = useState(() => {
    if (!item.children) return false;
    return item.children.some(c => location.pathname.startsWith(c.path));
  });

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  if (!item.children) {
    return (
      <Link
        to={item.path}
        onClick={onClose}
        className={classNames('sidebar-link', isActive(item.path) && 'active')}
        title={collapsed ? item.label : ''}
      >
        <item.icon className="sidebar-link-icon" />
        {!collapsed && <span className="flex-1">{item.label}</span>}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={classNames(
          'sidebar-link w-full',
          item.children.some(c => isActive(c.path)) && 'text-white'
        )}
        title={collapsed ? item.label : ''}
      >
        <item.icon className="sidebar-link-icon" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </>
        )}
      </button>
      {open && !collapsed && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
          {item.children.map(child => (
            <Link
              key={child.path}
              to={child.path}
              onClick={onClose}
              className={classNames('sidebar-link !py-2 !text-xs', isActive(child.path) && 'active')}
            >
              <child.icon className="w-4 h-4 flex-shrink-0" />
              <span>{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const { confirm } = useConfirm();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Sign Out of Workspace',
      message: 'Are you sure you want to end your session? You will need to log in again to access your account.',
      confirmText: 'Sign Out',
      cancelText: 'Stay Logged In',
      variant: 'warning',
      icon: LogOut,
    });
    if (ok) {
      logout();
      navigate('/login');
    }
  };

  const userRole = user?.role || 'employee';

  // Filter NAV_ITEMS strictly based on user authorization
  const visibleNavItems = NAV_ITEMS.map(item => {
    if (item.roles && !item.roles.includes(userRole) && userRole !== 'super_admin') {
      return null;
    }
    if (item.children) {
      const visibleChildren = item.children.filter(child => {
        if (!child.roles) return true;
        return userRole === 'super_admin' || child.roles.includes(userRole);
      });
      if (visibleChildren.length === 0) return null;
      return { ...item, children: visibleChildren };
    }
    return item;
  }).filter(Boolean);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={classNames(
        'fixed left-0 top-0 h-full bg-navy flex flex-col z-40 transition-all duration-300 shadow-sidebar',
        collapsed ? 'w-16' : 'w-64',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <img src={hiradIcon} alt="HIRAD" className="w-8 h-8 flex-shrink-0" />
              <div>
                <span className="text-white font-bold text-sm font-sora leading-tight block">HIRAD BMS</span>
                <span className="text-slate-500 text-[10px] leading-tight block">Internal Operations</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto">
              <img src={hiradIcon} alt="HIRAD" className="w-8 h-8" />
            </div>
          )}
          <button
            onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
            className="text-slate-400 hover:text-white p-1 rounded hidden lg:block"
          >
            <Menu className="w-4 h-4" />
          </button>
          <button onClick={() => setMobileOpen(false)} className="text-slate-400 hover:text-white p-1 rounded lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {visibleNavItems.map(item => (
            <NavItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              onClose={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        {/* User Card */}
        <div className="border-t border-white/10 p-3 flex-shrink-0">
          <div className={classNames('flex items-center gap-3', collapsed && 'flex-col justify-center')}>
            <Avatar name={user?.name} size="sm" className="flex-shrink-0" />
            {!collapsed ? (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-electric/20 text-cyan-brand">
                      {user?.role?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 p-1.5 rounded transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 p-1.5 rounded transition-colors mt-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export function TopBar({ collapsed, setMobileOpen }) {
  const { user, logout } = useAuth();
  const { confirm } = useConfirm();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleTopBarLogout = async () => {
    const ok = await confirm({
      title: 'Sign Out of Workspace',
      message: 'Are you sure you want to end your session? You will need to log in again to access your account.',
      confirmText: 'Sign Out',
      cancelText: 'Stay Logged In',
      variant: 'warning',
      icon: LogOut,
    });
    if (ok) {
      logout();
      navigate('/login');
    }
  };

  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  // ── Fetch real system notifications from API data ──
  const loadNotifications = async () => {
    setNotifLoading(true);
    try {
      const built = [];

      // Pending Tasks
      const tasksRes = await tasksAPI.getAll({ limit: 50 }).catch(() => null);
      const tasks = tasksRes?.data || [];
      const todoTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in_progress');
      if (todoTasks.length > 0) {
        const t = todoTasks[0];
        built.push({
          id: `task-${t._id || t.id}`,
          title: `Task: ${t.name || t.title}`,
          message: `${todoTasks.length} task${todoTasks.length > 1 ? 's' : ''} pending — assigned to ${t.assigneeName || 'team'}`,
          type: 'task',
          link: '/tasks',
          read: false,
          createdAt: t.createdAt || new Date().toISOString(),
        });
      }

      // Unpaid / Overdue Invoices
      const invRes = await invoicesAPI.getAll({ limit: 50 }).catch(() => null);
      const invoices = invRes?.data || [];
      const overdueInvoices = invoices.filter(i => i.status === 'overdue');
      const pendingInvoices = invoices.filter(i => i.status === 'sent' || i.status === 'pending');
      if (overdueInvoices.length > 0) {
        built.push({
          id: `inv-overdue-${Date.now()}`,
          title: `⚠️ ${overdueInvoices.length} Overdue Invoice${overdueInvoices.length > 1 ? 's' : ''}`,
          message: `${overdueInvoices.map(i => i.number).slice(0, 2).join(', ')} ${overdueInvoices.length > 2 ? `+${overdueInvoices.length - 2} more` : ''} require immediate attention`,
          type: 'invoice',
          link: '/finance/invoices',
          read: false,
          createdAt: overdueInvoices[0]?.updatedAt || new Date().toISOString(),
        });
      } else if (pendingInvoices.length > 0) {
        built.push({
          id: `inv-pending-${Date.now()}`,
          title: `${pendingInvoices.length} Invoice${pendingInvoices.length > 1 ? 's' : ''} Awaiting Payment`,
          message: `Total pending: ${pendingInvoices.map(i => i.number).slice(0, 2).join(', ')}`,
          type: 'invoice',
          link: '/finance/invoices',
          read: false,
          createdAt: pendingInvoices[0]?.createdAt || new Date().toISOString(),
        });
      }

      // Upcoming Meetings
      const meetRes = await meetingsAPI.getAll({ limit: 20 }).catch(() => null);
      const meetings = meetRes?.data || [];
      const upcoming = meetings.filter(m => m.status === 'upcoming');
      if (upcoming.length > 0) {
        const m = upcoming[0];
        built.push({
          id: `meet-${m._id || m.id}`,
          title: `Meeting: ${m.title}`,
          message: `${upcoming.length} upcoming meeting${upcoming.length > 1 ? 's' : ''} — next: ${m.date ? new Date(m.date).toLocaleDateString() : 'Soon'}`,
          type: 'meeting',
          link: '/meetings',
          read: false,
          createdAt: m.createdAt || new Date().toISOString(),
        });
      }

      // Recent Payments
      const payRes = await paymentsAPI.getAll().catch(() => null);
      const payments = payRes?.data || [];
      if (payments.length > 0) {
        const latest = payments[0];
        built.push({
          id: `pay-${latest._id || latest.id}`,
          title: `Payment Received`,
          message: `${latest.clientName} — $${(latest.amount || 0).toLocaleString()} via ${latest.method?.replace('_', ' ') || 'transfer'}`,
          type: 'payment',
          link: '/finance/payments',
          read: true,
          createdAt: latest.date || latest.createdAt || new Date().toISOString(),
        });
      }

      // New Clients (added in last 7 days)
      const clientsRes = await clientsAPI.getAll({ limit: 50 }).catch(() => null);
      const clients = clientsRes?.data || [];
      const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
      const newClients = clients.filter(c => c.createdAt && new Date(c.createdAt) > weekAgo);
      if (newClients.length > 0) {
        built.push({
          id: `client-${newClients[0]._id || newClients[0].id}`,
          title: `New Client${newClients.length > 1 ? 's' : ''} Added`,
          message: `${newClients.map(c => c.company || c.name).slice(0, 2).join(', ')} joined this week`,
          type: 'client',
          link: '/crm/clients',
          read: true,
          createdAt: newClients[0].createdAt,
        });
      }

      // Sort by createdAt newest first
      built.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(built);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setNotifLoading(false);
    }
  };

  // Load on mount and refresh when bell is opened
  useEffect(() => { loadNotifications(); }, []);

  // Keyboard shortcut Ctrl/Cmd+K to open global search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults(null);
      setSearchLoading(false);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await searchAPI.search(searchQuery.trim());
        if (res?.success) {
          setSearchResults(res.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const unread = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const notifIconMap = {
    task: '📋', invoice: '🧾', meeting: '📅', payment: '💰', client: '🏢', proposal: '📄',
  };

  const userRole = user?.role || 'employee';

  const quickNavItems = [
    { label: 'Dashboard', path: '/dashboard', roles: ['*'] },
    { label: 'Tasks', path: '/tasks', roles: ['super_admin', 'admin', 'project_manager', 'developer', 'designer', 'employee'] },
    { label: 'All Projects', path: '/projects', roles: ['super_admin', 'admin', 'project_manager', 'developer', 'designer', 'employee'] },
    { label: 'Time Tracking', path: '/time', roles: ['super_admin', 'admin', 'project_manager', 'developer', 'designer', 'employee'] },
    { label: 'Clients', path: '/crm/clients', roles: ['super_admin', 'admin', 'project_manager', 'accountant'] },
    { label: 'Invoices', path: '/finance/invoices', roles: ['super_admin', 'admin', 'accountant'] },
    { label: 'Employees', path: '/team/employees', roles: ['super_admin', 'admin', 'project_manager'] },
  ].filter(item => item.roles.includes('*') || userRole === 'super_admin' || item.roles.includes(userRole));

  return (
    <header className="h-16 bg-white dark:bg-dark-surface-secondary border-b border-border dark:border-navy-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary">
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="relative hidden md:block">
          <div
            className="flex items-center gap-2 px-3 py-2 bg-surface-tertiary dark:bg-dark-surface-tertiary rounded-lg cursor-pointer hover:bg-surface-secondary dark:hover:bg-dark-surface-card transition-colors"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-muted w-44">Search navigation...</span>
            <kbd className="text-[10px] text-text-muted bg-white dark:bg-dark-surface-card px-1.5 py-0.5 rounded border border-border dark:border-navy-border">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary transition-colors"
          title={dark ? 'Light Mode' : 'Dark Mode'}
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) loadNotifications(); }}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-96 bms-card shadow-dropdown z-50 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border dark:border-navy-border">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-electric" />
                    <span className="font-semibold text-sm text-text-primary dark:text-white">System Notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {unread > 0 && <Badge status="active" className="!text-[10px]">{unread} new</Badge>}
                    <button
                      onClick={loadNotifications}
                      className="text-[10px] text-text-muted hover:text-electric transition-colors"
                      title="Refresh"
                    >
                      {notifLoading ? '⏳' : '↻'}
                    </button>
                  </div>
                </div>

                {/* Notification List */}
                <div className="max-h-96 overflow-y-auto divide-y divide-border/50 dark:divide-navy-border/50">
                  {notifLoading && (
                    <div className="flex items-center justify-center py-8 gap-2 text-text-muted">
                      <span className="text-xs">Loading system data...</span>
                    </div>
                  )}
                  {!notifLoading && notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => { markAsRead(n.id); if (n.link) { navigate(n.link); setNotifOpen(false); } }}
                      className={classNames(
                        'flex gap-3 px-4 py-3.5 hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary transition-colors cursor-pointer',
                        !n.read && 'bg-blue-50/50 dark:bg-blue-900/10'
                      )}
                    >
                      <span className="text-xl flex-shrink-0 mt-0.5">{notifIconMap[n.type] || '🔔'}</span>
                      <div className="flex-1 min-w-0">
                        <p className={classNames('text-xs font-semibold leading-snug', !n.read ? 'text-text-primary dark:text-white' : 'text-text-secondary dark:text-slate-400')}>
                          {n.title}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-[10px] text-text-muted">{timeAgo(n.createdAt)}</p>
                          {n.link && <span className="text-[10px] text-electric">View →</span>}
                        </div>
                      </div>
                      {!n.read && <div className="w-2 h-2 bg-electric rounded-full flex-shrink-0 mt-2" />}
                    </div>
                  ))}
                  {!notifLoading && notifications.length === 0 && (
                    <div className="text-center py-8">
                      <span className="text-2xl block mb-2">✅</span>
                      <p className="text-xs text-text-muted">All caught up! No pending items.</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-border dark:border-navy-border flex items-center justify-between">
                  {unread > 0 ? (
                    <button onClick={markAllAsRead} className="text-xs text-electric hover:underline">
                      Mark all as read
                    </button>
                  ) : (
                    <span className="text-xs text-text-muted">All notifications read</span>
                  )}
                  <button
                    onClick={() => { navigate('/dashboard'); setNotifOpen(false); }}
                    className="text-xs text-text-muted hover:text-text-primary"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Menu & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-border dark:border-navy-border ml-1">
          <Avatar name={user?.name} size="sm" />
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-text-primary dark:text-white leading-tight">{user?.name}</p>
            <p className="text-[10px] font-bold text-electric uppercase tracking-wider leading-tight">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
          <button
            onClick={handleTopBarLogout}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-red-500 hover:bg-red-500/10 transition-colors ml-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-16 px-4" onClick={() => setSearchOpen(false)}>
          <div className="bms-card w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border border-border dark:border-navy-border animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-4 border-b border-border dark:border-navy-border flex-shrink-0">
              <Search className="w-5 h-5 text-electric flex-shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search clients, projects, tasks, employees, invoices, documents..."
                className="flex-1 bg-transparent text-sm text-text-primary dark:text-white outline-none placeholder:text-text-muted"
              />
              {searchLoading && (
                <div className="w-4 h-4 border-2 border-electric border-t-transparent rounded-full animate-spin flex-shrink-0" />
              )}
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchResults(null); }} className="text-text-muted hover:text-text-primary text-xs">
                  Clear
                </button>
              )}
              <button onClick={() => setSearchOpen(false)} className="text-text-muted hover:text-text-primary p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {/* Categorized Search Results */}
              {searchResults ? (
                <>
                  {/* Summary of results count */}
                  {(() => {
                    const counts = {
                      clients: searchResults.clients?.length || 0,
                      projects: searchResults.projects?.length || 0,
                      tasks: searchResults.tasks?.length || 0,
                      employees: searchResults.employees?.length || 0,
                      invoices: searchResults.invoices?.length || 0,
                      documents: searchResults.documents?.length || 0,
                    };
                    const totalMatches = Object.values(counts).reduce((a, b) => a + b, 0);

                    if (totalMatches === 0) {
                      return (
                        <div className="text-center py-10 text-text-muted">
                          <p className="text-base font-semibold text-text-primary dark:text-white mb-1">No results found</p>
                          <p className="text-xs">No records matched "{searchQuery}" across company database.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {/* Clients */}
                        {counts.clients > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <UserCheck className="w-4 h-4 text-electric" />
                              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                Clients ({counts.clients})
                              </span>
                            </div>
                            <div className="space-y-1">
                              {searchResults.clients.map(c => (
                                <div
                                  key={c._id}
                                  onClick={() => { navigate('/crm/clients'); setSearchOpen(false); }}
                                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary cursor-pointer transition-colors"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-text-primary dark:text-white">{c.name}</p>
                                    <p className="text-xs text-text-muted">{c.company || 'Direct Client'} • {c.email}</p>
                                  </div>
                                  <Badge status={c.status} className="!text-[10px]">{c.status}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Projects */}
                        {counts.projects > 0 && (
                          <div className="pt-2 border-t border-border dark:border-navy-border">
                            <div className="flex items-center gap-2 mb-2">
                              <Briefcase className="w-4 h-4 text-cyan-500" />
                              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                Projects ({counts.projects})
                              </span>
                            </div>
                            <div className="space-y-1">
                              {searchResults.projects.map(p => (
                                <div
                                  key={p._id}
                                  onClick={() => { navigate('/projects'); setSearchOpen(false); }}
                                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary cursor-pointer transition-colors"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-text-primary dark:text-white">{p.name}</p>
                                    <p className="text-xs text-text-muted">{p.clientName} • {p.service} • {p.progress}% done</p>
                                  </div>
                                  <Badge status={p.status} className="!text-[10px]">{p.status?.replace('_', ' ')}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tasks */}
                        {counts.tasks > 0 && (
                          <div className="pt-2 border-t border-border dark:border-navy-border">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckSquare className="w-4 h-4 text-amber-500" />
                              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                Tasks ({counts.tasks})
                              </span>
                            </div>
                            <div className="space-y-1">
                              {searchResults.tasks.map(t => (
                                <div
                                  key={t._id}
                                  onClick={() => { navigate('/tasks'); setSearchOpen(false); }}
                                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary cursor-pointer transition-colors"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-text-primary dark:text-white">{t.name}</p>
                                    <p className="text-xs text-text-muted">{t.projectName} • Assigned to {t.assigneeName || 'team'}</p>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Badge status={t.priority} className="!text-[10px]">{t.priority}</Badge>
                                    <Badge status={t.status} className="!text-[10px]">{t.status?.replace('_', ' ')}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Employees */}
                        {counts.employees > 0 && (
                          <div className="pt-2 border-t border-border dark:border-navy-border">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-purple-500" />
                              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                Team & Staff ({counts.employees})
                              </span>
                            </div>
                            <div className="space-y-1">
                              {searchResults.employees.map(e => (
                                <div
                                  key={e._id}
                                  onClick={() => { navigate('/team/employees'); setSearchOpen(false); }}
                                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary cursor-pointer transition-colors"
                                >
                                  <div className="flex items-center gap-2.5">
                                    <Avatar name={e.name} size="xs" />
                                    <div>
                                      <p className="text-sm font-semibold text-text-primary dark:text-white">{e.name}</p>
                                      <p className="text-xs text-text-muted">{e.position} • {e.department}</p>
                                    </div>
                                  </div>
                                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-surface-tertiary dark:bg-dark-surface-tertiary text-text-muted">
                                    {e.role?.replace('_', ' ')}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Invoices */}
                        {counts.invoices > 0 && (
                          <div className="pt-2 border-t border-border dark:border-navy-border">
                            <div className="flex items-center gap-2 mb-2">
                              <Receipt className="w-4 h-4 text-emerald-500" />
                              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                Invoices ({counts.invoices})
                              </span>
                            </div>
                            <div className="space-y-1">
                              {searchResults.invoices.map(i => (
                                <div
                                  key={i._id}
                                  onClick={() => { navigate('/finance/invoices'); setSearchOpen(false); }}
                                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary cursor-pointer transition-colors"
                                >
                                  <div>
                                    <p className="text-sm font-semibold font-mono text-electric">{i.number}</p>
                                    <p className="text-xs text-text-muted">{i.clientName} • ${(i.total || 0).toLocaleString()}</p>
                                  </div>
                                  <Badge status={i.status} className="!text-[10px]">{i.status}</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Documents */}
                        {counts.documents > 0 && (
                          <div className="pt-2 border-t border-border dark:border-navy-border">
                            <div className="flex items-center gap-2 mb-2">
                              <FolderOpen className="w-4 h-4 text-blue-500" />
                              <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                Documents ({counts.documents})
                              </span>
                            </div>
                            <div className="space-y-1">
                              {searchResults.documents.map(d => (
                                <div
                                  key={d._id}
                                  onClick={() => { navigate('/documents'); setSearchOpen(false); }}
                                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary cursor-pointer transition-colors"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-text-primary dark:text-white">{d.name}</p>
                                    <p className="text-xs text-text-muted capitalize">{(d.category || 'file').replace('_', ' ')} • {d.size || '1.0 MB'}</p>
                                  </div>
                                  <span className="text-xs text-electric hover:underline">Open →</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              ) : (
                /* Initial Navigation Quick-links */
                <div className="space-y-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Quick Navigation</p>
                    <span className="text-[10px] text-text-muted">Press ESC or click outside to close</span>
                  </div>
                  {quickNavItems.map(item => (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setSearchOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-surface-secondary dark:hover:bg-dark-surface-secondary text-left transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ChevronRight className="w-4 h-4 text-electric" />
                        <span className="text-sm font-medium text-text-primary dark:text-white">{item.label}</span>
                      </div>
                      <span className="text-[10px] text-text-muted font-mono">{item.path}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-surface-secondary dark:bg-dark-surface-tertiary border-t border-border dark:border-navy-border flex items-center justify-between text-[11px] text-text-muted flex-shrink-0">
              <span>HIRAD Global Search • Live Multi-Entity Index</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-navy border border-border dark:border-navy-border text-[10px]">ESC</kbd> to close</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
