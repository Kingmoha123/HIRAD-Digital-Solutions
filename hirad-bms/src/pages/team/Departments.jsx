import { Building2 } from 'lucide-react';
import { Card, Spinner } from '../../components/ui';
import { employeesAPI } from '../../services/api';
import { useApi } from '../../hooks/useApi';

const DEPARTMENTS = [
  { name: 'Management', description: 'Executive leadership and operations oversight', color: 'from-purple-500 to-purple-700' },
  { name: 'Development', description: 'Software and web application development', color: 'from-blue-500 to-blue-700' },
  { name: 'Design', description: 'UI/UX design and creative services', color: 'from-pink-500 to-pink-700' },
  { name: 'Marketing', description: 'Digital marketing and growth', color: 'from-amber-500 to-amber-700' },
  { name: 'Finance', description: 'Financial management and accounting', color: 'from-emerald-500 to-emerald-700' },
  { name: 'Operations', description: 'Business operations and client relations', color: 'from-cyan-500 to-cyan-700' },
];

export default function Departments() {
  const { data: employeesRes, loading } = useApi(() => employeesAPI.getAll({ limit: 100 }));
  const employees = employeesRes?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">{DEPARTMENTS.length} departments · {employees.length} total employees</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {DEPARTMENTS.map(dept => {
            const members = employees.filter(e => e.department === dept.name);
            return (
              <Card key={dept.name} hover className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${dept.color}`} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${dept.color} flex items-center justify-center`}>
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-text-primary dark:text-white">{dept.name}</h3>
                        <p className="text-xs text-text-muted">{members.length} member{members.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-text-muted mb-4">{dept.description}</p>

                  <div className="flex items-center gap-2">
                    {members.slice(0, 4).map(member => (
                      <div
                        key={member._id || member.id}
                        className="w-8 h-8 rounded-full avatar text-xs flex items-center justify-center font-bold bg-surface-tertiary dark:bg-dark-surface-secondary text-text-primary dark:text-white border border-border dark:border-navy-border"
                        title={member.name}
                      >
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </div>
                    ))}
                    {members.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-surface-tertiary dark:bg-dark-surface-secondary flex items-center justify-center text-[10px] font-bold text-text-muted">
                        +{members.length - 4}
                      </div>
                    )}
                    {members.length === 0 && (
                      <p className="text-xs text-text-muted italic">No members assigned</p>
                    )}
                  </div>

                  {members.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border dark:border-navy-border">
                      <p className="text-xs text-text-muted">
                        Roles: {[...new Set(members.map(m => m.position).filter(Boolean))].slice(0, 3).join(', ') || 'Team Members'}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
