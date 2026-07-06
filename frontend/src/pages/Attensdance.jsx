import React from 'react';
import { Calendar, AlertCircle, Clock, LogIn } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex justify-between items-start min-w-[240px] flex-1">
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-500 tracking-wide">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="text-slate-400 bg-slate-50 p-2 rounded-lg">
      <Icon size={20} strokeWidth={2} />
    </div>
  </div>
);

export default function Attendance() {
  const metrics = [
    { title: 'Days Present', value: '2', icon: Calendar },
    { title: 'Late Arrivals', value: '0', icon: AlertCircle },
    { title: 'Avg. Work Hrs', value: '8.5 Hrs', icon: Clock },
  ];

  const activities = [
    { date: 'Mar 15, 2026', checkIn: '04:12 PM', checkOut: '12:12 AM', hours: '8h 0m', type: 'Full Day', status: 'PRESENT' },
    { date: 'Mar 13, 2026', checkIn: '07:18 PM', checkOut: '03:18 AM', hours: '8h 0m', type: 'Full Day', status: 'PRESENT' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans relative pb-28">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-950">Attendance</h1>
          <p className="text-sm text-gray-500">Track your work hours and daily check-ins</p>
        </header>

        {/* Metrics Grid */}
        <div className="flex flex-wrap gap-4">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Recent Activity Table Container */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Recent Activity</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider">
                  <th className="py-4 px-6">DATE</th>
                  <th className="py-4 px-6">CHECK IN</th>
                  <th className="py-4 px-6">CHECK OUT</th>
                  <th className="py-4 px-6">WORKING HOURS</th>
                  <th className="py-4 px-6">DAY TYPE</th>
                  <th className="py-4 px-6">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {activities.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 px-6 text-gray-900 font-semibold">{row.date}</td>
                    <td className="py-4 px-6 text-gray-500">{row.checkIn}</td>
                    <td className="py-4 px-6 text-gray-500">{row.checkOut}</td>
                    <td className="py-4 px-6 text-gray-500">{row.hours}</td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded text-[10px] font-semibold tracking-wide">
                        {row.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded text-[10px] font-semibold tracking-wide">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Floating Action Button (Sticky Bottom Right) */}
      <div className="fixed bottom-6 right-8 z-50">
        <button className="flex items-center gap-4 bg-[#4c3dec] hover:bg-[#3b2fc4] text-white pl-4 pr-6 py-3.5 rounded-xl shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 group">
          <div className="border-r border-indigo-400/40 pr-3 text-white/90">
            <LogIn size={20} strokeWidth={2} />
          </div>
          <div className="text-left space-y-0.5">
            <p className="text-sm font-semibold tracking-wide leading-none">Clock In</p>
            <p className="text-[10px] text-indigo-200/90 font-normal leading-none">start your work day</p>
          </div>
        </button>
      </div>

    </div>
  );
}
