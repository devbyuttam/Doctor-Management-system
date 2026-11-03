import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, FilePlus, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/appointments');
      setAppointments(res.data?.data || []);
    } catch (err) {
      setError('Failed to load doctor appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success(`Appointment status updated to ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Doctor Schedule & Appointments</h1>
        <p className="text-sm text-slate-500">Manage patient bookings, start consultations, and write prescriptions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        {['all', 'scheduled', 'in-consultation', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`pb-3 capitalize transition ${
              statusFilter === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching appointments schedule..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchAppointments} />
      ) : filteredAppointments.length === 0 ? (
        <EmptyState icon={Calendar} title="No appointments found" description="No records match the selected filter." />
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg border border-blue-200 flex-shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-lg">{app.patientId?.userId?.name || 'Patient'}</h3>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
                      Token #{app.tokenNumber}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(app.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {app.startTime} - {app.endTime}</span>
                    <span>Contact: {app.patientId?.userId?.phone || 'N/A'}</span>
                  </div>

                  {app.reason && (
                    <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      Reason: "{app.reason}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <StatusBadge status={app.status} />

                {app.status === 'scheduled' && (
                  <button
                    onClick={() => handleUpdateStatus(app._id, 'in-consultation')}
                    className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                  >
                    Start Consultation
                  </button>
                )}

                {app.status === 'in-consultation' && (
                  <button
                    onClick={() => handleUpdateStatus(app._id, 'completed')}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => navigate('/doctor/prescriptions', { state: { appointmentId: app._id, patientId: app.patientId?._id } })}
                  className="py-1.5 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1"
                >
                  <FilePlus className="w-3.5 h-3.5" /> Write Prescription
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
