import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, Lock, Mail, AlertCircle, ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';
import hiradIcon from '../../assets/hirad-icon.svg?url';
import bmsShowcase from '../../assets/bms-showcase.jpg';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password, form.remember);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex">
      {/* Left Panel — Enterprise Showcase */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 xl:p-14 relative overflow-hidden bg-gradient-to-br from-navy via-[#0c1529] to-[#080d1a]">
        {/* Subtle Tech Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(37,99,235,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.3) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-cyan-brand/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              <img src={hiradIcon} alt="HIRAD" className="w-7 h-7 flex-shrink-0" />
            </div>
            <div>
              <span className="text-white font-bold font-sora text-lg tracking-tight">HIRAD</span>
              <span className="text-cyan-brand text-xs font-semibold uppercase tracking-wider ml-2.5 px-2 py-0.5 rounded-full bg-cyan-brand/10 border border-cyan-brand/20">
                Digital Solutions
              </span>
            </div>
          </div>
        </div>

        {/* Main Content & Visual Showcase */}
        <div className="relative z-10 space-y-6 my-auto py-4">
          <div>
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white font-sora leading-tight">
              Enterprise Operations &{' '}
              <span className="bg-gradient-to-r from-electric via-blue-400 to-cyan-brand bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            <p className="text-slate-400 mt-3 text-sm xl:text-base leading-relaxed max-w-lg">
              Centralized platform orchestrating software engineering, client lifecycles, cross-department workflows, and executive governance.
            </p>
          </div>

          {/* Interactive Visual Showcase Card */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-navy-light/30 backdrop-blur-md p-1 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-electric/20 via-transparent to-cyan-brand/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
            <img
              src={bmsShowcase}
              alt="HIRAD Digital Operations Hub"
              className="w-full h-52 xl:h-60 object-cover rounded-xl transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Live Status Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3.5 py-2 rounded-xl bg-navy/85 backdrop-blur-md border border-white/10 text-xs shadow-lg z-20">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-white font-medium">Enterprise Cloud Engine</span>
              </div>
              <span className="text-cyan-brand font-mono text-[11px] font-semibold">Zero-Trust Protected</span>
            </div>
          </div>

          {/* Enterprise Capabilities Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm hover:border-white/20 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-electric/15 text-electric flex items-center justify-center mb-2">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">RBAC Security</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Role-scoped data boundary</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm hover:border-white/20 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-cyan-brand/15 text-cyan-brand flex items-center justify-center mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Real-time Sprints</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Live project velocity</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-sm hover:border-white/20 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-2">
                <Layers className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Unified Delivery</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Cross-team operations</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/5">
          <p>© 2026 HIRAD Digital Solutions • Internal Operations</p>

        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white dark:bg-navy-light">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src={hiradIcon} alt="HIRAD" className="w-10 h-10 flex-shrink-0" />
            <div>
              <span className="text-text-primary dark:text-white font-bold font-sora">HIRAD BMS</span>
              <p className="text-xs text-text-muted">Digital Solutions</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-white font-sora">
              Welcome back
            </h2>
            <p className="text-text-secondary dark:text-slate-400 mt-1.5 text-sm">
              Sign in to access your role-authorized workspace
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="bms-label">Corporate Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="name@hirad.io"
                  className="bms-input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="bms-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="bms-input pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={e => setForm({ ...form, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-border accent-electric"
                />
                <span className="text-text-secondary dark:text-slate-400">Remember session</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Please contact system administrator to reset credentials.')}
                className="text-electric hover:underline font-medium text-xs"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-bms-primary w-full justify-center py-3 text-base mt-2 shadow-lg shadow-electric/25"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In to Workspace
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border dark:border-navy-border text-center">
            <p className="text-xs text-text-muted flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Authorized personnel only • Activity is logged & audited
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
