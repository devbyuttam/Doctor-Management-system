import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { Shield, Users, Stethoscope, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          api.get('/admin/dashboard').catch(() => ({ data: { data: {} } })),
          api.get('/admin/analytics').catch(() => ({ data: { data: {} } }))
        ]);
        setStats(statsRes.data?.data || {});
        setAnalytics(analyticsRes.data?.data || {});
      } catch (err) {
        setError('Failed to load admin analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading system dashboard stats..." />;
  if (error) return <ErrorMessage message={error} />;

  const doctorsCount = stats.usersByRole?.find(u => u._id === 'doctor')?.count || 0;
  const patientsCount = stats.usersByRole?.find(u => u._id === 'patient')?.count || 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
            System Administration
          </span>
          <h1 className="text-3xl font-extrabold mt-2">Hospital Analytics & Control</h1>
          <p className="text-sm text-slate-300 mt-1">Platform overview, doctor verification, and appointment revenue</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{doctorsCount}</p>
            <p className="text-xs font-semibold text-slate-500">Registered Doctors</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{patientsCount}</p>
            <p className="text-xs font-semibold text-slate-500">Registered Patients</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-purple-50 text-purple-600">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{stats.todaysAppointments || 0}</p>
            <p className="text-xs font-semibold text-slate-500">Today's Appointments</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 rounded-xl bg-amber-50 text-amber-600">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">₹{stats.totalRevenue || 0}</p>
            <p className="text-xs font-semibold text-slate-500">Total System Revenue</p>
          </div>
        </div>
      </div>

      {/* Appointments Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Appointments Status Breakdown
          </h3>

          <div className="space-y-3">
            {(stats.appointmentsByStatus || []).map((item) => (
              <div key={item._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-semibold capitalize text-slate-700">{item._id} Appointments</span>
                <span className="text-sm font-extrabold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-indigo-600" /> Popular Specializations
          </h3>

          <div className="space-y-3">
            {(analytics.appointmentsBySpecialization || []).map((item) => (
              <div key={item._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-sm font-semibold text-slate-700">{item._id}</span>
                <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                  {item.count} visits
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
