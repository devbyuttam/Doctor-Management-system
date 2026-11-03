import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  Stethoscope, LogOut, LayoutDashboard, ChevronDown,
  ShieldCheck, User, Settings, HeartPulse, Menu, X
} from 'lucide-react';

const ROLE_META = {
  patient: { label: 'Patient', color: 'text-teal-600 bg-teal-50 border-teal-200', dot: 'bg-teal-500' },
  doctor: { label: 'Doctor', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', dot: 'bg-indigo-500' },
  admin: { label: 'Admin', color: 'text-violet-600 bg-violet-50 border-violet-200', dot: 'bg-violet-500' },
  receptionist: { label: 'Receptionist', color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
};

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return `/${user.role}/dashboard`;
  };

  const roleMeta = user ? (ROLE_META[user.role] || ROLE_META.patient) : null;
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* ── Brand ── */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-400/30">
            <HeartPulse className="w-6 h-6" strokeWidth={2} />
          </div>
          <div>
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">MediCare</span>
            <span className="text-xs font-semibold text-teal-600 block -mt-1">Healthcare Portal</span>
          </div>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-2">
          <Link
            to="/doctors"
            className="text-sm font-medium text-slate-600 hover:text-teal-600 px-3 py-2 rounded-xl hover:bg-teal-50 transition"
          >
            Find Doctors
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <Link
                to={getDashboardLink()}
                className="flex items-center gap-1.5 text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-2 rounded-xl transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-slate-50 transition"
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${roleMeta?.dot === 'bg-teal-500' ? 'bg-teal-100 text-teal-700' : roleMeta?.dot === 'bg-indigo-500' ? 'bg-indigo-100 text-indigo-700' : 'bg-violet-100 text-violet-700'}`}>
                    {initials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name}</p>
                    <p className={`text-[10px] font-medium capitalize ${roleMeta?.dot === 'bg-teal-500' ? 'text-teal-600' : roleMeta?.dot === 'bg-indigo-500' ? 'text-indigo-600' : 'text-violet-600'}`}>
                      {roleMeta?.label}
                    </p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 py-1.5 animate-scale-in">
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold mt-1 px-2 py-0.5 rounded-full border ${roleMeta?.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${roleMeta?.dot}`} />
                        {roleMeta?.label} Portal
                      </span>
                    </div>
                    <Link
                      to={getDashboardLink()}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>
                    <Link
                      to={`/${user?.role}/settings`}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Settings
                    </Link>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/doctor/login"
                className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-3 py-2 rounded-xl transition flex items-center gap-1.5 hover:scale-[1.02]"
              >
                <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                Doctor Portal
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-700 hover:text-teal-600 px-3.5 py-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 px-4 py-2 rounded-xl shadow-md shadow-teal-400/30 transition hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* ── Mobile hamburger ── */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-2 animate-slide-down shadow-lg">
          <Link to="/doctors" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition">
            Find Doctors
          </Link>
          {isAuthenticated ? (
            <>
              <Link to={getDashboardLink()} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-teal-700 bg-teal-50 transition">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <div className="px-3 py-2 flex items-center gap-2 text-xs text-slate-500">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">{initials}</div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{user?.name}</p>
                  <p className="text-slate-400 capitalize">{roleMeta?.label}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/doctor/login" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 transition">
                <Stethoscope className="w-4 h-4 text-indigo-600" />
                Doctor Portal Login
              </Link>
              <Link to="/login" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
                Sign In
              </Link>
              <Link to="/register" className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 shadow transition hover:scale-[1.01]">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
