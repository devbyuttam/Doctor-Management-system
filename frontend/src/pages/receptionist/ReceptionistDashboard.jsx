import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';
import { Clock, Plus, UserCheck, Stethoscope } from 'lucide-react';

const ReceptionistDashboard = () => {
  const [queue, setQueue] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Walk-in form state
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchQueueData = async () => {
    setLoading(true);
    try {
      const [queueRes, docRes] = await Promise.all([
        api.get('/queue/today').catch(() => ({ data: { data: [] } })),
        api.get('/doctors').catch(() => ({ data: { data: [] } }))
      ]);
      setQueue(queueRes.data?.data || []);
      const docList = docRes.data?.data || [];
      setDoctors(docList);
      if (docList.length > 0 && !doctorId) {
        setDoctorId(docList[0]._id);
      }
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
  }, []);

  const handleWalkInRegister = async (e) => {
    e.preventDefault();
    if (!patientName || !doctorId) {
      toast.error('Please enter patient name and select a doctor');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/queue/walk-in', {
        patientName,
        patientPhone,
        doctorId,
        reason,
      });
      toast.success('Walk-in patient registered & token generated!');
      setPatientName('');
      setPatientPhone('');
      setReason('');
      fetchQueueData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register walk-in patient');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQueueStatus = async (queueId, status) => {
    try {
      await api.put(`/queue/${queueId}/status`, { status });
      toast.success(`Queue status set to ${status}`);
      fetchQueueData();
    } catch (err) {
      toast.error('Failed to update queue status');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Receptionist Queue Control</h1>
        <p className="text-sm text-slate-500">Register walk-in patients and manage physical hospital queue</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Walk-in Registration Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <Plus className="w-5 h-5 text-blue-600" /> Walk-In Patient Entry
          </h3>

          <form onSubmit={handleWalkInRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Patient Name
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Assign Doctor
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.userId?.name} ({d.specialization})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Reason for Consultation
              </label>
              <input
                type="text"
                placeholder="Walk-in checkup"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Issue Token & Add to Queue'}
            </button>
          </form>
        </div>

        {/* Live Queue Display */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-indigo-600" /> Today's Live Queue List
          </h3>

          {loading ? (
            <LoadingSpinner message="Fetching queue status..." />
          ) : queue.length === 0 ? (
            <p className="text-center py-8 text-slate-500 text-sm">No walk-in queue records for today.</p>
          ) : (
            <div className="space-y-3">
              {queue.map((item) => (
                <div key={item._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm">
                      #{item.tokenNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.patientName || item.patientId?.userId?.name}</h4>
                      <p className="text-xs text-slate-500">Doctor: Dr. {item.doctorId?.userId?.name || 'Assigned'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status} />

                    {item.status === 'waiting' && (
                      <button
                        onClick={() => handleQueueStatus(item._id, 'in-consultation')}
                        className="py-1 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition"
                      >
                        Call Patient
                      </button>
                    )}

                    {item.status === 'in-consultation' && (
                      <button
                        onClick={() => handleQueueStatus(item._id, 'completed')}
                        className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
