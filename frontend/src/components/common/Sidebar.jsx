import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard, Calendar, User, Search, FileText,
  Bot, Users, Settings, Clock, LogOut, Stethoscope,
  HeartPulse, ChevronLeft, ChevronRight, ShieldCheck, BadgeCheck
} from 'lucide-react';

const ROLE_META = {
  patient: {
    label: 'Patient Portal',
    gradient: 'from-teal-600 to-emerald-600',
    dot: 'bg-teal-400',
    badge: 'text-teal-300',
    active: 'bg-teal-600/90 text-white shadow-md shadow-teal-900/40 font-semibold',
    hover: 'hover:bg-white/10 text-slate-300 hover:text-white',
    avatarBg: 'bg-teal-500/20 border-teal-500/30 text-teal-300',
  },
  doctor: {
    label: 'Doctor Portal',
    gradient: 'from-indigo-600 to-blue-600',
    dot: 'bg-indigo-400',
    badge: 'text-indigo-300',
    active: 'bg-indigo-600/90 text-white shadow-md shadow-indigo-900/40 font-semibold',
    hover: 'hover:bg-white/10 text-slate-300 hover:text-white',
    avatarBg: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300',
  },
  admin: {
    label: 'Admin Portal',
    gradient: 'from-violet-600 to-purple-600',
    dot: 'bg-violet-400',
    badge: 'text-violet-300',
    active: 'bg-violet-600/90 text-white shadow-md shadow-violet-900/40 font-semibold',
    hover: 'hover:bg-white/10 text-slate-300 hover:text-white',
    avatarBg: 'bg-violet-500/20 border-violet-500/30 text-violet-300',
  },
  receptionist: {
    label: 'Receptionist Portal',
    gradient: 'from-amber-600 to-orange-600',
    dot: 'bg-amber-400',
    badge: 'text-amber-300',
    active: 'bg-amber-600/90 text-white shadow-md shadow-amber-900/40 font-semibold',
    hover: 'hover:bg-white/10 text-slate-300 hover:text-white',
    avatarBg: 'bg-amber-500/20 border-amber-500/30 text-amber-300',
  },
};

const MENU_ITEMS = {
  patient: [
    { path: '/patient/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/patient/doctors', label: 'Find & Book Doctor', icon: Search },
    { path: '/patient/appointments', label: 'My Appointments', icon: Calendar },
    { path: '/patient/prescriptions', label: 'Prescriptions & Records', icon: FileText },
    { path: '/patient/ai-assistant', label: 'AI Health Assistant', icon: Bot },
    { path: '/patient/profile', label: 'My Profile', icon: User },
  ],
  doctor: [
    { path: '/doctor/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/doctor/appointments', label: 'Appointments & Queue', icon: Calendar },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: FileText },
    { path: '/doctor/settings', label: 'Profile & Schedule', icon: Settings },
  ],
  admin: [
    { path: '/admin/dashboard', label: 'Analytics & Stats', icon: LayoutDashboard },
    { path: '/admin/doctors', label: 'Doctor Management', icon: Stethoscope },
    { path: '/admin/patients', label: 'Patient Registry', icon: Users },
  ],
  receptionist: [
    { path: '/receptionist/dashboard', label: 'Queue & Walk-Ins', icon: Clock },
  ],
};

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const role = user?.role || 'patient';
  const meta = ROLE_META[role] || ROLE_META.patient;
  const links = MENU_ITEMS[role] || MENU_ITEMS.patient;
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <aside
      className={`${collapsed ? 'w-[68px]' : 'w-64'} bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col justify-between flex-shrink-0 transition-all duration-300 relative`}
    >
      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(v => !v)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 text-slate-300 hover:bg-teal-600 hover:text-white hover:border-teal-500 flex items-center justify-center shadow-md transition z-10"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ── User Profile Card ── */}
        <div className={`m-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 ${collapsed ? 'items-center justify-center' : ''} flex items-center gap-3`}>
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 ${meta.avatarBg} border-opacity-50`}
          >
            {initials}
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate">{user?.name || 'User'}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                <span className={`text-xs font-semibold capitalize ${meta.badge}`}>
                  {meta.label}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className={`flex-1 px-2 space-y-1 mt-1 ${collapsed ? 'items-center' : ''}`}>
          {!collapsed && (
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
              Navigation
            </p>
          )}
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                    isActive ? meta.active : meta.hover
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* ── Bottom Section ── */}
        <div className="px-2 pb-4 space-y-1 mt-2 border-t border-slate-800 pt-3">
          {/* Security badge */}
          {!collapsed && (
            <div className="mx-1 mb-3 px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/30 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-emerald-400">Secure Session</p>
                <p className="text-[10px] text-slate-500">256-bit SSL encrypted</p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign Out' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 transition ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="w-4.5 h-4.5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
