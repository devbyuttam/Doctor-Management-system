import React from 'react';

const statusStyles = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  'in-consultation': 'bg-amber-50 text-amber-700 border-amber-200',
  waiting: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
};

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toLowerCase();
  const style = statusStyles[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border inline-flex items-center capitalize ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
