import React, { useEffect } from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  FileText, 
  CircleDollarSign, 
  Settings, 
  LogOut, 
  User2,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import apiClient from '../lib/axios';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to check current active URL
  const { user,loading,logout } = useAuth(); // Assuming you have a useAuth hook to get the current user
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Attendance', icon: CalendarDays, path: '/attendance' },
    { name: 'Leave', icon: FileText, path: '/leave' },
    { name: 'Payslips', icon: CircleDollarSign, path: '/payslips' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];
  const [username, setUsername] = React.useState('');

  useEffect(() => {
     apiClient.get('/api/profiles')
      .then(response => {
        setUsername(response.data.user.name);
        console.log('Fetched user data:', response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        toast.error("Failed to fetch user data.");
      });
  }, []);


  const handleLogout = () => {
    // Clear tokens/session data here if needed
    logout();
    navigate('/login');
    toast.success('logout is successfull ')
  };


  return (
    <aside className="flex h-screen w-64 flex-col bg-[#0b0c1e] text-slate-300 font-sans p-4 border-r border-slate-900 justify-between select-none shrink-0">
      
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
            // Check if the item's path matches the current URL route path
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => navigate(item.path)} // Action switches page view
                className={`relative flex w-full items-center justify-between rounded-xl px-3 py-3 text-xs font-medium transition-all group duration-150 ${
                  isActive
                    ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/30'
                    : 'text-slate-400 hover:bg-slate-900/30 hover:text-slate-200 border border-transparent'
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
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-medium text-slate-400 transition-colors hover:bg-rose-950/20 hover:text-rose-400 group"
        >
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
          <span>Log out</span>
        </button>
      </div>

    </aside>
  );
}
