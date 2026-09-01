import React, { useEffect, useState } from 'react';
import { LayoutDashboard, CalendarDays, FileText, CircleDollarSign, Settings, LogOut, User2, ChevronRight, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import apiClient from '../lib/axios';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    user?.role === 'admin' 
      ? { name: 'Employee', icon: User2, path: '/employee' }
      : { name: 'Attendance', icon: CalendarDays, path: '/attendance' },
    { name: 'Leave', icon: FileText, path: '/leave' },
    { name: 'Payslips', icon: CircleDollarSign, path: '/payslips' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  useEffect(() => {
    apiClient.get('/api/profiles')
      .then(response => {
        setUsername(response.data.firstName + ' ' + response.data.lastName);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        toast.error("Failed to fetch user data.");
      });
  }, []);

  useEffect(() => {
    setIsOpenMobile(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logout is successful');
  };

  const role = user?.role || 'employee';

  const SidebarContent = () => (
    // FIX: Using full height h-full inside container wrappers to allow natural parent document flow
    <aside className="flex w-64 flex-col h-full bg-[#0b0c1e] text-slate-300 font-sans p-4 border-r border-slate-900 justify-between select-none shrink-0">
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
            {username ? username.charAt(0).toUpperCase() : ''}
          </div>
          <div>
            <h2 className="text-xs font-semibold text-white">{username}</h2>
            {role === 'admin' ? (
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Administrator</p>
            ) : (
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Employee</p>
            )}
          </div>
        </div>

        {/* Navigation Label */}
        <div className="px-2 mb-3">
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">
            Navigation
          </span>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => navigate(item.path)}
                className={`relative flex w-full items-center justify-between rounded-xl px-3 py-3 text-xs font-medium transition-all group duration-150 ${
                  isActive
                    ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/30'
                    : 'text-slate-400 hover:bg-slate-900/30 hover:text-slate-200 border border-transparent'
                }`}
              >
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

      {/* Logout */}
      <div className="border-t border-slate-900/60 pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-medium text-slate-400 transition-colors hover:bg-rose-950/20 hover:text-rose-400 group"
        >
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="flex items-center justify-between bg-[#0b0c1e] p-4 text-white md:hidden border-b border-slate-900 w-full fixed top-0 left-0 z-40 h-16">
        <div className="flex items-center gap-2">
          <User2 className="h-5 w-5 text-indigo-400" />
          <span className="text-sm font-semibold tracking-wide">Employee MS</span>
        </div>
        <button
          onClick={() => setIsOpenMobile(true)}
          className="p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile spacer offset */}
      <div className="md:hidden h-16 w-full" />

      {/* DESKTOP PERMANENT SIDEBAR */}
      {/* FIX: Set strict viewport heights and explicit position attachments to anchor correctly alongside long dynamic layout wrappers */}
      <div className="hidden md:flex h-screen sticky top-0 left-0 z-30 shrink-0">
        <SidebarContent />
      </div>

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpenMobile(false)}
          />
          <div className="relative flex flex-col h-full animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setIsOpenMobile(false)}
              className="absolute top-4 right-[-48px] p-2 text-white bg-[#0b0c1e] rounded-r-xl border-y border-r border-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}
