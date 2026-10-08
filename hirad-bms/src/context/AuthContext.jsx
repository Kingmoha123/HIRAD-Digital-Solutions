import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount — restore session from stored token
  useEffect(() => {
    const token = localStorage.getItem('hirad_bms_token') || sessionStorage.getItem('hirad_bms_token');
    if (!token) {
      setLoading(false);
      return;
    }
    // Verify token is still valid by fetching /auth/me
    authAPI.me()
      .then(res => setUser(res.user))
      .catch(() => {
        localStorage.removeItem('hirad_bms_token');
        sessionStorage.removeItem('hirad_bms_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, remember = true) => {
    const res = await authAPI.login(email, password);
    const { token, user: userData } = res;

    // Persist token in localStorage for persistence across page refreshes
    localStorage.setItem('hirad_bms_token', token);
    if (!remember) {
      sessionStorage.setItem('hirad_bms_token', token);
    }

    setUser(userData);
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hirad_bms_token');
    sessionStorage.removeItem('hirad_bms_token');
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    return rolePermissions.includes('*') || rolePermissions.includes(permission);
  };

  const isAtLeast = (role) => {
    const hierarchy = ['employee', 'developer', 'designer', 'accountant', 'project_manager', 'admin', 'super_admin'];
    const userLevel = hierarchy.indexOf(user?.role);
    const requiredLevel = hierarchy.indexOf(role);
    return userLevel >= requiredLevel;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasPermission, isAtLeast }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Role-based permissions
export const ROLE_PERMISSIONS = {
  super_admin: ['*'],
  admin: [
    'view_dashboard', 'manage_clients', 'manage_leads', 'manage_projects',
    'manage_tasks', 'manage_meetings', 'manage_employees', 'view_reports',
    'manage_documents', 'view_finance', 'manage_invoices', 'manage_expenses',
    'manage_proposals', 'manage_contracts', 'manage_services', 'view_activity',
    'manage_time',
  ],
  project_manager: [
    'view_dashboard', 'view_clients', 'manage_projects', 'manage_tasks',
    'manage_meetings', 'view_employees', 'view_reports', 'manage_documents',
    'view_finance', 'manage_proposals', 'manage_time',
  ],
  developer: [
    'view_dashboard', 'view_projects', 'manage_own_tasks', 'view_meetings',
    'view_documents', 'manage_time', 'view_reports',
  ],
  designer: [
    'view_dashboard', 'view_projects', 'manage_own_tasks', 'view_meetings',
    'view_documents', 'manage_time',
  ],
  accountant: [
    'view_dashboard', 'view_finance', 'manage_invoices', 'manage_payments',
    'manage_expenses', 'view_reports', 'view_clients',
  ],
  employee: [
    'view_dashboard', 'view_own_tasks', 'view_projects', 'view_meetings',
    'view_documents', 'manage_time',
  ],
};
