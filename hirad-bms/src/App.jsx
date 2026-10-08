import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import RoleGuard from './components/auth/RoleGuard';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Auth
import Login from './pages/auth/Login';

// Pages
import Dashboard from './pages/dashboard/Dashboard';
import Clients from './pages/clients/Clients';
import Leads from './pages/crm/Leads';
import Services from './pages/crm/Services';
import Projects from './pages/projects/Projects';
import Tasks from './pages/tasks/Tasks';
import CalendarPage from './pages/meetings/Calendar';
import Meetings from './pages/meetings/Meetings';
import TimeTracking from './pages/time/TimeTracking';
import Proposals from './pages/proposals/Proposals';
import Contracts from './pages/contracts/Contracts';
import Invoices from './pages/finance/Invoices';
import Payments from './pages/finance/Payments';
import Expenses from './pages/finance/Expenses';
import Employees from './pages/team/Employees';
import Departments from './pages/team/Departments';
import Documents from './pages/documents/Documents';
import Reports from './pages/reports/Reports';
import { ConfirmProvider } from './context/ConfirmContext';
import Settings from './pages/settings/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ConfirmProvider>
          <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected — wrapped in DashboardLayout */}
            <Route element={<DashboardLayout />}>
              <Route
                path="/dashboard"
                element={
                  <RoleGuard>
                    <Dashboard />
                  </RoleGuard>
                }
              />

              {/* CRM */}
              <Route
                path="/crm/leads"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager']}>
                    <Leads />
                  </RoleGuard>
                }
              />
              <Route
                path="/crm/clients"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager', 'accountant']}>
                    <Clients />
                  </RoleGuard>
                }
              />
              <Route
                path="/crm/contacts"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager', 'accountant']}>
                    <Clients />
                  </RoleGuard>
                }
              />

              {/* Projects */}
              <Route
                path="/projects"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager', 'developer', 'designer', 'employee']}>
                    <Projects />
                  </RoleGuard>
                }
              />
              <Route
                path="/projects/mine"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager', 'developer', 'designer', 'employee']}>
                    <Projects />
                  </RoleGuard>
                }
              />

              {/* Work Management */}
              <Route
                path="/tasks"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager', 'developer', 'designer', 'employee']}>
                    <Tasks />
                  </RoleGuard>
                }
              />
              <Route
                path="/calendar"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager', 'developer', 'designer', 'employee']}>
                    <CalendarPage />
                  </RoleGuard>
                }
              />
              <Route
                path="/meetings"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager', 'developer', 'designer', 'employee']}>
                    <Meetings />
                  </RoleGuard>
                }
              />
              <Route
                path="/time"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager', 'developer', 'designer', 'employee']}>
                    <TimeTracking />
                  </RoleGuard>
                }
              />

              {/* Business */}
              <Route
                path="/services"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager']}>
                    <Services />
                  </RoleGuard>
                }
              />
              <Route
                path="/proposals"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager']}>
                    <Proposals />
                  </RoleGuard>
                }
              />
              <Route
                path="/contracts"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager']}>
                    <Contracts />
                  </RoleGuard>
                }
              />

              {/* Finance */}
              <Route
                path="/finance/invoices"
                element={
                  <RoleGuard allowedRoles={['admin', 'accountant']}>
                    <Invoices />
                  </RoleGuard>
                }
              />
              <Route
                path="/finance/payments"
                element={
                  <RoleGuard allowedRoles={['admin', 'accountant']}>
                    <Payments />
                  </RoleGuard>
                }
              />
              <Route
                path="/finance/expenses"
                element={
                  <RoleGuard allowedRoles={['admin', 'accountant']}>
                    <Expenses />
                  </RoleGuard>
                }
              />

              {/* Documents */}
              <Route
                path="/documents"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager', 'developer', 'designer', 'employee', 'accountant']}>
                    <Documents />
                  </RoleGuard>
                }
              />

              {/* Reports */}
              <Route
                path="/reports"
                element={
                  <RoleGuard allowedRoles={['admin', 'accountant', 'project_manager']}>
                    <Reports />
                  </RoleGuard>
                }
              />

              {/* Team */}
              <Route
                path="/team/employees"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager']}>
                    <Employees />
                  </RoleGuard>
                }
              />
              <Route
                path="/team/departments"
                element={
                  <RoleGuard allowedRoles={['admin', 'project_manager']}>
                    <Departments />
                  </RoleGuard>
                }
              />

              {/* Settings */}
              <Route
                path="/settings"
                element={
                  <RoleGuard>
                    <Settings />
                  </RoleGuard>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </ConfirmProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
