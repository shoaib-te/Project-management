import React from 'react'
import { Pencil, Trash2 } from 'lucide-react' // Optional: Install lucide-react for clean icons

function EmployeeCard({ name, role, department,position ,isDeleted, initials, onEdit, onDelete }) {
  return (
    /* Added "group" class to the parent div to trigger child hover states */
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-w-[240px] flex-1 max-w-[320px] relative">
      
      {/* Action Buttons: Hidden by default (opacity-0), visible on hover (group-hover:opacity-100) */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
          onClick={onEdit}
          className="p-1.5 bg-gray-100 hover:bg-gray-50 border border-gray-100 text-gray-600 rounded-md shadow-sm transition-colors"
          title="Edit"
        >
          <Pencil size={14} />
        </button>
        <button 
          onClick={onDelete}
          className="p-1.5 bg-gray-100 hover:bg-red-50 border border-gray-100 text-red-500 rounded-md shadow-sm transition-colors"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Upper Section with Initial Circle and Department Tag */}
      <div className="bg-slate-50/70 p-6 flex flex-col items-center  justify-center   relative min-h-[160px]">
        <span className="absolute top-4 left-4 bg-white px-2 py-1 rounded text-[11px] font-medium text-gray-500 border border-gray-100">
          {department}
        </span>
       { isDeleted && <span className="absolute top-4 left-26 bg-red-200 px-2 py-1 rounded text-[11px] font-medium text-gray-500 ">
          delete
        </span>}
        <div className="w-16 h-16 rounded-full bg-[#eef0ff] flex items-center justify-center text-[#5d4eff] font-semibold text-lg">
          {initials}
        </div>
      </div>
      
      {/* Lower Section with Details */}
      <div className="p-5 bg-white border-t border-gray-50 flex-grow">
        <h3 className="font-semibold text-gray-900 text-sm">{name}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{position}</p>
      </div>
    </div>
  )
}

export default EmployeeCard
