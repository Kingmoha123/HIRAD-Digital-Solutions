import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Spinner, Button, Card } from '../ui';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function RoleGuard({ allowedRoles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // super_admin always has universal access
  if (user.role === 'super_admin') {
    return children;
  }

  const isAuthorized = !allowedRoles || allowedRoles.length === 0 || allowedRoles.includes(user.role);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4 animate-fade-in">
        <Card className="max-w-md w-full p-8 text-center space-y-4 shadow-xl border-amber-200 dark:border-amber-900/30">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-sora text-text-primary dark:text-white">
              Access Restricted
            </h2>
            <p className="text-sm text-text-muted mt-2">
              Your role <span className="font-semibold text-electric uppercase text-xs px-2 py-0.5 rounded bg-electric/10">({user.role})</span> does not have authorization to view this area.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="secondary"
              onClick={() => window.history.back()}
              className="w-full justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return children;
}
