import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';
import { Stethoscope, CheckCircle, XCircle, Shield, Search } from 'lucide-react';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/doctors');
      setDoctors(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch doctors registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleVerifyDoctor = async (doctorId, status) => {
    try {
      await api.put(`/admin/doctors/${doctorId}/verify`, { status });
      toast.success(`Doctor status updated to ${status}`);
      fetchDoctors();
    } catch (err) {
      toast.error('Failed to verify doctor status');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Doctor Verification & Management</h1>
        <p className="text-sm text-slate-500">Review doctor profiles, credentials, and grant system approval</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching doctors database..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchDoctors} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">Doctor Name</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Fee (₹)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {doc.userId?.name ? doc.userId.name.charAt(0) : 'D'}
                      </div>
                      <div>
                        <span>Dr. {doc.userId?.name || 'Unknown'}</span>
                        <p className="text-xs text-slate-400 font-normal">{doc.userId?.email}</p>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{doc.specialization}</td>
                    <td className="p-4 font-bold text-slate-900">₹{doc.consultationFee}</td>
                    <td className="p-4">
                      <StatusBadge status={doc.verificationStatus} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {doc.verificationStatus !== 'approved' && (
                          <button
                            onClick={() => handleVerifyDoctor(doc._id, 'approved')}
                            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}

                        {doc.verificationStatus !== 'rejected' && (
                          <button
                            onClick={() => handleVerifyDoctor(doc._id, 'rejected')}
                            className="py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;
