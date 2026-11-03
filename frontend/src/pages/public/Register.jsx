import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  User, Mail, Lock, Phone, Stethoscope, ArrowRight,
  UserCheck, Eye, EyeOff, ShieldCheck, BadgeCheck, HeartPulse,
  Award, CheckCircle2, AlertTriangle, Sparkles
} from 'lucide-react';
import { verifyDoctorId } from '../../api/authApi';

const ROLE_OPTIONS = [
  {
    value: 'patient',
    label: 'Patient',
    icon: UserCheck,
    desc: 'Book appointments & manage health records',
    color: 'teal',
    active: 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm shadow-teal-200',
    inactive: 'bg-slate-50 border-slate-200 text-slate-600 hover:border-teal-300',
  },
  {
    value: 'doctor',
    label: 'Doctor / Healthcare Provider',
    icon: Stethoscope,
    desc: 'Register as a verified medical professional',
    color: 'indigo',
    active: 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm shadow-indigo-200',
    inactive: 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300',
  },
];

const Register = () => {
  const {
    register: registerField,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'patient' } });
  const { register: registerAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Doctor ID verification states
  const [doctorIdInput, setDoctorIdInput] = useState('DOC-1008');
  const [verifyingDoctor, setVerifyingDoctor] = useState(false);
  const [verifiedDoctor, setVerifiedDoctor] = useState(null);
  const [doctorVerifyError, setDoctorVerifyError] = useState(null);

  const selectedRole = watch('role');
  const activeOption = ROLE_OPTIONS.find(r => r.value === selectedRole) || ROLE_OPTIONS[0];

  const handleVerifyDoctor = async (idToVerify) => {
    const targetId = (idToVerify || doctorIdInput || '').trim().toUpperCase();
    if (!targetId) {
      toast.error('Please enter a Doctor ID to verify');
      return;
    }

    setVerifyingDoctor(true);
    setDoctorVerifyError(null);
    setVerifiedDoctor(null);

    try {
      const res = await verifyDoctorId(targetId);
      const doc = res.data?.data;
      setVerifiedDoctor(doc);
      setValue('name', doc.name, { shouldValidate: true });
      setValue('email', doc.assignedEmail, { shouldValidate: true });
      if (doc.contactPhone) {
        setValue('phone', doc.contactPhone, { shouldValidate: true });
      }
      toast.success(`Doctor ID Verified: ${doc.name} (${doc.specialization})`, { icon: '✅' });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        `Doctor ID "${targetId}" not found in Hospital Medical Board Registry.`;
      setDoctorVerifyError(msg);
      toast.error(msg);
    } finally {
      setVerifyingDoctor(false);
    }
  };

  const onSubmit = async (data) => {
    if (selectedRole === 'doctor' && !verifiedDoctor) {
      toast.error('Please enter and verify your Hospital Doctor ID first');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: selectedRole === 'doctor' ? (verifiedDoctor?.name || data.name) : data.name,
        email: (selectedRole === 'doctor' ? (data.email || verifiedDoctor?.assignedEmail) : data.email)?.toLowerCase().trim(),
        password: data.password,
        phone: selectedRole === 'doctor' ? (data.phone || verifiedDoctor?.contactPhone) : data.phone,
        role: selectedRole,
      };

      if (selectedRole === 'doctor' && verifiedDoctor) {
        payload.doctorId = verifiedDoctor.doctorId;
        payload.specialization = verifiedDoctor.specialization;
        payload.department = verifiedDoctor.department;
      }

      const user = await registerAuth(payload);
      toast.success('🎉 Registration successful! Welcome to MediCare.');
      navigate(`/${user.role}/dashboard`, { replace: true });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to register account';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const gradHeader =
    selectedRole === 'doctor'
      ? 'from-indigo-600 via-blue-600 to-indigo-700'
      : 'from-teal-600 via-emerald-600 to-teal-700';

  const ringColor =
    selectedRole === 'doctor' ? 'focus:ring-indigo-500' : 'focus:ring-teal-500';

  const btnColor =
    selectedRole === 'doctor'
      ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30'
      : 'bg-teal-600 hover:bg-teal-500 shadow-teal-500/30';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/20 to-indigo-50/30 py-10">

      {/* Orbs */}
      <div className="absolute top-[-40px] left-[-60px] w-80 h-80 rounded-full bg-teal-300/15 blur-3xl animate-orb-drift pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-80px] w-72 h-72 rounded-full bg-indigo-300/15 blur-3xl animate-orb-drift pointer-events-none" style={{ animationDelay: '3s' }} />

      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-lg animate-scale-in">
        {/* Card glow */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${selectedRole === 'doctor' ? 'from-indigo-500 to-blue-600' : 'from-teal-500 to-emerald-600'} opacity-10 rounded-3xl blur-2xl scale-105 transition-all duration-500`}
        />

        <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
          {/* ── HEADER ── */}
          <div className={`bg-gradient-to-br ${gradHeader} p-8 text-white text-center relative overflow-hidden`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_130%,rgba(255,255,255,0.12),transparent_60%)]" />

            <div className="w-16 h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float shadow-lg border border-white/20">
              <HeartPulse className="w-9 h-9 text-white" strokeWidth={1.8} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-2">
              <BadgeCheck className="w-3.5 h-3.5" />
              Create Your Account
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight">Join MediCare</h2>
            <p className="text-xs opacity-80 mt-1">Your smart healthcare portal</p>

            <div className="absolute bottom-3 left-4 flex items-center gap-1 text-[10px] opacity-50">
              <ShieldCheck className="w-3 h-3" />
              <span>256-bit SSL Encrypted</span>
            </div>
          </div>

          <div className="p-7 space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

              {/* ── Role Selector ── */}
              <div className="animate-fade-in-up">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                  I am registering as:
                </label>
                <div className="flex flex-col gap-2">
                  {ROLE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = selectedRole === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${isActive ? opt.active : opt.inactive}`}
                      >
                        <input
                          type="radio"
                          value={opt.value}
                          {...registerField('role')}
                          className="sr-only"
                        />
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? `bg-${opt.color}-600 text-white` : 'bg-slate-200 text-slate-500'} transition`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{opt.label}</p>
                          <p className={`text-xs ${isActive ? `text-${opt.color}-600` : 'text-slate-400'}`}>{opt.desc}</p>
                        </div>
                        {isActive && (
                          <div className="ml-auto">
                            <BadgeCheck className={`w-5 h-5 text-${opt.color}-500`} />
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Doctor Verification Section */}
                {selectedRole === 'doctor' && (
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 p-4 rounded-2xl mt-3 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-indigo-900 text-xs font-bold">
                        <Award className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                        <span>Pre-Authorized Hospital Doctor ID</span>
                      </div>
                      <Link
                        to="/doctor/register"
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold underline"
                      >
                        Browse Directory &rarr;
                      </Link>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={doctorIdInput}
                        onChange={(e) => setDoctorIdInput(e.target.value.toUpperCase())}
                        placeholder="e.g. DOC-1008"
                        className="flex-1 px-3 py-2 bg-white border border-indigo-200 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleVerifyDoctor()}
                        disabled={verifyingDoctor}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {verifyingDoctor ? (
                          <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                        Verify ID
                      </button>
                    </div>

                    {/* Quick Demo IDs */}
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-indigo-700">
                      <span className="font-medium text-slate-500">Quick IDs:</span>
                      {['DOC-1008', 'DOC-1015', 'DOC-1025', 'DOC-1042'].map(demoId => (
                        <button
                          key={demoId}
                          type="button"
                          onClick={() => {
                            setDoctorIdInput(demoId);
                            handleVerifyDoctor(demoId);
                          }}
                          className="px-2 py-0.5 bg-white border border-indigo-200 rounded-md font-mono hover:bg-indigo-50 transition"
                        >
                          {demoId}
                        </button>
                      ))}
                    </div>

                    {/* Doctor ID verified status */}
                    {verifiedDoctor && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-900 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold text-emerald-800">
                            Verified: {verifiedDoctor.name}
                          </p>
                          <p className="text-[11px] text-emerald-700">
                            {verifiedDoctor.specialization} &bull; {verifiedDoctor.department}
                          </p>
                        </div>
                      </div>
                    )}

                    {doctorVerifyError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700 animate-fade-in">
                        <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[11px]">{doctorVerifyError}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Full Name ── */}
              <div className="animate-fade-in-up delay-100">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-teal-500 transition" />
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    {...registerField('name', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none ${ringColor} focus:ring-2 focus:bg-white transition-all ${errors.name ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300'}`}
                  />
                </div>
                {errors.name && <p className="text-rose-500 text-xs mt-1.5 animate-fade-in">{errors.name.message}</p>}
              </div>

              {/* ── Email ── */}
              <div className="animate-fade-in-up delay-150">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-teal-500 transition" />
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    {...registerField('email', {
                      required: 'Email is required',
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                    })}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none ${ringColor} focus:ring-2 focus:bg-white transition-all ${errors.email ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300'}`}
                  />
                </div>
                {errors.email && <p className="text-rose-500 text-xs mt-1.5 animate-fade-in">{errors.email.message}</p>}
              </div>

              {/* ── Phone ── */}
              <div className="animate-fade-in-up delay-200">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-teal-500 transition" />
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    {...registerField('phone', {
                      required: 'Phone number is required',
                      pattern: { value: /^[+\d\s-]{7,15}$/, message: 'Enter a valid phone number' },
                    })}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none ${ringColor} focus:ring-2 focus:bg-white transition-all ${errors.phone ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300'}`}
                  />
                </div>
                {errors.phone && <p className="text-rose-500 text-xs mt-1.5 animate-fade-in">{errors.phone.message}</p>}
              </div>

              {/* ── Password ── */}
              <div className="animate-fade-in-up delay-300">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-teal-500 transition" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Minimum 6 characters"
                    {...registerField('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters required' },
                    })}
                    className={`w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none ${ringColor} focus:ring-2 focus:bg-white transition-all ${errors.password ? 'border-rose-400' : 'border-slate-200 hover:border-slate-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 transition"
                    tabIndex={-1}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-500 text-xs mt-1.5 animate-fade-in">{errors.password.message}</p>}
                <p className="text-[10px] text-slate-400 mt-1.5">
                  Use at least 6 characters for your secure password.
                </p>
              </div>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={loading || (selectedRole === 'doctor' && !verifiedDoctor)}
                className={`w-full py-3.5 ${btnColor} text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up delay-400`}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    {selectedRole === 'doctor'
                      ? (verifiedDoctor ? `Complete Doctor Registration (${verifiedDoctor.doctorId})` : 'Verify Doctor ID to Register')
                      : 'Create Patient Account'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* ── Footer ── */}
            <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4 animate-fade-in delay-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-teal-600 hover:text-teal-500 hover:underline transition">
                Sign In
              </Link>
              <span className="mx-2 text-slate-300">|</span>
              <Link to="/" className="font-medium text-slate-400 hover:text-slate-600 transition">
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-slate-400">
          {['HIPAA Compliant', '256-bit SSL', 'Data Protected'].map(item => (
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

export default Register;