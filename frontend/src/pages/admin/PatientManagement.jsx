import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import StatusBadge from '../../components/common/StatusBadge';
import { Users, Phone, Mail } from 'lucide-react';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/patients');
      setPatients(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch patient registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Patient Registry & Accounts</h1>
        <p className="text-sm text-slate-500">View registered patients and profile statuses</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading patient database..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchPatients} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Contact Email</th>
                  <th className="p-4">Phone Number</th>
                  <th className="p-4">Blood Group</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition">
                    <td className="p-4 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                        {p.userId?.name ? p.userId.name.charAt(0) : 'P'}
                      </div>
                      <span>{p.userId?.name || 'Unknown Patient'}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-600">{p.userId?.email}</td>
                    <td className="p-4">{p.userId?.phone || 'N/A'}</td>
                    <td className="p-4 font-bold text-blue-600">{p.bloodGroup || 'Not specified'}</td>
                    <td className="p-4">
                      <StatusBadge status={p.userId?.status || 'active'} />
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

export default PatientManagement;
