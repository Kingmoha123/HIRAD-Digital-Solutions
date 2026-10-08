import { useState } from 'react';
import hiradIcon from '../../assets/hirad-icon.svg?url';
import { Settings, User, Building2, Globe, Bell, Shield, ChevronRight, Save, LogOut, Activity, Download, RefreshCw, Filter, Search } from 'lucide-react';

import { Card, Button, Input, Select, Tabs, Avatar, Badge, Spinner } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { ROLE_PERMISSIONS } from '../../context/AuthContext';
import { activitiesAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { formatDate, timeAgo } from '../../utils/helpers';

const SETTING_TABS = [
  { id: 'company', label: 'Company' },
  { id: 'profile', label: 'My Profile' },
  { id: 'activity', label: 'Audit & Activity Log' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'system', label: 'System' },
  { id: 'roles', label: 'Roles & Permissions' },
];

function AuditLogTab({ user }) {
  const isPrivileged = ['super_admin', 'admin', 'project_manager'].includes(user?.role);
  const { data: actData, loading, refetch } = useApi(() => activitiesAPI.getAll({ limit: 150 }));
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const rawLogs = actData?.data || [];

  const filteredLogs = rawLogs.filter(log => {
    const matchesSearch =
      !search ||
      log.userName?.toLowerCase().includes(search.toLowerCase()) ||
      log.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.targetName?.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase());

    const matchesAction = filterAction === 'all' || log.action?.toLowerCase().includes(filterAction);
    return matchesSearch && matchesAction;
  });

  const exportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Target Type', 'Target Name', 'Details'];
    const rows = filteredLogs.map(l => [
      `"${new Date(l.createdAt).toISOString()}"`,
      `"${l.userName || 'System'}"`,
      `"${l.userRole || ''}"`,
      `"${l.action || ''}"`,
      `"${l.targetType || ''}"`,
      `"${l.targetName || ''}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HIRAD_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadge = (action = '') => {
    const act = action.toLowerCase();
    if (act.includes('login') || act.includes('auth')) {
      return <Badge status="info">Login / Auth</Badge>;
    }
    if (act.includes('create') || act.includes('add')) {
      return <Badge status="active">Created</Badge>;
    }
    if (act.includes('delete') || act.includes('remove')) {
      return <Badge status="danger">Deleted</Badge>;
    }
    if (act.includes('update') || act.includes('edit')) {
      return <Badge status="warning">Updated</Badge>;
    }
    return <Badge status="default">{action}</Badge>;
  };

  if (!isPrivileged) {
    return (
      <div className="text-center py-12 border border-border dark:border-navy-border rounded-xl p-8 bg-surface-secondary/40">
        <Shield className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h4 className="text-base font-bold text-text-primary dark:text-white mb-1">Restricted Administrative Area</h4>
        <p className="text-xs text-text-muted max-w-md mx-auto">
          The company audit and system activity logs are strictly confidential and restricted to System Administrators and Project Managers.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-text-primary dark:text-white font-sora">Audit & Activity Log</h3>
          <p className="text-xs text-text-muted mt-0.5">Live tracking of security events, records mutations, and operational activities.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => refetch()} title="Refresh logs">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={exportCSV} disabled={filteredLogs.length === 0}>
            <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by user, action, target..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-border dark:border-navy-border bg-surface-primary dark:bg-dark-surface-secondary text-text-primary dark:text-white outline-none focus:border-electric"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {['all', 'login', 'create', 'update', 'delete'].map(act => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                filterAction === act
                  ? 'bg-electric text-white'
                  : 'bg-surface-tertiary dark:bg-dark-surface-secondary text-text-secondary dark:text-slate-400 hover:bg-surface-secondary'
              }`}
            >
              {act === 'all' ? 'All Events' : act}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="md" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-10 border border-border dark:border-navy-border rounded-xl">
          <Activity className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm font-semibold text-text-primary dark:text-white">No activity logs recorded yet</p>
          <p className="text-xs text-text-muted mt-0.5">Actions performed across the BMS will automatically appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-border dark:border-navy-border rounded-xl">
          <table className="bms-table w-full text-xs">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Target</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => {
                const lid = log._id || log.id;
                return (
                  <tr key={lid}>
                    <td className="whitespace-nowrap text-text-muted">
                      <div>{formatDate(log.createdAt)}</div>
                      <div className="text-[10px] text-slate-400">{timeAgo(log.createdAt)}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={log.userName || 'System'} size="xs" />
                        <div>
                          <div className="font-semibold text-text-primary dark:text-white">{log.userName || 'System User'}</div>
                          <div className="text-[10px] text-text-muted capitalize">{log.userRole?.replace('_', ' ') || 'Admin'}</div>
                        </div>
                      </div>
                    </td>
                    <td>{getActionBadge(log.action)}</td>
                    <td>
                      <div className="font-medium text-text-primary dark:text-white">{log.targetName || log.targetType || '—'}</div>
                      {log.targetType && <div className="text-[10px] text-text-muted uppercase tracking-wider">{log.targetType}</div>}
                    </td>
                    <td className="max-w-xs truncate text-text-muted" title={log.details}>
                      {log.details || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('company');
  const [company, setCompany] = useState({
    name: 'HIRAD Digital Solutions',
    email: 'info@hirad.io',
    phone: '+252 61 234 5678',
    address: 'KM4, Maka Al-Mukarama Rd, Mogadishu, Somalia',
    website: 'https://hirad.io',
    linkedin: 'https://linkedin.com/company/hirad-digital',
    instagram: 'https://instagram.com/hirad_digital',
  });
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', position: user?.position || '' });
  const [notifications, setNotifications] = useState({
    tasks: true, invoices: true, meetings: true, payments: true, proposals: true, deadlines: true,
  });
  const [system, setSystem] = useState({ currency: 'USD', dateFormat: 'MMM DD, YYYY', timezone: 'Africa/Mogadishu' });
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'company':
        return (
          <form onSubmit={handleSave} className="space-y-5 max-w-xl">
            <h3 className="font-bold text-text-primary dark:text-white font-sora">Company Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Company Name" value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} />
              <Input label="Email" type="email" value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" value={company.phone} onChange={e => setCompany({ ...company, phone: e.target.value })} />
              <Input label="Website" value={company.website} onChange={e => setCompany({ ...company, website: e.target.value })} />
            </div>
            <Input label="Address" value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="LinkedIn" value={company.linkedin} onChange={e => setCompany({ ...company, linkedin: e.target.value })} />
              <Input label="Instagram" value={company.instagram} onChange={e => setCompany({ ...company, instagram: e.target.value })} />
            </div>
            <div>
              <label className="bms-label">Company Logo</label>
              <div className="flex items-center gap-4">
                <img src={hiradIcon} alt="HIRAD" className="w-16 h-16" />
                <Button variant="secondary" size="sm" type="button">Change Logo</Button>
              </div>
            </div>

            <Button type="submit" className={saved ? '!bg-emerald-500' : ''}>
              {saved ? '✓ Saved!' : <><Save className="w-4 h-4" /> Save Changes</>}
            </Button>
          </form>
        );

      case 'profile':
        return (
          <form onSubmit={handleSave} className="space-y-5 max-w-xl">
            <h3 className="font-bold text-text-primary dark:text-white font-sora">My Profile</h3>
            <div className="flex items-center gap-4 mb-6">
              <Avatar name={user?.name} size="xl" />
              <div>
                <p className="font-bold text-text-primary dark:text-white">{user?.name}</p>
                <p className="text-sm text-text-muted">{user?.role?.replace('_', ' ')}</p>
                <Button variant="secondary" size="sm" className="mt-2" type="button">Change Avatar</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
              <Input label="Email" type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Phone" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
              <Input label="Position" value={profile.position} onChange={e => setProfile({ ...profile, position: e.target.value })} />
            </div>
            <div className="border-t border-border dark:border-navy-border pt-5">
              <h4 className="font-semibold text-text-primary dark:text-white mb-4">Change Password</h4>
              <div className="space-y-3">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" className={saved ? '!bg-emerald-500' : ''}>
                {saved ? '✓ Saved!' : <><Save className="w-4 h-4" /> Save Profile</>}
              </Button>
              <Button type="button" variant="danger" onClick={() => { logout(); navigate('/login'); }}>
                <LogOut className="w-4 h-4" /> Sign Out
              </Button>
            </div>
          </form>
        );

      case 'activity':
        return <AuditLogTab user={user} />;

      case 'notifications':
        return (
          <div className="space-y-5 max-w-xl">
            <h3 className="font-bold text-text-primary dark:text-white font-sora">Notification Preferences</h3>
            <Card className="p-5 divide-y divide-border dark:divide-navy-border">
              {Object.entries(notifications).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-text-primary dark:text-white capitalize">{key} notifications</p>
                    <p className="text-xs text-text-muted">Receive alerts for {key} updates</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [key]: !val })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${val ? 'bg-electric' : 'bg-border dark:bg-navy-border'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${val ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </Card>
            <Button onClick={handleSave} className={saved ? '!bg-emerald-500' : ''}>
              {saved ? '✓ Saved!' : <><Save className="w-4 h-4" /> Save Preferences</>}
            </Button>
          </div>
        );

      case 'system':
        return (
          <form onSubmit={handleSave} className="space-y-5 max-w-xl">
            <h3 className="font-bold text-text-primary dark:text-white font-sora">System Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Default Currency" value={system.currency} onChange={e => setSystem({ ...system, currency: e.target.value })}>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="IRR">IRR — Iranian Rial</option>
                <option value="GBP">GBP — British Pound</option>
              </Select>
              <Select label="Date Format" value={system.dateFormat} onChange={e => setSystem({ ...system, dateFormat: e.target.value })}>
                <option value="MMM DD, YYYY">MMM DD, YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </Select>
            </div>
            <Select label="Timezone" value={system.timezone} onChange={e => setSystem({ ...system, timezone: e.target.value })}>
              <option value="Asia/Tehran">Asia/Tehran (IRST +3:30)</option>
              <option value="UTC">UTC</option>
              <option value="Europe/London">Europe/London</option>
              <option value="America/New_York">America/New York</option>
            </Select>
            <div className="flex items-center justify-between p-4 bg-surface-secondary dark:bg-dark-surface-secondary rounded-xl">
              <div>
                <p className="text-sm font-semibold text-text-primary dark:text-white">Dark Mode</p>
                <p className="text-xs text-text-muted">Toggle dark / light theme</p>
              </div>
              <button
                type="button"
                onClick={toggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dark ? 'bg-electric' : 'bg-border dark:bg-navy-border'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${dark ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <Button type="submit" className={saved ? '!bg-emerald-500' : ''}>
              {saved ? '✓ Saved!' : <><Save className="w-4 h-4" /> Save Settings</>}
            </Button>
          </form>
        );

      case 'roles':
        return (
          <div className="space-y-5">
            <h3 className="font-bold text-text-primary dark:text-white font-sora">Roles & Permissions</h3>
            <div className="space-y-4">
              {Object.entries(ROLE_PERMISSIONS).map(([role, perms]) => (
                <Card key={role} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-text-primary dark:text-white capitalize font-sora">
                      {role.replace('_', ' ')}
                    </h4>
                    {perms.includes('*') && (
                      <span className="badge badge-purple text-[10px]">Full Access</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {perms.includes('*') ? (
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 text-[10px] font-semibold rounded-full">All Permissions</span>
                    ) : (
                      perms.map(perm => (
                        <span key={perm} className="px-2 py-0.5 bg-surface-tertiary dark:bg-dark-surface-secondary text-text-muted text-[10px] font-medium rounded-full capitalize">
                          {perm.replace(/_/g, ' ')}
                        </span>
                      ))
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-xs text-text-muted">Role permissions are managed in the system configuration.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage company, profile, and system preferences</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <Card className="p-2">
            {SETTING_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-electric/10 text-electric' : 'text-text-secondary dark:text-slate-400 hover:bg-surface-tertiary dark:hover:bg-dark-surface-secondary'}`}
              >
                {tab.label}
                {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Card className="p-6">
            {renderContent()}
          </Card>
        </div>
      </div>
    </div>
  );
}
