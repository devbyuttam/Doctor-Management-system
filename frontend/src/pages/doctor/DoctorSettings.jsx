import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Settings, Save, Clock, DollarSign, MapPin, Award, Check } from 'lucide-react';

const DoctorSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    specialization: 'General',
    qualifications: 'MBBS',
    experience: 5,
    consultationFee: 500,
    about: '',
    clinic: '',
    location: '',
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [availability, setAvailability] = useState(
    daysOfWeek.map((day) => ({
      day,
      isAvailable: true,
      startTime: '09:00',
      endTime: '17:00',
      slotDurationMinutes: 30,
    }))
  );

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const res = await api.get('/doctors/me');
        const doc = res.data?.data;
        if (doc) {
          setProfile({
            specialization: doc.specialization || 'General',
            qualifications: doc.qualifications || 'MBBS',
            experience: doc.experience || 5,
            consultationFee: doc.consultationFee || 500,
            about: doc.about || '',
            clinic: doc.clinic || '',
            location: doc.location || '',
          });
          if (doc.availability && doc.availability.length > 0) {
            setAvailability(doc.availability);
          }
        }
      } catch (err) {
        // use default
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Promise.all([
        api.put('/doctors/profile', profile),
        api.put('/doctors/availability', { availability })
      ]);
      toast.success('Doctor profile & schedule updated successfully!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile settings..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Doctor Profile & Availability Settings</h1>
        <p className="text-sm text-slate-500">Configure consultation fee, qualifications, and slot duration schedule</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" /> Professional Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={profile.specialization}
                onChange={handleProfileChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Qualifications
              </label>
              <input
                type="text"
                name="qualifications"
                value={profile.qualifications}
                onChange={handleProfileChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Consultation Fee (₹)
              </label>
              <input
                type="number"
                name="consultationFee"
                value={profile.consultationFee}
                onChange={handleProfileChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Clinic / Hospital Name
              </label>
              <input
                type="text"
                name="clinic"
                placeholder="City Hospital"
                value={profile.clinic}
                onChange={handleProfileChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Location / City
              </label>
              <input
                type="text"
                name="location"
                placeholder="Downtown Health District"
                value={profile.location}
                onChange={handleProfileChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Weekly Schedule & Slots */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" /> Weekly Availability & Slot Duration
          </h3>

          <div className="space-y-3">
            {availability.map((avail, idx) => (
              <div key={avail.day} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-40">
                  <input
                    type="checkbox"
                    checked={avail.isAvailable}
                    onChange={(e) => handleAvailabilityChange(idx, 'isAvailable', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="font-semibold text-sm text-slate-800">{avail.day}</span>
                </div>

                {avail.isAvailable ? (
                  <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
                    <div>
                      <span className="block text-[10px] text-slate-500 font-semibold mb-0.5">Start</span>
                      <input
                        type="time"
                        value={avail.startTime}
                        onChange={(e) => handleAvailabilityChange(idx, 'startTime', e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500 font-semibold mb-0.5">End</span>
                      <input
                        type="time"
                        value={avail.endTime}
                        onChange={(e) => handleAvailabilityChange(idx, 'endTime', e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <span className="block text-[10px] text-slate-500 font-semibold mb-0.5">Slot (mins)</span>
                      <input
                        type="number"
                        value={avail.slotDurationMinutes}
                        onChange={(e) => handleAvailabilityChange(idx, 'slotDurationMinutes', parseInt(e.target.value, 10))}
                        className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:ring-2 focus:ring-blue-500 w-20"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-rose-500 font-medium">Off Day</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="py-3 px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorSettings;
