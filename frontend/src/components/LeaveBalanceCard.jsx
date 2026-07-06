import React from 'react'

function LeaveBalanceCard({ title, count, icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex justify-between items-start min-w-[240px] flex-1">
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-gray-400 tracking-wide">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-gray-900">{count}</span>
        <span className="text-xs font-medium text-gray-400">taken</span>
      </div>
    </div>
    <div className="text-slate-400 bg-slate-50 p-2 rounded-lg">
      <Icon size={20} strokeWidth={1.5} />
    </div>
  </div>

  )
}

export default LeaveBalanceCard