import React, { useState, useContext, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Stethoscope, Lock, Mail, ArrowRight, ShieldCheck,
  Eye, EyeOff, BadgeCheck, Activity, Award, User,
  CheckCircle2, AlertCircle, FileCheck
} from 'lucide-react';

const VIRTUAL_DOCTORS = [
  {
    name: 'Dr. Anika Sharma',
    email: 'doctor@hospital.com',
    pass: 'Doctor@123456',
    specialty: 'Cardiologist',
    experience: '12 yrs exp',
    rating: '4.8 ⭐',
    fee: '₹800',
    avatar: 'AS',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    name: 'Dr. Rohan Mehta',
    email: 'doctor2@hospital.com',
    pass: 'Doctor@123456',
    specialty: 'Orthopedic Surgeon',
    experience: '9 yrs exp',
    rating: '4.6 ⭐',
    fee: '₹700',
    avatar: 'RM',
    color: 'from-emerald-600 to-teal-600',
  },
  {
    name: 'Dr. Priya Nair',
    email: 'doctor3@hospital.com',
    pass: 'Doctor@123456',
    specialty: 'Dermatologist',
    experience: '7 yrs exp',
    rating: '4.9 ⭐',
    fee: '₹600',
    avatar: 'PN',
    color: 'from-rose-600 to-pink-600',
  },
  {
    name: 'Dr. Arjun Kapoor',
    email: 'doctor4@hospital.com',
    pass: 'Doctor@123456',
    specialty: 'Neurologist',
    experience: '15 yrs exp',
    rating: '4.7 ⭐',
    fee: '₹1000',
    avatar: 'AK',
    color: 'from-violet-600 to-purple-600',
  },
  {
    name: 'Dr. Kavitha Reddy',
    email: 'doctor5@hospital.com',
    pass: 'Doctor@123456',
    specialty: 'Pediatrician',
    experience: '10 yrs exp',
    rating: '4.9 ⭐',
    fee: '₹500',
    avatar: 'KR',
    color: 'from-amber-600 to-orange-600',
  },
];

const DoctorLogin = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: 'doctor@hospital.com',
      password: 'Doctor@123456',
    },
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(VIRTUAL_DOCTORS[0]);
  const formRef = useRef(null);

  const from = location.state?.from?.pathname;

  const selectDoctorAccount = (doc) => {
    setSelectedDoctor(doc);
    setValue('email', doc.email);
    setValue('password', doc.pass);
    toast.success(`Loaded credentials for ${doc.name}`, { duration: 2500, icon: '🩺' });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      if (user.role !== 'doctor' && user.role !== 'admin') {
        toast(`Signed in as ${user.role}. Redirecting...`, { icon: 'ℹ️' });
      } else {
        toast.success(`Welcome to Doctor Portal, Dr. ${user.name}!`);
      }
      navigate(from || `/${user.role}/dashboard`, { replace: true });
    } catch (err) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      toast.error(err.response?.data?.message || 'Invalid doctor credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center p-4 py-12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Background glowing medical orbs */}
      <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-teal-500/10 blur-3xl animate-orb-drift pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-80px] w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl animate-orb-drift pointer-events-none" style={{ animationDelay: '3s' }} />

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">

        {/* ── Left Column: Doctor Selection & Info ── */}
        <div className="lg:col-span-5 text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-indigo-400" />
            Healthcare Provider Access
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Doctor Consultation <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-indigo-300 to-blue-400">
                Management Portal
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Sign in to manage patient appointments, live queue visits, digital prescriptions, and EHR medical records.
            </p>
          </div>

          {/* Virtual Doctors Quick Switcher */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                Select Demo Doctor Account
              </span>
              <span className="text-[10px] text-teal-400 bg-teal-900/40 border border-teal-500/30 px-2 py-0.5 rounded-full">
                5 Accounts Ready
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {VIRTUAL_DOCTORS.map((doc) => {
                const isSelected = selectedDoctor.email === doc.email;
                return (
                  <button
                    key={doc.email}
                    type="button"
                    onClick={() => selectDoctorAccount(doc)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-900/60 to-slate-800/80 border-indigo-400 shadow-md shadow-indigo-500/10'
                        : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${doc.color} flex items-center justify-center font-bold text-white text-xs shadow`}>
                        {doc.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white flex items-center gap-1.5">
                          {doc.name}
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 inline" />}
                        </p>
                        <p className="text-xs text-indigo-300 font-medium">{doc.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-teal-300 block">{doc.fee}</span>
                      <span className="text-[10px] text-slate-400">{doc.experience}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-slate-400">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-teal-400 mx-auto mb-1" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <Award className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <span>MCI Verified</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <Activity className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span>Live Queue Sync</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Doctor Login Form ── */}
        <div className="lg:col-span-7">
          <div
            ref={formRef}
            className={`bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden ${
              shakeError ? 'animate-shake' : ''
            }`}
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 p-8 text-white relative">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full text-indigo-100 flex items-center gap-1.5 border border-white/20">
                  <BadgeCheck className="w-3.5 h-3.5 text-teal-300" />
                  Doctor Authentication
                </span>
              </div>
              <h2 className="text-2xl font-black">Doctor Sign In</h2>
              <p className="text-xs text-indigo-200 mt-1">
                Enter your registered physician credentials or use a demo profile from the left.
              </p>
            </div>

            {/* Active Selected Doctor Banner */}
            <div className="bg-indigo-50/80 px-6 py-3 border-b border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-indigo-950">Active Selected Profile:</span>
                <span className="text-xs font-extrabold text-indigo-700">{selectedDoctor.name}</span>
                <span className="text-xs text-slate-500">({selectedDoctor.specialty})</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-white border border-indigo-200 px-2 py-0.5 rounded-md">
                Verified
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5" noValidate>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Doctor ID or Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. DOC-1001 or doctor@hospital.com"
                    {...register('email', {
                      required: 'Doctor ID or Email is required',
                    })}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition ${
                      errors.email ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email.message}
                  </p>
                )}
                <p className="text-[11px] text-slate-400 mt-1">
                  You can sign in with your unique Doctor ID (e.g. <span className="font-mono text-indigo-600 font-bold">DOC-1001</span>) or official email.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-indigo-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Minimum 6 characters' },
                    })}
                    className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition ${
                      errors.password ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Verifying Credentials...
                  </>
                ) : (
                  <>
                    Sign In to Doctor Portal
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span>
                  Are you a patient?{' '}
                  <Link to="/login" className="font-bold text-teal-600 hover:underline">
                    Patient Login
                  </Link>
                </span>
                <Link to="/doctor/register" className="font-bold text-indigo-600 hover:underline">
                  Doctor ID Activation &amp; Register &rarr;
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
