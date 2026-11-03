import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';
import { FileText, Download, Pill, Stethoscope, Calendar, CheckCircle } from 'lucide-react';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/prescriptions');
      setPrescriptions(res.data?.data || []);
    } catch (err) {
      setError('Failed to load prescriptions list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const handleDownloadPdf = async (prescriptionId) => {
    try {
      const res = await api.get(`/prescriptions/${prescriptionId}/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription_${prescriptionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Prescription downloaded successfully!');
    } catch (err) {
      toast.error('Failed to download PDF prescription');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Prescriptions & Medical Records</h1>
        <p className="text-sm text-slate-500">Access doctors' prescriptions and prescribed medicines</p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching medical records..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchPrescriptions} />
      ) : prescriptions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Prescriptions Found"
          description="Prescriptions issued by your doctor after consultations will appear here."
        />
      ) : (
        <div className="space-y-6">
          {prescriptions.map((p) => (
            <div key={p._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Dr. {p.doctorId?.userId?.name || 'Doctor'}</h3>
                    <p className="text-xs text-purple-600 font-semibold">{p.doctorId?.specialization || 'Consultant'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDownloadPdf(p._id)}
                    className="py-2 px-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                </div>
              </div>

              {/* Diagnosis */}
              {p.diagnosis && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Diagnosis:
                  </span>
                  <p className="text-sm font-semibold text-slate-800">{p.diagnosis}</p>
                </div>
              )}

              {/* Prescribed Medicines */}
              {p.medicines && p.medicines.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-purple-600" /> Prescribed Medications
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {p.medicines.map((med, idx) => (
                      <div key={idx} className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100 flex flex-col justify-between">
                        <div>
                          <p className="font-bold text-purple-950 text-sm">{med.name}</p>
                          <p className="text-xs text-purple-800 mt-1 font-medium">Dosage: {med.dosage} • {med.frequency}</p>
                        </div>
                        <span className="text-xs text-purple-600 font-semibold mt-2 block">
                          Duration: {med.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advice */}
              {p.advice && (
                <p className="text-xs text-slate-600 italic bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                  <strong>Advice:</strong> {p.advice}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
