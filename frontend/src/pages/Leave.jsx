import React, { useState } from 'react'

import { Check, X } from 'lucide-react';
// Change this line at the top of your file:
import { Thermometer, Umbrella, Plus } from 'lucide-react';

import LeaveBalanceCard from '../components/LeaveBalanceCard';
function Leave() {
  const data = { role: '' };
   const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employee: 'David Michael', type: 'ANNUAL', dates: 'Mar 27 - Mar 29, 2026', reason: 'Out for a trip', status: 'APPROVED' },
    { id: 2, employee: 'Alex Matthew', type: 'CASUAL', dates: 'Mar 23 - Mar 24, 2026', reason: 'Going For Vacations', status: 'REJECTED' },
    { id: 3, employee: 'John Doe', type: 'CASUAL', dates: 'Mar 27 - Mar 28, 2026', reason: 'Going to visit a temple', status: 'PENDING' },
    { id: 4, employee: 'David Michael', type: 'SICK', dates: 'Mar 15 - Mar 16, 2026', reason: 'I had a fracture on leg', status: 'APPROVED' },
  ]);

   // Handler functions to process pending requests dynamically
  const handleAction = (id, newStatus) => {
    setLeaveRequests(prev =>
      prev.map(request => (request.id === id ? { ...request, status: newStatus } : request))
    );
  };


  // Sample summary metrics for employee view
  const summaryMetrics = [
    { title: 'Sick Leave', count: 1, icon: Thermometer },
    { title: 'Casual Leave', count: 0, icon: Umbrella },
    { title: 'Annual Leave', count: 1, icon: Plus },
  ];

  const leaveHistory = [
    { type: 'ANNUAL', dates: 'Mar 27 — Mar 29, 2026', reason: 'Out for a trip', status: 'APPROVED' },
    { type: 'CASUAL', dates: 'Mar 23 — Mar 24, 2026', reason: 'Going For Vacations', status: 'REJECTED' },
    { type: 'CASUAL', dates: 'Mar 27 — Mar 28, 2026', reason: 'Going to visit a temple', status: 'PENDING' },
    { type: 'SICK', dates: 'Mar 15 — Mar 16, 2026', reason: 'I had a fracture on leg', status: 'APPROVED' },
  ];

  const typeStyles = {
    ANNUAL: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    CASUAL: 'bg-slate-100 text-slate-600 border border-slate-200',
    SICK: 'bg-sky-50 text-sky-600 border border-sky-100',
  };

  const statusStyles = {
    APPROVED: 'bg-emerald-50 text-emerald-600',
    REJECTED: 'bg-rose-50 text-rose-600',
    PENDING: 'bg-amber-50 text-amber-600',
  };

  if(data.role === "admin") {
    return (
      <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title Information section */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-950">Leave Management</h1>
          <p className="text-sm text-gray-500">Manage leave applications</p>
        </header>

        {/* Outer Data Card Wrapper */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider">
                  <th className="py-4 px-6 font-semibold">EMPLOYEE</th>
                  <th className="py-4 px-6 font-semibold">TYPE</th>
                  <th className="py-4 px-6 font-semibold">DATES</th>
                  <th className="py-4 px-6 font-semibold">REASON</th>
                  <th className="py-4 px-6 font-semibold">STATUS</th>
                  <th className="py-4 px-6 font-semibold text-right pr-10">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Employee Profile Name */}
                    <td className="py-5 px-6 text-gray-900 font-semibold">{request.employee}</td>
                    
                    {/* Color Coded Type Label */}
                    <td className="py-5 px-6">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide ${typeStyles[request.type] || typeStyles.CASUAL}`}>
                        {request.type}
                      </span>
                    </td>
                    
                    {/* Date Strings Content */}
                    <td className="py-5 px-6 text-gray-400 font-normal">{request.dates}</td>
                    
                    {/* Written Context Reason Block */}
                    <td className="py-5 px-6 text-gray-500 font-normal max-w-xs truncate">{request.reason}</td>
                    
                    {/* Request Processing State Indicator Badge */}
                    <td className="py-5 px-6">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide ${statusStyles[request.status]}`}>
                        {request.status}
                      </span>
                    </td>
                    
                    {/* Inline Conditional Management Controls column */}
                    <td className="py-5 px-6 text-right pr-6 min-w-[120px]">
                      {request.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAction(request.id, 'APPROVED')}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded transition-colors"
                            title="Approve Leave"
                          >
                            <Check size={14} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleAction(request.id, 'REJECTED')}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded transition-colors"
                            title="Reject Leave"
                          >
                            <X size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
    )
  }else {
    return (
     <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Dynamic Header Block */}
        <div className="flex justify-between items-start gap-4">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-950">Leave Management</h1>
            <p className="text-xs text-gray-400">Your leave history and requests</p>
          </header>
          
          <button className="flex items-center gap-1.5 bg-[#4c3dec] hover:bg-[#3b2fc4] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
            <Plus size={16} strokeWidth={2.5} />
            Apply for Leave
          </button>
        </div>

        {/* Leave Category Breakdown Cards Grid */}
        <div className="flex flex-wrap gap-4">
          {summaryMetrics.map((metric, idx) => (
            <LeaveBalanceCard
              key={idx}
              title={metric.title}
              count={metric.count}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* History Table Container */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider">
                  <th className="py-4 px-6 font-semibold">TYPE</th>
                  <th className="py-4 px-6 font-semibold">DATES</th>
                  <th className="py-4 px-6 font-semibold">REASON</th>
                  <th className="py-4 px-6 font-semibold">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {leaveHistory.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                    {/* Badge Category */}
                    <td className="py-5 px-6">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide ${typeStyles[item.type] || typeStyles.CASUAL}`}>
                        {item.type}
                      </span>
                    </td>
                    
                    {/* Date Span String */}
                    <td className="py-5 px-6 text-gray-400 font-normal">{item.dates}</td>
                    
                    {/* Reason Context */}
                    <td className="py-5 px-6 text-gray-500 font-normal max-w-sm truncate">{item.reason}</td>
                    
                    {/* Resolution Status Tag */}
                    <td className="py-5 px-6">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide ${statusStyles[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
    )
  }
 
}



export default Leave


