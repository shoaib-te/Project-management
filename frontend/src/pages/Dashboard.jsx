import React from 'react'
import { Users, Building2,CalendarCheck, FileText, DollarSign, ArrowRight } from 'lucide-react';
import Dashboardcard from '../components/Dashboardcard';
function Dashboard() {
  const data = { role: 'admin' };
   const metrics = [
    { title: 'Total Employees', value: 3, icon: Users },
    { title: 'Departments', value: 10, icon: Building2 },
    { title: 'Today\'s Attendance', value: 1, icon: CalendarCheck },
    { title: 'Pending Leaves', value: 1, icon: FileText },
  ];
  /**
   * emplay data
   */
 const metric = [
    { title: 'Days Present', value: '20', icon: CalendarCheck },
    { title: 'Pending Leaves', value: '2', icon: FileText },
    { title: 'Latest Payslip', value: '$2,000', icon: DollarSign },
  ];

  if(data.role==="admin"){
    return    <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-950">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, <span className="font-medium text-gray-700">Admin</span> — here's your overview
          </p>
        </header>

        {/* Metrics Grid */}
        <div className="flex flex-wrap gap-4">
          {metrics.map((metric, index) => (
            <Dashboardcard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
            />
          ))}
        </div>
      </div>
    </div>
  }else {
    return  <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-950">Welcome, John!</h1>
          <p className="text-sm text-gray-500">
            Software Engineer - <span className="text-gray-400">Engineering</span>
          </p>
        </header>

        {/* Metrics Grid */}
        <div className="flex flex-wrap gap-4">
          {metric.map((metric, index) => (
            <DashboardCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button className="flex items-center gap-2 bg-[#5d4eff] hover:bg-[#4c3dec] text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors">
            Mark Attendance
            <ArrowRight size={16} strokeWidth={2} />
          </button>
          
          <button className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-200 shadow-sm transition-colors">
            Apply for Leave
          </button>
        </div>
      </div>
    </div>
  }
 
}

export default Dashboard


const DashboardCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex justify-between items-start min-w-[240px] flex-1">
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-500 tracking-wide">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="text-slate-700 p-1">
      <Icon size={28} strokeWidth={1.5} />
    </div>
  </div>
);
