import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import {
  Stethoscope, Calendar, Clock, ShieldCheck, Search, Bot,
  UserCheck, ArrowRight, HeartHandshake, Sparkles, Star, ChevronRight
} from 'lucide-react';

/* ── Animated counter hook ── */
const useCountUp = (target, duration = 1800, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

/* ── Intersection observer hook ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const Home = () => {
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0 });
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statsRef, statsInView] = useInView();
  const [featuresRef, featuresInView] = useInView();
  const [doctorsRef, doctorsInView] = useInView();

  const docCount  = useCountUp(stats.totalDoctors, 1600, statsInView);
  const patCount  = useCountUp(stats.totalPatients, 1800, statsInView);
  const appCount  = useCountUp(stats.totalAppointments, 1600, statsInView);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, doctorsRes] = await Promise.all([
          api.get('/admin/dashboard').catch(() => ({ data: { data: {} } })),
          api.get('/doctors?limit=3').catch(() => ({ data: { data: [] } })),
        ]);
        if (statsRes.data?.data) {
          const d = statsRes.data.data;
          setStats({
            totalDoctors: d.usersByRole?.find(u => u._id === 'doctor')?.count || 12,
            totalPatients: d.usersByRole?.find(u => u._id === 'patient')?.count || 450,
            totalAppointments: d.todaysAppointments || 85,
          });
        }
        setFeaturedDoctors(doctorsRes.data?.data || []);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-20 pb-20">

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8">
        {/* Animated floating orbs */}
        <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full bg-teal-500/15 blur-3xl animate-orb-drift pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-60px] w-[360px] h-[360px] rounded-full bg-emerald-500/15 blur-3xl animate-orb-drift pointer-events-none" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[40%] left-[50%] w-[200px] h-[200px] rounded-full bg-indigo-500/10 blur-2xl animate-float-slow pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left — Text */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider animate-fade-in-down">
                <Sparkles className="w-4 h-4 text-teal-400 animate-spin-slow" />
                Smart Healthcare Platform
              </div>
              <Link
                to="/doctor/login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 hover:text-white hover:bg-indigo-500/30 text-xs font-semibold transition"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                Doctor Portal →
              </Link>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight animate-fade-in-up delay-100">
              Book Doctor Appointments{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
                Instantly &amp; Hassle-Free
              </span>
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed animate-fade-in-up delay-200">
              Connect with top specialists, track real-time consultation queues, view medical records, and receive AI-driven health recommendations — all in one place.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 animate-fade-in-up delay-300">
              <Link
                to="/doctors"
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-teal-500/30 flex items-center gap-2 transition-all hover:scale-105 hover:shadow-teal-500/50"
              >
                <Search className="w-5 h-5" /> Find a Doctor
              </Link>
              <Link
                to="/register"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-7 py-3.5 rounded-xl backdrop-blur-sm transition hover:scale-105"
              >
                Register as Patient
              </Link>
              <Link
                to="/doctor/login"
                className="bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-400/30 font-semibold px-5 py-3.5 rounded-xl backdrop-blur-sm transition hover:scale-105 flex items-center gap-2"
              >
                <Stethoscope className="w-4 h-4 text-indigo-300" /> Doctor Sign In
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 pt-1 animate-fade-in-up delay-400">
              {['100% Secure', 'HIPAA Compliant', 'AI-Powered', 'Verified Doctors'].map((badge) => (
                <span key={badge} className="text-xs text-teal-300/80 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Hero Card */}
          <div className="relative flex justify-center animate-fade-in-right delay-200">
            {/* Background glow card */}
            <div className="absolute inset-0 bg-blue-500/10 rounded-3xl blur-2xl scale-105" />
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4 relative animate-float-slow">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Instant Scheduling</h3>
                  <p className="text-xs text-slate-300">Choose your preferred time slot</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <span className="text-slate-400 block mb-1">Queue Status</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse inline-block" />
                    Live Updating
                  </span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <span className="text-slate-400 block mb-1">Prescriptions</span>
                  <span className="font-semibold text-blue-300">PDF Download</span>
                </div>
              </div>

              {/* Doctor preview chips */}
              <div className="space-y-2">
                {['Cardiologist', 'Orthopedist', 'Dermatologist'].map((spec, i) => (
                  <div
                    key={spec}
                    className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-xl border border-white/10 text-xs hover:bg-white/10 transition"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <span className="text-slate-300 font-medium">{spec}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-emerald-400" /> Available
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl flex items-center justify-between text-white shadow-lg">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <span className="text-sm font-semibold">AI Symptom Assistant</span>
                </div>
                <Link to="/patient/ai-assistant" className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg transition">
                  Try Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Stethoscope className="w-8 h-8" />, value: docCount, label: 'Verified Doctors', color: 'bg-blue-50 text-blue-600', delay: 'delay-100' },
            { icon: <UserCheck className="w-8 h-8" />, value: patCount, label: 'Satisfied Patients', color: 'bg-emerald-50 text-emerald-600', delay: 'delay-200' },
            { icon: <Calendar className="w-8 h-8" />, value: appCount, label: 'Appointments Today', color: 'bg-indigo-50 text-indigo-600', delay: 'delay-300' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${statsInView ? `animate-fade-in-up ${stat.delay}` : 'opacity-0'}`}
            >
              <div className={`p-4 rounded-xl ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900">{stat.value}+</p>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section ref={featuresRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-2xl mx-auto mb-12 ${featuresInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl font-bold text-slate-900">Why Choose MediCare?</h2>
          <p className="text-slate-600 mt-2">Comprehensive digital health tools designed for patients, doctors, and hospital administrators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Clock className="w-6 h-6" />,
              color: 'bg-blue-100 text-blue-600',
              title: 'Real-Time Queue Management',
              desc: 'Never wait blindly in waiting rooms. Track your queue position and turn live on your phone.',
              delay: 'delay-100',
            },
            {
              icon: <Bot className="w-6 h-6" />,
              color: 'bg-indigo-100 text-indigo-600',
              title: 'AI Symptom Assistant',
              desc: 'Describe your symptoms in natural language and receive guided specialist suggestions and triage advice.',
              delay: 'delay-200',
            },
            {
              icon: <ShieldCheck className="w-6 h-6" />,
              color: 'bg-teal-100 text-teal-600',
              title: 'Digital Prescriptions & Records',
              desc: 'Access your medical history, diagnosis records, and downloadable PDF prescriptions anytime.',
              delay: 'delay-300',
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className={`group bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 ${featuresInView ? `animate-fade-in-up ${feat.delay}` : 'opacity-0'}`}
            >
              <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{feat.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              <ChevronRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-600 mt-2">Get started in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[33%] right-[33%] h-0.5 bg-blue-200" />
            {[
              { step: '01', title: 'Create Account', desc: 'Register as a patient in under 2 minutes', icon: <UserCheck className="w-6 h-6" /> },
              { step: '02', title: 'Find a Doctor', desc: 'Browse specialists by specialty, rating & availability', icon: <Search className="w-6 h-6" /> },
              { step: '03', title: 'Book & Track', desc: 'Confirm your appointment and track queue status in real-time', icon: <Calendar className="w-6 h-6" /> },
            ].map((step, i) => (
              <div key={step.step} className={`flex flex-col items-center text-center gap-4 animate-fade-in-up delay-${(i + 1) * 100}`}>
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                    {step.icon}
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                <p className="text-sm text-slate-600 max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DOCTORS ── */}
      <section ref={doctorsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div className={doctorsInView ? 'animate-fade-in-left' : 'opacity-0'}>
            <h2 className="text-2xl font-bold text-slate-900">Top Specialists</h2>
            <p className="text-sm text-slate-500">Book appointments with approved healthcare experts</p>
          </div>
          <Link to="/doctors" className={`text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 ${doctorsInView ? 'animate-fade-in-right' : 'opacity-0'}`}>
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {featuredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDoctors.map((doc, i) => (
              <div
                key={doc._id}
                className={`group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${doctorsInView ? `animate-fade-in-up delay-${(i + 1) * 150}` : 'opacity-0'}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-xl group-hover:scale-110 transition-transform">
                    {doc.userId?.name ? doc.userId.name.charAt(0) : 'D'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Dr. {doc.userId?.name || 'Specialist'}</h4>
                    <p className="text-xs text-blue-600 font-semibold">{doc.specialization}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-slate-500">{doc.experience || 5}+ yrs</p>
                      {doc.averageRating > 0 && (
                        <span className="text-xs text-amber-500 flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400" /> {doc.averageRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                  <span className="text-xs text-slate-500">Fee: <strong className="text-slate-800 font-bold text-sm">₹{doc.consultationFee}</strong></span>
                  <Link
                    to={`/patient/doctors?selected=${doc._id}`}
                    className="text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 px-4 py-2 rounded-xl transition shadow-sm hover:shadow-teal-500/20 flex items-center gap-1"
                  >
                    Book Slot <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-3 ${doctorsInView ? 'animate-scale-in' : 'opacity-0'}`}>
            <div className="w-14 h-14 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center mx-auto">
              <Stethoscope className="w-7 h-7" />
            </div>
            <p className="text-slate-600 text-sm">Browse our directory to find available specialists.</p>
            <Link to="/doctors" className="inline-block mt-2 bg-teal-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-teal-500 transition">
              Search Doctors Directory
            </Link>
          </div>
        )}
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-slate-900 via-teal-900 to-indigo-950 rounded-3xl p-10 text-white text-center overflow-hidden border border-teal-500/20 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(20,184,166,0.15),transparent_60%)]" />
          <div className="absolute top-[-40px] right-[-40px] w-56 h-56 rounded-full bg-teal-400/10 blur-2xl animate-float-slow" />
          <h2 className="text-3xl font-extrabold mb-3 relative z-10 animate-fade-in-up">
            Your Health, Simplified
          </h2>
          <p className="text-teal-100 text-sm mb-6 max-w-lg mx-auto relative z-10 animate-fade-in-up delay-100">
            Join thousands of patients &amp; healthcare providers who manage appointments seamlessly with MediCare.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10 animate-fade-in-up delay-200">
            <Link
              to="/register"
              className="bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-bold px-7 py-3 rounded-xl shadow-lg transition hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/doctor/login"
              className="bg-indigo-600/40 hover:bg-indigo-600/60 text-white border border-indigo-400/40 font-bold px-7 py-3 rounded-xl transition hover:scale-105 flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4 text-indigo-300" />
              Doctor Portal Access
            </Link>
            <Link
              to="/doctors"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-7 py-3 rounded-xl transition hover:scale-105"
            >
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
