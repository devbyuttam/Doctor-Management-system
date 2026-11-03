import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { User, Phone, Heart, Activity, AlertCircle, Save } from 'lucide-react';

const PatientProfile = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bloodGroup: '',
    dateOfBirth: '',
    gender: 'other',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: '',
  });

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await api.get('/patients/me');
        const p = res.data?.data || {};
        setFormData({
          bloodGroup: p.bloodGroup || '',
          dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
          gender: p.gender || 'other',
          address: p.address || '',
          emergencyContact: p.emergencyContact || '',
          medicalHistory: Array.isArray(p.medicalHistory) ? p.medicalHistory.join(', ') : (p.medicalHistory || ''),
          allergies: Array.isArray(p.allergies) ? p.allergies.join(', ') : (p.allergies || ''),
        });
      } catch (err) {
        // use default empty form
      } finally {
        setLoading(false);
      }
    };
    fetchPatientData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/patients/profile', {
        ...formData,
        medicalHistory: formData.medicalHistory ? formData.medicalHistory.split(',').map(s => s.trim()) : [],
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
      });
      toast.success('Medical profile updated successfully');
      refreshUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading patient profile..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Medical Profile Settings</h1>
        <p className="text-sm text-slate-500">Keep your health profile updated for better doctor consultations</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl border border-blue-200">
            {user?.name ? user.name.charAt(0) : 'P'}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.email} • {user?.phone || 'No phone set'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Emergency Contact Phone
              </label>
              <input
                type="text"
                name="emergencyContact"
                placeholder="+1 (555) 999-0000"
                value={formData.emergencyContact}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Residential Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="123 Health Ave, Suite 4"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Known Allergies (comma separated)
            </label>
            <input
              type="text"
              name="allergies"
              placeholder="e.g. Penicillin, Dust, Peanuts"
              value={formData.allergies}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Pre-existing Medical History (comma separated)
            </label>
            <textarea
              rows={3}
              name="medicalHistory"
              placeholder="e.g. Asthma, Hypertension, Diabetes Type 2"
              value={formData.medicalHistory}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientProfile;
