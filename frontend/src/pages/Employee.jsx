import React, { useState } from 'react';
import { Plus, Search, ChevronDown } from 'lucide-react';
import EmployeeCard from '../components/EmployeeCard';



export default function Employee() {
  const [searchTerm, setSearchTerm] = useState('');

  const employees = [
    { name: 'David Michael', role: 'Associate Business Support', department: 'IT Support', initials: 'DM' },
    { name: 'Alex Matthew', role: 'Software Developer', department: 'Engineering', initials: 'AM' },
    { name: 'John Doe', role: 'Senior Software Developer', department: 'Engineering', initials: 'JD' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Block */}
        <div className="flex justify-between items-start gap-4">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-950">Employees</h1>
            <p className="text-sm text-gray-500">Manage your team members</p>
          </header>
          
          <button className="flex items-center gap-1.5 bg-[#5d4eff] hover:bg-[#4c3dec] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
            <Plus size={16} strokeWidth={2.5} />
            Add Employee
          </button>
        </div>

        {/* Filter Controls Block */}
        <div className="flex gap-3">
          {/* Search Input wrapper */}
          <div className="relative flex-grow max-w-3xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5d4eff] transition-colors"
            />
          </div>

          {/* Department Select Dropdown Action */}
          <button className="flex items-center justify-between gap-8 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-sm">
            <span>All Departments</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Dynamic Responsive Employee Grid */}
        <div className="flex flex-wrap gap-5 pt-2">
          {employees.map((emp, index) => (
            <EmployeeCard
              key={index}
              name={emp.name}
              role={emp.role}
              department={emp.department}
              initials={emp.initials}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
