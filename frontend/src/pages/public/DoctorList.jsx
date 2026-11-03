import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import toast from 'react-hot-toast';
import { Search, Filter, Stethoscope, MapPin, Calendar, Clock, DollarSign, X, Check } from 'lucide-react';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [specialization, setSpecialization] = useState('');
  const [gender, setGender] = useState('');
  const [maxFee, setMaxFee] = useState('');
  
  // Booking modal state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/doctors?limit=20';
      if (specialization) url += `&specialization=${encodeURIComponent(specialization)}`;
      if (gender) url += `&gender=${encodeURIComponent(gender)}`;
      if (maxFee) url += `&maxFee=${encodeURIComponent(maxFee)}`;

      const res = await api.get(url);
      setDoctors(res.data?.data || []);
    } catch (err) {
      setError('Failed to fetch doctors list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization, gender, maxFee]);

  const handleOpenBooking = async (doctor) => {
    if (!isAuthenticated) {
      toast.error('Please log in as a patient to book an appointment');
      navigate('/login');
      return;
    }
    if (role !== 'patient') {
      toast.error('Only patient accounts can book appointments');
      return;
    }
    setSelectedDoctor(doctor);
    fetchSlots(doctor._id, bookingDate);
  };

  const fetchSlots = async (doctorId, date) => {
    setSlotsLoading(true);
    try {
      const res = await api.get(`/doctors/${doctorId}/slots?date=${date}`);
      setAvailableSlots(res.data?.data || []);
      setSelectedSlot('');
    } catch (err) {
      toast.error('Failed to load doctor availability slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setBookingDate(newDate);
    if (selectedDoctor) {
      fetchSlots(selectedDoctor._id, newDate);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/appointments', {
        doctorId: selectedDoctor._id,
        date: bookingDate,
        startTime: selectedSlot,
        reason: reason || 'General Consultation',
      });
      toast.success('Appointment booked successfully!');
      setSelectedDoctor(null);
      navigate('/patient/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-slate-900">Find a Specialist</h1>
        <p className="text-slate-500 text-sm mt-1">Browse verified doctors, check available slots, and book instantly.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center animate-fade-in-down delay-100">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Specialization</label>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Specializations</option>
            <option value="General">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Neurology">Neurology</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Max Consultation Fee (₹)</label>
          <input
            type="number"
            placeholder="e.g. 1000"
            value={maxFee}
            onChange={(e) => setMaxFee(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => { setSpecialization(''); setGender(''); setMaxFee(''); }}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Doctor Cards List */}
      {loading ? (
        <LoadingSpinner message="Searching for available doctors..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchDoctors} />
      ) : doctors.length === 0 ? (
        <EmptyState icon={Stethoscope} title="No doctors found" description="Try clearing your search filters." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc, index) => (
            <div
              key={doc._id}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-2xl border border-blue-200 flex-shrink-0">
                    {doc.userId?.name ? doc.userId.name.charAt(0) : 'D'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Dr. {doc.userId?.name}</h3>
                    <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block mt-0.5">
                      {doc.specialization}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{doc.qualifications || 'MBBS'} • {doc.experience || 5} yrs exp</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  {doc.clinic && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{doc.clinic}, {doc.location || 'Central City'}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <span>Consultation Fee: <strong className="text-slate-900 text-sm font-bold">₹{doc.consultationFee}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <StatusBadge status={doc.verificationStatus} />
                <button
                  onClick={() => handleOpenBooking(doc)}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Slot Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scale-in">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Book Appointment</h3>
                <p className="text-xs text-blue-100">Dr. {selectedDoctor.userId?.name} ({selectedDoctor.specialization})</p>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingDate}
                  onChange={handleDateChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Available Time Slots
                </label>
                {slotsLoading ? (
                  <LoadingSpinner message="Checking doctor schedule..." />
                ) : availableSlots.length === 0 ? (
                  <p className="text-xs text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100">
                    No time slots available for this date. Please pick another date.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                          selectedSlot === slot
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason for Visit
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your health concern or symptoms..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !selectedSlot}
                  className="py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {submitting ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;
