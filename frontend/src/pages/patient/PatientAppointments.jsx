import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';
import { Calendar, Clock, Stethoscope, AlertTriangle, XCircle, Search } from 'lucide-react';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch appointments history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(appointmentId);
    try {
      await api.put(`/appointments/${appointmentId}/status`, {
        status: 'cancelled',
        cancelReason: 'Cancelled by patient',
      });
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
          <p className="text-sm text-slate-500">Manage your past and upcoming consultations</p>
        </div>
        <Link
          to="/patient/doctors"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" /> Book New Slot
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        {['all', 'scheduled', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`pb-3 capitalize transition ${
              filterStatus === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching appointments..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchAppointments} />
      ) : filteredAppointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments found"
          description={`No ${filterStatus !== 'all' ? filterStatus : ''} appointments record found.`}
        />
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div
              key={app._id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100 flex-shrink-0">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    Dr. {app.doctorId?.userId?.name || 'Specialist'}
                  </h3>
                  <p className="text-xs text-blue-600 font-semibold">{app.doctorId?.specialization}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(app.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {app.startTime} - {app.endTime}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                      Token #{app.tokenNumber}
                    </span>
                  </div>

                  {app.reason && (
                    <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{app.reason}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <StatusBadge status={app.status} />

                {app.status === 'scheduled' && (
                  <button
                    onClick={() => handleCancelAppointment(app._id)}
                    disabled={cancellingId === app._id}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition border border-rose-200 flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    {cancellingId === app._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
