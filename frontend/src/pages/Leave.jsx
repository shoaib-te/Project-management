import React, { useState, useEffect } from 'react';
import { Check, X, Thermometer, Umbrella, Plus } from 'lucide-react';

import LeaveBalanceCard from '../components/LeaveBalanceCard';
import { useAuth } from '../context/Authcontext';
import apiClient from '../lib/axios';
import Leavefrom from '../components/leavefrom';

function Leave() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);

  const fatchleavedata = async () => {
    try {
      const res = await apiClient.get('/api/leave');
      // 1. Unpack payload safely (backend returns { data: [...] })
      const data = res.data?.data || res.data || [];

      if (user?.role === 'admin') {
        setLeaveRequests(data);
      } else {
        setLeaveHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch leave data:', error);
    }
  };

  useEffect(() => {
    fatchleavedata();
  }, [user?.role]);

  // 2. Persist status updates to the backend
  const handleAction = async (id, newStatus) => {
    try {
      await apiClient.patch(`/api/leave/${id}`, { status: newStatus });
      setLeaveRequests((prev) =>
        prev.map((req) =>
          req._id === id || req.id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error('Failed to update leave status:', error);
    }
  };

  const summaryMetrics = [
    { title: 'Sick Leave', count: 1, icon: Thermometer },
    { title: 'Casual Leave', count: 0, icon: Umbrella },
    { title: 'Annual Leave', count: 1, icon: Plus },
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

  // Helper function to resolve employee display name safely
  const getEmployeeName = (emp) => {
    if (!emp) return 'N/A';
    if (typeof emp === 'string') return emp;
    return emp.name || emp.email || 'Employee';
  };

  // Helper function to format dates cleanly
  const formatDates = (req) => {
    if (req.dates) return req.dates;
    if (req.startDate && req.endDate) {
      return `${new Date(req.startDate).toLocaleDateString()} - ${new Date(req.endDate).toLocaleDateString()}`;
    }
    return 'N/A';
  };

  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-950">Leave Management</h1>
            <p className="text-sm text-gray-500">Manage leave applications</p>
          </header>

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
                  {leaveRequests?.map((request, idx) => {
                    const reqId = request._id || request.id || idx;
                    const leaveType = request.type?.toUpperCase() || 'CASUAL';
                    const leaveStatus = request.status?.toUpperCase() || 'PENDING';

                    return (
                      <tr key={reqId} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-5 px-6 text-gray-900 font-semibold">
                          {getEmployeeName(request.employee)}
                        </td>
                        <td className="py-5 px-6">
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide ${
                              typeStyles[leaveType] || typeStyles.CASUAL
                            }`}
                          >
                            {leaveType}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-gray-400 font-normal">
                          {formatDates(request)}
                        </td>
                        <td className="py-5 px-6 text-gray-500 font-normal max-w-xs truncate">
                          {request.reason}
                        </td>
                        <td className="py-5 px-6">
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide ${
                              statusStyles[leaveStatus] || statusStyles.PENDING
                            }`}
                          >
                            {leaveStatus}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-right pr-6 min-w-[120px]">
                          {leaveStatus === 'PENDING' && (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleAction(reqId, 'APPROVED')}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded transition-colors"
                                title="Approve Leave"
                              >
                                <Check size={14} strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => handleAction(reqId, 'REJECTED')}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded transition-colors"
                                title="Reject Leave"
                              >
                                <X size={14} strokeWidth={2.5} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start gap-4">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-950">Leave Management</h1>
            <p className="text-xs text-gray-400">Your leave history and requests</p>
          </header>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 bg-[#4c3dec] hover:bg-[#3b2fc4] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            Apply for Leave
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {summaryMetrics?.map((metric, idx) => (
            <LeaveBalanceCard
              key={idx}
              title={metric.title}
              count={metric.count}
              icon={metric.icon}
            />
          ))}
        </div>

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
                {leaveHistory?.map((item, index) => {
                  const leaveType = item.type?.toUpperCase() || 'CASUAL';
                  const leaveStatus = item.status?.toUpperCase() || 'PENDING';

                  return (
                    <tr key={item._id || item.id || index} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-5 px-6">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide ${
                            typeStyles[leaveType] || typeStyles.CASUAL
                          }`}
                        >
                          {leaveType}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-gray-400 font-normal">{formatDates(item)}</td>
                      <td className="py-5 px-6 text-gray-500 font-normal max-w-sm truncate">
                        {item.reason}
                      </td>
                      <td className="py-5 px-6">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wide ${
                            statusStyles[leaveStatus] || statusStyles.PENDING
                          }`}
                        >
                          {leaveStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Leavefrom
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmitSuccess={fatchleavedata}
      />
    </div>
  );
}

export default Leave;