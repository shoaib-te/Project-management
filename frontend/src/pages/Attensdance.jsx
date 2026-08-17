import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, Clock, LogIn, LogOut } from 'lucide-react';
import apiClient from '../lib/axios';

export default function Attendance() {
  const [metrics, setMetrics] = useState([
    { title: 'Days Present', value: '0', icon: Calendar },
    { title: 'Late Arrivals', value: '0', icon: AlertCircle },
    { title: 'Avg. Work Hrs', value: '0 Hrs', icon: Clock },
  ]);

  const [activities, setActivities] = useState([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const fetchData = async () => {
    try {
      const res = await apiClient.get('/api/attendance');
      const attendanceList = res.data?.data || []; 

      if (Array.isArray(attendanceList)) {
        const formattedActivities = attendanceList.map((item) => ({
          id: item._id,
          date: formatDate(item.date),
          checkIn: formatTime(item.checkIn),
          checkOut: formatTime(item.checkOut || item.checkout), 
          hours: item.workingHours !== null && item.workingHours !== undefined ? `${item.workingHours}h` : '--',
          type: item.dayType || '--',
          status: item.status || 'PRESENT',
        }));

        setActivities(formattedActivities);

        const activeSession = attendanceList.find((item) => item.checkIn && !(item.checkOut || item.checkout));
        setIsCheckedIn(!!activeSession);

        const presentCount = attendanceList.filter((item) => item.status === 'PRESENT' || item.status === 'LATE').length;
        const lateCount = attendanceList.filter((item) => item.status === 'LATE').length;
        const totalHours = attendanceList.reduce((acc, item) => acc + (item.workingHours || 0), 0);
        const avgHours = presentCount ? (totalHours / presentCount).toFixed(1) : 0;

        setMetrics([
          { title: 'Days Present', value: presentCount.toString(), icon: Calendar },
          { title: 'Late Arrivals', value: lateCount.toString(), icon: AlertCircle },
          { title: 'Avg. Work Hrs', value: `${avgHours} Hrs`, icon: Clock },
        ]);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClockInOut = async () => {
    setLoading(true);
    try {
      await apiClient.post('/api/attendance');
      await fetchData(); 
    } catch (error) {
      console.error('Clock in/out failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans relative pb-28">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-950">Attendance</h1>
          <p className="text-sm text-gray-500">Track your work hours and daily check-ins</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
            />
          ))}
        </div>

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
                {activities.length > 0 ? (
                  activities.map((row, index) => (
                    <tr key={row.id || index} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 px-6 text-gray-900 font-semibold">{row.date}</td>
                      <td className="py-4 px-6 text-gray-500">{row.checkIn}</td>
                      <td className="py-4 px-6 text-gray-500">{row.checkOut}</td>
                      <td className="py-4 px-6 text-gray-500">{row.hours}</td>
                      <td className="py-4 px-6">
                        <span 
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-wide ${
                            row.type === 'Full Day' 
                              ? 'bg-emerald-50 text-emerald-600' 
                              : row.type === '--' 
                              ? 'bg-gray-100 text-gray-600' 
                              : 'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {row.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold tracking-wide ${
                            row.status === 'LATE'
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-400">
                      No activity recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-8 z-50">
        <button
          onClick={handleClockInOut}
          disabled={loading}
          className={`flex items-center gap-4 text-white pl-4 pr-6 py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 group disabled:opacity-50 ${
            isCheckedIn
              ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'
              : 'bg-[#4c3dec] hover:bg-[#3b2fc4] shadow-indigo-100'
          }`}
        >
          <div className="border-r border-white/20 pr-3 text-white/90">
            {isCheckedIn ? <LogOut size={20} strokeWidth={2} /> : <LogIn size={20} strokeWidth={2} />}
          </div>
          <div className="text-left space-y-0.5">
            <p className="text-sm font-semibold tracking-wide leading-none">
              {loading ? 'Processing...' : isCheckedIn ? 'Clock Out' : 'Clock In'}
            </p>
            <p className="text-[10px] text-white/80 font-normal leading-none">
              {isCheckedIn ? 'end your work day' : 'start your work day'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

// Completed Card Component
const MetricCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center w-full">
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="p-3 bg-slate-50 rounded-lg text-slate-500">
      <Icon size={22} strokeWidth={2} />
    </div>
  </div>
);
