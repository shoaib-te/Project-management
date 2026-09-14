import React from 'react';

function Dashboardcard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex justify-between items-start min-w-[220px] flex-1">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500 tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="text-slate-700 p-1">
        <Icon size={28} strokeWidth={1.5} />
      </div>
    </div>
  );
}

export default Dashboardcard;
