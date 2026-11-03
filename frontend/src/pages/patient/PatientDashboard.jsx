import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import { Calendar, Search, FileText, Bot, Clock, Stethoscope, ChevronRight, User } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, prescRes] = await Promise.all([
          api.get('/appointments').catch(() => ({ data: { data: [] } })),
          api.get('/prescriptions').catch(() => ({ data: { data: [] } }))
        ]);
        setAppointments(appRes.data?.data || []);
        setPrescriptions(prescRes.data?.data || []);
      } catch (err) {
        // handle gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl shadow-teal-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden">
        <div className="absolute top-[-30px] right-[-30px] w-48 h-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-20px] left-[40%] w-32 h-32 rounded-full bg-emerald-400/15 blur-2xl" />
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Patient Portal
          </span>
          <h1 className="text-3xl font-extrabold mt-2 tracking-tight">Welcome back, {user?.name}! 👋</h1>
          <p className="text-sm text-teal-100 mt-1 max-w-xl">
            Track your scheduled visits, access medical records, and consult our AI symptom assistant anytime.
          </p>
        </div>
        <Link
          to="/patient/doctors"
          className="relative z-10 bg-white text-teal-700 hover:bg-teal-50 font-bold px-6 py-3 rounded-2xl shadow-lg transition flex items-center gap-2 flex-shrink-0 hover:scale-[1.02]"
        >
          <Search className="w-4 h-4" /> Book New Appointment
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="p-4 rounded-xl bg-teal-50 text-teal-600">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{upcomingAppointments.length}</p>
            <p className="text-xs font-semibold text-slate-500">Upcoming Appointments</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{completedAppointments.length}</p>
            <p className="text-xs font-semibold text-slate-500">Consultations Completed</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all">
          <div className="p-4 rounded-xl bg-indigo-50 text-indigo-600">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{prescriptions.length}</p>
            <p className="text-xs font-semibold text-slate-500">Digital Prescriptions</p>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <LoadingSpinner message="Loading your health portal..." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Schedule */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-lg">Upcoming Appointments</h3>
              <Link to="/patient/appointments" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((app) => (
                  <div key={app._id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100 flex-shrink-0">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Dr. {app.doctorId?.userId?.name || 'Specialist'}</h4>
                        <p className="text-xs text-blue-600 font-medium">{app.doctorId?.specialization || 'General'}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(app.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {app.startTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        Token #{app.tokenNumber}
                      </span>
                      <StatusBadge status={app.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
                <p className="text-sm text-slate-500">You don't have any upcoming appointments scheduled.</p>
                <Link to="/patient/doctors" className="inline-block text-xs font-semibold bg-blue-600 text-white px-4 py-2 rounded-xl">
                  Find a Doctor & Book
                </Link>
              </div>
            )}
          </div>

          {/* Quick Action Tiles & AI Widget */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base">AI Symptom Assistant</h4>
                  <p className="text-xs text-slate-400">Instant AI Triage & Guidance</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Experiencing unexpected symptoms? Describe them to our intelligent health assistant for instant advice.
              </p>
              <Link
                to="/patient/ai-assistant"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition"
              >
                Launch AI Assistant
              </Link>
            </div>

            {/* Quick Links */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-3 shadow-sm">
              <h4 className="font-bold text-slate-900 text-sm">Quick Management</h4>
              <div className="space-y-2 text-xs font-semibold">
                <Link to="/patient/prescriptions" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition">
                  <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-purple-500" /> Prescriptions History</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
                <Link to="/patient/profile" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition">
                  <span className="flex items-center gap-2"><User className="w-4 h-4 text-emerald-500" /> Medical History Profile</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
