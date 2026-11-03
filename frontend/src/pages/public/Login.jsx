import React, { useState, useContext, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Stethoscope, Lock, Mail, ArrowRight, Key,
  User, ShieldCheck, Eye, EyeOff, HeartPulse,
  Sparkles, BadgeCheck
} from 'lucide-react';

// ─── Role Tab Config ─────────────────────────────────────────────────────────
const ROLES = [
  {
    key: 'patient',
    label: 'Patient',
    icon: User,
    color: 'from-teal-500 to-emerald-600',
    accent: 'teal',
    badge: 'bg-teal-500/20 border-teal-400/30 text-teal-200',
    badgeText: 'Patient Portal',
    tagline: 'Access appointments & health records',
    demoEmail: 'patient@hospital.com',
    demoPass: 'Patient@123456',
    gradHeader: 'from-teal-600 via-emerald-600 to-teal-700',
    ring: 'focus:ring-teal-500',
    btn: 'bg-teal-600 hover:bg-teal-500 shadow-teal-500/30',
    tabActive: 'bg-teal-600 text-white shadow-teal-500/30',
    tabInactive: 'text-slate-500 hover:text-teal-600 hover:bg-teal-50',
  },
  {
    key: 'doctor',
    label: 'Doctor',
    icon: Stethoscope,
    color: 'from-indigo-500 to-blue-600',
    accent: 'indigo',
    badge: 'bg-indigo-500/20 border-indigo-400/30 text-indigo-200',
    badgeText: 'Doctor Portal',
    tagline: 'Manage patients & consultations',
    demoEmail: 'doctor@hospital.com',
    demoPass: 'Doctor@123456',
    gradHeader: 'from-indigo-600 via-blue-600 to-indigo-700',
    ring: 'focus:ring-indigo-500',
    btn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30',
    tabActive: 'bg-indigo-600 text-white shadow-indigo-500/30',
    tabInactive: 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50',
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: ShieldCheck,
    color: 'from-violet-500 to-purple-600',
    accent: 'violet',
    badge: 'bg-violet-500/20 border-violet-400/30 text-violet-200',
    badgeText: 'Admin Portal',
    tagline: 'Hospital operations & analytics',
    demoEmail: 'admin@hospital.com',
    demoPass: 'Admin@123456',
    gradHeader: 'from-violet-600 via-purple-600 to-violet-700',
    ring: 'focus:ring-violet-500',
    btn: 'bg-violet-600 hover:bg-violet-500 shadow-violet-500/30',
    tabActive: 'bg-violet-600 text-white shadow-violet-500/30',
    tabInactive: 'text-slate-500 hover:text-violet-600 hover:bg-violet-50',
  },
];

// ─── Quick-fill demo chip ────────────────────────────────────────────────────
const DemoChip = ({ label, email, pass, onFill, accent }) => (
  <button
    type="button"
    onClick={() => onFill(email, pass)}
    className={`flex flex-col items-start gap-0.5 px-3 py-2 rounded-xl border bg-white hover:scale-[1.02] active:scale-95 transition-all text-left shadow-sm border-${accent}-100 hover:border-${accent}-400 hover:bg-${accent}-50`}
  >
    <span className={`text-xs font-bold text-${accent}-700`}>{label}</span>
    <span className="text-[10px] text-slate-500 truncate max-w-[110px]">{email}</span>
  </button>
);

