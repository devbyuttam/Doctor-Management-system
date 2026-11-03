import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';
import {
  Calendar, Users, Clock, CheckCircle, Stethoscope,
  FilePlus, ChevronRight, Star, Activity, TrendingUp,
  BadgeCheck, PhoneCall, Shield
} from 'lucide-react';

const StatCard = ({ icon: Icon, value, label, color, subtext }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300`}>
    <div className={`p-3.5 rounded-xl flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      {subtext && <p className="text-[10px] text-slate-400 mt-0.5">{subtext}</p>}
    </div>
  </div>
);

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const [appRes, meRes] = await Promise.all([
          api.get('/appointments').catch(() => ({ data: { data: [] } })),
          api.get('/doctors/me').catch(() => ({ data: { data: null } })),
        ]);
        setAppointments(appRes.data?.data || []);
        setDoctorProfile(meRes.data?.data || null);
      } catch (err) {
        // gracefully handle
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(
    a => new Date(a.date).toISOString().split('T')[0] === todayStr,
  );
  const pendingQueue = appointments.filter(
    a => a.status === 'scheduled' || a.status === 'in-consultation',
  );
  const completedToday = appointments.filter(a => a.status === 'completed');

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      toast.success(`Appointment marked as ${newStatus}`);
      const res = await api.get('/appointments');
      setAppointments(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      {/* ── Header Banner ── */}
      <div className="relative bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-indigo-500/20 overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-[-40px] right-[-40px] w-56 h-56 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-[-20px] left-[30%] w-40 h-40 rounded-full bg-indigo-400/15 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 bg-white/10 px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5" /> Doctor Portal
              </span>
              {doctorProfile?.verificationStatus === 'approved' && (
                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome, Dr. {user?.name} 👋
            </h1>
            <p className="text-sm text-indigo-200 mt-1 flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              {doctorProfile?.specialization || 'Specialist'} &nbsp;•&nbsp;
              Consultation Fee: ₹{doctorProfile?.consultationFee || 500}
            </p>
            {doctorProfile?.averageRating > 0 && (
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span className="text-sm font-semibold text-amber-200">{doctorProfile.averageRating.toFixed(1)}</span>
                <span className="text-xs text-indigo-300">({doctorProfile.totalReviews} reviews)</span>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/doctor/appointments"
              className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white border border-white/20 font-semibold px-5 py-2.5 rounded-2xl shadow transition flex items-center gap-2 text-sm"
            >
              <Calendar className="w-4 h-4" /> View Appointments
            </Link>
            <Link
              to="/doctor/settings"
              className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-5 py-2.5 rounded-2xl shadow-md transition flex items-center gap-2 flex-shrink-0 text-sm"
            >
              Manage Schedule &amp; Fee
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={Calendar}
          value={todaysAppointments.length}
          label="Today's Schedule"
          color="bg-indigo-50 text-indigo-600"
          subtext={new Date().toLocaleDateString('en-IN', { weekday: 'long' })}
        />
        <StatCard
          icon={Clock}
          value={pendingQueue.length}
          label="Queue Remaining"
          color="bg-amber-50 text-amber-600"
          subtext="Active + waiting"
        />
        <StatCard
          icon={CheckCircle}
          value={completedToday.length}
          label="Completed Today"
          color="bg-emerald-50 text-emerald-600"
          subtext="Consultations done"
        />
        <StatCard
          icon={Users}
          value={appointments.length}
          label="Total Appointments"
          color="bg-blue-50 text-blue-600"
          subtext="All time"
        />
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: '/doctor/prescriptions', label: 'Write Prescription', icon: FilePlus, color: 'bg-teal-600 hover:bg-teal-500', desc: 'Create & manage prescriptions' },
          { to: '/doctor/appointments', label: 'Full Appointment List', icon: Calendar, color: 'bg-indigo-600 hover:bg-indigo-500', desc: 'View, filter & manage all appointments' },
          { to: '/doctor/settings', label: 'Update Availability', icon: Clock, color: 'bg-blue-600 hover:bg-blue-500', desc: 'Set your working hours & slots' },
        ].map(action => {
          const Icon = action.icon;
          return (
            <Link
              key={action.to}
              to={action.to}
              className={`group ${action.color} text-white p-5 rounded-2xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg flex items-center gap-4`}
            >
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{action.label}</p>
                <p className="text-xs opacity-75 mt-0.5">{action.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto opacity-50 group-hover:opacity-100 transition" />
            </Link>
          );
        })}
      </div>

      {/* ── Live Patient Queue ── */}
      {loading ? (
        <LoadingSpinner message="Fetching patient queue..." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-slate-900">Live Patient Queue</h3>
                <p className="text-xs text-slate-500">Active consultations and waiting list</p>
              </div>
            </div>
            <Link
              to="/doctor/appointments"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-6">
            {pendingQueue.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-medium">No patients in queue right now</p>
                <p className="text-slate-400 text-xs mt-1">New appointments will appear here automatically</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingQueue.map((app, i) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-200 hover:bg-indigo-50/20 transition"
                  >
                    <div className="flex items-center gap-4">
                      {/* Token */}
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                        #{app.tokenNumber || i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {app.patientId?.userId?.name || 'Patient'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {app.startTime}
                          {app.patientId?.userId?.phone && (
                            <>
                              &nbsp;•&nbsp;
                              <PhoneCall className="w-3 h-3 inline mr-0.5" />
                              {app.patientId.userId.phone}
                            </>
                          )}
                        </p>
                        {app.reason && (
                          <p className="text-xs text-slate-500 mt-0.5 italic">
                            &ldquo;{app.reason}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {app.status === 'scheduled' && (
                        <button
                          onClick={() => handleUpdateStatus(app._id, 'in-consultation')}
                          className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition hover:scale-[1.02]"
                        >
                          Start Consultation
                        </button>
                      )}
                      {app.status === 'in-consultation' && (
                        <button
                          onClick={() => handleUpdateStatus(app._id, 'completed')}
                          className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition hover:scale-[1.02]"
                        >
                          Complete Visit
                        </button>
                      )}
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
