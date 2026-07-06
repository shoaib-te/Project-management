import React from 'react'

function EmployeeCard({ name, role, department, initials }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-w-[240px] flex-1 max-w-[320px]">
    {/* Upper Section with Initial Circle and Department Tag */}
    <div className="bg-slate-50/70 p-6 flex flex-col items-center justify-center relative min-h-[160px]">
      <span className="absolute top-4 left-4 bg-white px-2 py-1 rounded text-[11px] font-medium text-gray-500 border border-gray-100">
        {department}
      </span>
      <div className="w-16 h-16 rounded-full bg-[#eef0ff] flex items-center justify-center text-[#5d4eff] font-semibold text-lg">
        {initials}
      </div>
    </div>
    
    {/* Lower Section with Details */}
    <div className="p-5 bg-white border-t border-gray-50 flex-grow">
      <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
      <p className="text-xs text-gray-400 mt-0.5">{role}</p>
    </div>
  </div>
  )
}

export default EmployeeCard