// ─── Main Login Component ────────────────────────────────────────────────────
const Login = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeRole, setActiveRole] = useState(ROLES[0]);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const from = location.state?.from?.pathname;

  const onSubmit = async (data) => {
    // Simple front-end rate-limit hint
    if (loginAttempts >= 5) {
      toast.error('Too many attempts. Please wait a moment before trying again.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(data);

      // Role mismatch warning (soft check — server enforces role)
      if (user.role !== activeRole.key && activeRole.key !== 'admin') {
        toast(`Signed in as ${user.role}`, { icon: 'ℹ️' });
      } else {
        toast.success(`Welcome back, ${user.name}! 🎉`);
      }

      setLoginAttempts(0);
      navigate(from || `/${user.role}/dashboard`, { replace: true });
    } catch (err) {
      setLoginAttempts(prev => prev + 1);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => {
    setValue('email', email);
    setValue('password', password);
    toast(`Demo credentials filled — click Sign In`, { icon: '🔑', duration: 2000 });
  };

  const switchRole = (role) => {
    setActiveRole(role);
    // Pre-fill the demo credentials for selected role
    setValue('email', role.demoEmail);
    setValue('password', role.demoPass);
  };

  const RoleIcon = activeRole.icon;

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/20 to-indigo-50/30">

      {/* ── Animated Background Orbs ── */}
      <div className="absolute top-[-60px] left-[-60px] w-96 h-96 rounded-full bg-teal-300/15 blur-3xl animate-orb-drift pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl animate-orb-drift pointer-events-none" style={{ animationDelay: '3s' }} />
      <div className="absolute top-[40%] right-[5%] w-48 h-48 rounded-full bg-violet-300/10 blur-2xl animate-float-slow pointer-events-none" />

      {/* ── Grid pattern overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div
        ref={formRef}
        className={`relative w-full max-w-md animate-scale-in ${shakeError ? 'animate-shake' : ''}`}
      >
        {/* ── Glow behind card ── */}
        <div className={`absolute inset-0 bg-gradient-to-br ${activeRole.color} opacity-10 rounded-3xl blur-2xl scale-105 transition-all duration-500`} />

        <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">

          {/* ── HEADER ── */}
          <div className={`bg-gradient-to-br ${activeRole.gradHeader} p-8 text-white text-center relative overflow-hidden`}>
            {/* Radial shine */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_130%,rgba(255,255,255,0.12),transparent_60%)]" />
            {/* Dot decoration */}
            <div className="absolute top-3 right-4 flex gap-1.5 opacity-40">
              {[1, 2, 3].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-white/70 animate-float" style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>

            {/* Icon */}
            <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float shadow-lg border border-white/20">
              <RoleIcon className="w-9 h-9 text-white" strokeWidth={1.8} />
            </div>

            {/* Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold mb-2 ${activeRole.badge}`}>
              <BadgeCheck className="w-3.5 h-3.5" />
              {activeRole.badgeText}
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight">Welcome Back</h2>
            <p className="text-xs opacity-80 mt-1">{activeRole.tagline}</p>

            {/* Security indicator */}
            <div className="absolute bottom-3 left-4 flex items-center gap-1 text-[10px] opacity-50">
              <ShieldCheck className="w-3 h-3" />
              <span>256-bit SSL Encrypted</span>
            </div>
          </div>

          {/* ── ROLE TABS ── */}
          <div className="px-6 pt-5">
            <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isActive = activeRole.key === role.key;
                return (
                  <button
                    key={role.key}
                    type="button"
                    onClick={() => switchRole(role)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive ? `${role.tabActive} shadow-md` : role.tabInactive
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {role.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── FORM ── */}
          <div className="p-6 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

              {/* Email or Doctor ID */}
              <div className="animate-fade-in-up">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  {activeRole.key === 'doctor' ? 'Doctor ID or Email Address' : 'Email Address'}
                </label>
                <div className="relative group">
                  <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-teal-500 transition" />
                  <input
                    type="text"
                    autoComplete="username"
                    placeholder={activeRole.key === 'doctor' ? 'e.g. DOC-1001 or doctor@hospital.com' : 'name@example.com'}
                    {...register('email', {
                      required: activeRole.key === 'doctor' ? 'Doctor ID or Email is required' : 'Email is required',
                      validate: (val) => {
                        if (activeRole.key === 'doctor') {
                          if (val.toUpperCase().startsWith('DOC-') || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val)) {
                            return true;
                          }
                          return 'Enter a valid Doctor ID (e.g. DOC-1001) or Email';
                        }
                        return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(val) || 'Please enter a valid email';
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none ${activeRole.ring} focus:ring-2 focus:bg-white transition-all ${
                      errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 animate-fade-in">
                    <span className="w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
                    {errors.email.message}
                  </p>
                )}
                {activeRole.key === 'doctor' && (
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Doctors can sign in using their unique ID (e.g. DOC-1001)</span>
                    <Link to="/doctor/register" className="font-bold text-indigo-600 hover:underline">
                      Activate Doctor ID &rarr;
                    </Link>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="animate-fade-in-up delay-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-slate-500 hover:text-teal-600 transition font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-teal-500 transition" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                    className={`w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none ${activeRole.ring} focus:ring-2 focus:bg-white transition-all ${
                      errors.password ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 animate-fade-in">
                    <span className="w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Rate limit warning */}
              {loginAttempts >= 3 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 flex items-center gap-2 animate-fade-in">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  {loginAttempts >= 5
                    ? 'Account temporarily locked. Please try again later.'
                    : `${5 - loginAttempts} attempt(s) remaining before lockout.`}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || loginAttempts >= 5}
                className={`w-full py-3.5 ${activeRole.btn} text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up delay-200`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Sign In as {activeRole.label}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* ── Demo Credentials ── */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200 rounded-2xl p-4 space-y-3 animate-fade-in-up delay-300">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  Demo Credentials
                </p>
                <span className="text-[10px] text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">Click to fill</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(role => (
                  <DemoChip
                    key={role.key}
                    label={`${role.key === 'patient' ? '🧑' : role.key === 'doctor' ? '👨‍⚕️' : '🔑'} ${role.label}`}
                    email={role.demoEmail}
                    pass={role.demoPass}
                    onFill={fillDemo}
                    accent={role.key === 'patient' ? 'teal' : role.key === 'doctor' ? 'indigo' : 'violet'}
                  />
                ))}
              </div>

              {/* Extra doctor accounts */}
              <div className="border-t border-slate-200 pt-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">More Doctor Accounts</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { name: '🩺 Dr. Rohan (Ortho)', email: 'doctor2@hospital.com', pass: 'Doctor@123456' },
                    { name: '🩺 Dr. Priya (Derm)', email: 'doctor3@hospital.com', pass: 'Doctor@123456' },
                    { name: '🩺 Dr. Arjun (Neuro)', email: 'doctor4@hospital.com', pass: 'Doctor@123456' },
                    { name: '🩺 Dr. Kavitha (Peds)', email: 'doctor5@hospital.com', pass: 'Doctor@123456' },
                  ].map(d => (
                    <button
                      key={d.email}
                      type="button"
                      onClick={() => fillDemo(d.email, d.pass)}
                      className="flex flex-col items-start px-2.5 py-1.5 rounded-lg border border-indigo-100 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-left transition text-[10px]"
                    >
                      <span className="font-semibold text-indigo-700 truncate w-full">{d.name}</span>
                      <span className="text-slate-400 truncate w-full">{d.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4 animate-fade-in delay-500">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-bold text-teal-600 hover:text-teal-500 hover:underline transition">
                Create Account
              </Link>
              <span className="mx-2 text-slate-300">|</span>
              <Link to="/" className="font-medium text-slate-400 hover:text-slate-600 transition">
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* ── Trust Footer ── */}
        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-slate-400">
          {['HIPAA Compliant', '256-bit SSL', 'Secure Login'].map(item => (
            <span key={item} className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-teal-400 inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
