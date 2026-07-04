import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileText, 
  CircleDollarSign, 
  Settings, 
  LogOut, 
  User2,
  ChevronRight
} from 'lucide-react'; // Install lucide-react or use standard SVGs

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Attendance', icon: CalendarDays },
    { name: 'Leave', icon: FileText },
    { name: 'Payslips', icon: CircleDollarSign },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#0b0c1e] text-slate-300 font-sans p-4 border-r border-slate-900 justify-between select-none">
      
      {/* Top Section */}
      <div>
        {/* App Branding */}
        <div className="flex items-center gap-3 px-2 py-4 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/40 text-slate-200 border border-slate-800">
            <User2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-wide">Employee MS</h1>
            <p className="text-[10px] text-slate-500 font-medium">Management System</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 rounded-xl bg-slate-900/40 p-3 mb-8 border border-slate-900">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-xs font-semibold text-white">
            J
          </div>
          <div>
            <h2 className="text-xs font-semibold text-white">John Doe</h2>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Employee</p>
          </div>
        </div>

        {/* Navigation Category Label */}
        <div className="px-2 mb-3">
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
            Navigation
          </span>
        </div>

        {/* Menu Navigation List */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveItem(item.name)}
                className={`relative flex w-full items-center justify-between rounded-xl px-3 py-3 text-xs font-medium transition-all group duration-150 ${
                  isActive
                    ? 'bg-indigo-950/40 text-indigo-400  border-indigo-900/30'
                    : 'text-slate-400 hover:bg-slate-900/30 hover:text-slate-200'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-md bg-indigo-500" />
                )}

                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                  <span>{item.name}</span>
                </div>

                {isActive && <ChevronRight className="h-3 w-3 text-indigo-400" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout Button */}
      <div className="border-t border-slate-900/60 pt-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-medium text-slate-400 transition-colors hover:bg-rose-950/20 hover:text-rose-400 group"
        >
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
          <span>Log out</span>
        </button>
      </div>

    </aside>
  );
}
