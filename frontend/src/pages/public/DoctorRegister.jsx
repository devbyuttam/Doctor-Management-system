import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  Stethoscope, ShieldCheck, CheckCircle2, AlertTriangle,
  ArrowRight, ArrowLeft, Lock, Mail, User, Award, Building2,
  Phone, Eye, EyeOff, Search, FileText, Sparkles, X, BadgeCheck, HelpCircle
} from 'lucide-react';
import { verifyDoctorId, getDoctorRegistry } from '../../api/authApi';

const DoctorRegister = () => {
  const { register: registerAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Verification state
  const [doctorIdInput, setDoctorIdInput] = useState('DOC-1008');
  const [verifying, setVerifying] = useState(false);
  const [verifiedDoctor, setVerifiedDoctor] = useState(null);
  const [verifyError, setVerifyError] = useState(null);

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Registry directory modal state
  const [showDirectoryModal, setShowDirectoryModal] = useState(false);
  const [registryDoctors, setRegistryDoctors] = useState([]);
  const [directorySearch, setDirectorySearch] = useState('');
  const [loadingDirectory, setLoadingDirectory] = useState(false);
  const [statusFilter, setStatusFilter] = useState('available'); // 'all', 'available', 'registered'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Handle Verify Doctor ID
  const handleVerify = async (idToVerify) => {
    const targetId = (idToVerify || doctorIdInput || '').trim().toUpperCase();
    if (!targetId) {
      toast.error('Please enter a Doctor ID to verify');
      return;
    }

    setVerifying(true);
    setVerifyError(null);
    setVerifiedDoctor(null);

    try {
      const res = await verifyDoctorId(targetId);
      const doc = res.data?.data;
      setVerifiedDoctor(doc);
      setValue('name', doc.name);
      setValue('email', doc.assignedEmail, { shouldValidate: true, shouldDirty: true });
      setValue('phone', doc.contactPhone || '', { shouldValidate: true, shouldDirty: true });
      setValue('specialization', doc.specialization);
      setValue('doctorId', doc.doctorId);
      toast.success(`Doctor ID Verified: ${doc.name} (${doc.specialization})`, { icon: '✅' });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        `Doctor ID "${targetId}" was not found in the Hospital Medical Board Registry. Only authorized doctors can register.`;
      setVerifyError(msg);
      toast.error(msg);
    } finally {
      setVerifying(false);
    }
  };

  // Open directory modal
  const openDirectory = async () => {
    setShowDirectoryModal(true);
    if (registryDoctors.length === 0) {
      setLoadingDirectory(true);
      try {
        const res = await getDoctorRegistry();
        setRegistryDoctors(res.data?.data || []);
      } catch (err) {
        toast.error('Failed to load doctor directory');
      } finally {
        setLoadingDirectory(false);
      }
    }
  };

  // Select an ID from directory
  const handleSelectFromDirectory = (doc) => {
    setDoctorIdInput(doc.doctorId);
    setShowDirectoryModal(false);
    handleVerify(doc.doctorId);
  };

  // Submit activation/registration
  const onSubmit = async (data) => {
    if (!verifiedDoctor) {
      toast.error('Please verify your Doctor ID first before submitting');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: verifiedDoctor.name,
        email: data.email || verifiedDoctor.assignedEmail,
        password: data.password,
        phone: data.phone || verifiedDoctor.contactPhone,
        role: 'doctor',
        doctorId: verifiedDoctor.doctorId,
        specialization: verifiedDoctor.specialization,
        department: verifiedDoctor.department,
      };

      const user = await registerAuth(payload);
      toast.success(`🎉 Doctor Account Activated! Welcome Dr. ${user.name}`);
      navigate('/doctor/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to complete doctor activation');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered registry doctors
  const filteredDirectory = registryDoctors.filter((doc) => {
    if (statusFilter === 'available' && doc.isRegistered) return false;
    if (statusFilter === 'registered' && !doc.isRegistered) return false;

    if (!directorySearch) return true;
    const q = directorySearch.toLowerCase();
    return (
      doc.doctorId?.toLowerCase().includes(q) ||
      doc.name?.toLowerCase().includes(q) ||
      doc.specialization?.toLowerCase().includes(q) ||
      doc.department?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 py-12">
      {/* Background Orbs */}
      <div className="absolute top-[-80px] left-[-80px] w-96 h-96 rounded-full bg-teal-500/10 blur-3xl animate-orb-drift pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-80px] w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl animate-orb-drift pointer-events-none" style={{ animationDelay: '3s' }} />

      <div className="relative w-full max-w-4xl z-10 space-y-6">

        {/* ── Top Header Banner ── */}
        <div className="text-center text-white space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Protected Medical Staff Gateway
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Doctor Account Activation &amp; Registration
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Hospital policy requires all doctors to hold a pre-authorized Doctor ID registered with the Medical Board. Random registrations are strictly prohibited.
          </p>
        </div>

        {/* ── Main Registration Card ── */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">

          {/* STEP 1: DOCTOR ID VERIFICATION BAR */}
          <div className="bg-gradient-to-r from-indigo-700 via-blue-700 to-indigo-800 p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Step 1: Verify Doctor ID with Medical Board</h2>
                  <p className="text-xs text-indigo-200">
                    Enter your assigned 100 Hospital Doctor ID (e.g. DOC-1001 to DOC-1100)
                  </p>
                </div>
              </div>

              {/* View 100 Doctors Directory Button */}
              <button
                type="button"
                onClick={openDirectory}
                className="bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 flex-shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                Browse 100 Doctor IDs Directory
              </button>
            </div>

            {/* Input + Verify Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Award className="w-5 h-5 text-indigo-300 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={doctorIdInput}
                  onChange={(e) => setDoctorIdInput(e.target.value.toUpperCase())}
                  placeholder="e.g. DOC-1015"
                  className="w-full pl-11 pr-4 py-3 bg-white/10 text-white placeholder-indigo-300/60 border border-white/20 rounded-xl text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/15 transition uppercase"
                />
              </div>
              <button
                type="button"
                onClick={() => handleVerify()}
                disabled={verifying}
                className="py-3 px-6 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 flex-shrink-0 disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950/40 border-t-slate-950 rounded-full animate-spin" />
                    Checking Medical Registry...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Verify Doctor ID
                  </>
                )}
              </button>
            </div>

            {/* Fast Suggestion Chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-white/10 text-xs text-indigo-200">
              <span className="text-[11px] font-semibold text-indigo-300">Try Available Demo IDs:</span>
              {['DOC-1008', 'DOC-1015', 'DOC-1025', 'DOC-1042', 'DOC-1077'].map((demoId) => (
                <button
                  key={demoId}
                  type="button"
                  onClick={() => {
                    setDoctorIdInput(demoId);
                    handleVerify(demoId);
                  }}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg text-white font-mono text-xs transition"
                >
                  {demoId}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">

            {/* Verification Result: REJECTED */}
            {verifyError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 animate-fade-in">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm text-rose-900">Access Blocked: Unauthorized Doctor ID</h3>
                  <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{verifyError}</p>
                  <p className="text-[11px] text-rose-600 mt-2 font-medium">
                    Only pre-approved hospital staff with valid credentials may register. Click "Browse 100 Doctor IDs Directory" above to see available authorized IDs.
                  </p>
                </div>
              </div>
            )}

            {/* Verification Result: SUCCESS / VERIFIED */}
            {verifiedDoctor && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 animate-fade-in space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Doctor Identity Verified &amp; Approved
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-sm">
                    {verifiedDoctor.doctorId}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                  <div className="bg-white p-3 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Doctor Name</span>
                    <span className="font-extrabold text-slate-900 text-sm">{verifiedDoctor.name}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Specialty</span>
                    <span className="font-bold text-indigo-700">{verifiedDoctor.specialization}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
                    <span className="font-medium text-slate-700">{verifiedDoctor.department}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">MCI License</span>
                    <span className="font-mono font-bold text-slate-700">{verifiedDoctor.medicalLicenseNumber}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SET PASSWORD & ACTIVATE */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                  verifiedDoctor ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  2
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Step 2: Configure Password &amp; Activate Account</h3>
                  <p className="text-xs text-slate-400">Set your secret login credentials to complete registration</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Doctor Official Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Doctor Official Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        disabled={!verifiedDoctor}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 disabled:bg-slate-100 transition"
                      />
                    </div>
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        {...register('phone')}
                        disabled={!verifiedDoctor}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 disabled:bg-slate-100 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Set Portal Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        disabled={!verifiedDoctor}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: { value: 6, message: 'Minimum 6 characters' },
                        })}
                        className={`w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 disabled:bg-slate-100 transition ${
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
                      <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        disabled={!verifiedDoctor}
                        {...register('confirmPassword', {
                          required: 'Please confirm password',
                          validate: (val) => val === watch('password') || 'Passwords do not match',
                        })}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 disabled:bg-slate-100 transition ${
                          errors.confirmPassword ? 'border-rose-400' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-rose-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!verifiedDoctor || submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Activating Doctor Account...
                    </>
                  ) : (
                    <>
                      Complete Doctor Registration
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500 gap-2">
              <span>
                Already activated your ID?{' '}
                <Link to="/doctor/login" className="font-bold text-indigo-600 hover:underline">
                  Doctor Sign In
                </Link>
              </span>
              <span>
                Are you a patient?{' '}
                <Link to="/register" className="font-bold text-teal-600 hover:underline">
                  Patient Registration
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 100 DOCTOR IDS DIRECTORY MODAL ── */}
      {showDirectoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-700 to-blue-700 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-300" />
                  Hospital Medical Board — 100 Authorized Doctor Registry
                </h3>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Click any available Doctor ID to auto-fill and test registration
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDirectoryModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  placeholder="Search by ID (e.g. DOC-1020), Name, or Specialty..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex gap-1.5">
                {[
                  { key: 'available', label: 'Available (Unclaimed)' },
                  { key: 'registered', label: 'Claimed' },
                  { key: 'all', label: 'All 100' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      statusFilter === tab.key
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loadingDirectory ? (
                <div className="text-center py-12 text-slate-400 text-xs">Loading 100 Doctor Registry...</div>
              ) : filteredDirectory.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">No doctors found matching filters</div>
              ) : (
                filteredDirectory.map((doc) => (
                  <div
                    key={doc.doctorId}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                      doc.isRegistered
                        ? 'bg-slate-50/70 border-slate-200 opacity-75'
                        : 'bg-white hover:border-indigo-300 hover:bg-indigo-50/20 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center font-mono font-bold text-xs">
                        {doc.doctorId.replace('DOC-', '#')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{doc.name}</span>
                          <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            {doc.doctorId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {doc.specialization} &bull; {doc.department} &bull; {doc.experience} yrs exp
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {doc.isRegistered ? (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                          Claimed
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectFromDirectory(doc)}
                          className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg shadow-sm transition"
                        >
                          Use this ID &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorRegister;
