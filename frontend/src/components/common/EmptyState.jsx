import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({ icon: Icon = FolderOpen, title = 'No data found', description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 my-6">
      <div className="p-3 bg-white rounded-xl shadow-sm mb-3 text-slate-400">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-sm mt-1 mb-4">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
