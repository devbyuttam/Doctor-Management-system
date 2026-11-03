import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Pill, Plus, Trash2, Save, FileText, Check } from 'lucide-react';

const DoctorPrescriptions = () => {
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(location.state?.appointmentId || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '1 tablet after food', frequency: 'Twice daily', duration: '5 days', instructions: '' }
  ]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments');
        const valid = (res.data?.data || []).filter(a => a.status === 'in-consultation' || a.status === 'scheduled' || a.status === 'completed');
        setAppointments(valid);
        if (!selectedAppointmentId && valid.length > 0) {
          setSelectedAppointmentId(valid[0]._id);
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '1 tablet after food', frequency: 'Twice daily', duration: '5 days', instructions: '' }
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointmentId) {
      toast.error('Please select an appointment');
      return;
    }
    const app = appointments.find(a => a._id === selectedAppointmentId);
    if (!app) {
      toast.error('Invalid appointment selected');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/prescriptions', {
        appointmentId: app._id,
        patientId: app.patientId?._id,
        doctorId: app.doctorId?._id,
        diagnosis,
        medicines: medicines.filter(m => m.name.trim() !== ''),
        advice,
      });
      toast.success('Prescription created and sent to patient!');
      setDiagnosis('');
      setAdvice('');
      setMedicines([{ name: '', dosage: '1 tablet after food', frequency: 'Twice daily', duration: '5 days', instructions: '' }]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to issue prescription');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading doctor dashboard..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Issue Digital Prescription</h1>
        <p className="text-sm text-slate-500">Prescribe medicines, dosage instructions, and consultation advice</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Select Patient & Appointment
          </label>
          <select
            value={selectedAppointmentId}
            onChange={(e) => setSelectedAppointmentId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {appointments.map((a) => (
              <option key={a._id} value={a._id}>
                Patient: {a.patientId?.userId?.name || 'Patient'} ({new Date(a.date).toLocaleDateString()} - {a.startTime}) — Token #{a.tokenNumber}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Clinical Diagnosis
          </label>
          <input
            type="text"
            placeholder="e.g. Acute Upper Respiratory Tract Infection, Mild Fever"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Medicines list */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4 text-purple-600" /> Prescribed Medications
            </h3>
            <button
              type="button"
              onClick={handleAddMedicine}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Medicine
            </button>
          </div>

          {medicines.map((med, idx) => (
            <div key={idx} className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3 relative">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-purple-900">Medicine #{idx + 1}</span>
                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(idx)}
                    className="text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Medicine Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Paracetamol 650mg"
                    value={med.name}
                    onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 tab after meal"
                    value={med.dosage}
                    onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 days"
                    value={med.duration}
                    onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Doctor Advice / Dietary Instructions
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Drink plenty of warm fluids, rest for 3 days, follow up if fever persists..."
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-purple-500/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {submitting ? 'Creating Prescription...' : 'Issue Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorPrescriptions;
