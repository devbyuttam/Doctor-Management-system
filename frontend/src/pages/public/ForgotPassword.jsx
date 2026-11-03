import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [emailSent, setEmailSent] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: data.email }).catch(() => {});
      setEmailSent(data.email);
      setSubmitted(true);
      toast.success('Password reset instructions sent!');
    } catch (err) {
      toast.error('Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50/20 to-indigo-50/30">
      <div className="absolute top-[-60px] left-[-60px] w-96 h-96 rounded-full bg-teal-300/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-80 h-80 rounded-full bg-indigo-300/15 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-scale-in">
        <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-indigo-700 p-8 text-white text-center relative">
            <div className="w-14 h-14 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/20">
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-black">Reset Password</h2>
            <p className="text-xs text-teal-100 mt-1">We'll help you regain access to your medical portal</p>
          </div>

          <div className="p-8">
            {submitted ? (
              <div className="text-center space-y-4 py-4 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Check Your Inbox</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We've dispatched password recovery guidance to <strong className="text-slate-800">{emailSent}</strong>.
                </p>
                <div className="pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                    Account Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      {...register('email', {
                        required: 'Email address is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition ${
                        errors.email ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-rose-500 text-xs mt-1.5">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? 'Sending Request...' : 'Send Reset Instructions'}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-600 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
              <span>Protected by Hospital Security Protocol</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
