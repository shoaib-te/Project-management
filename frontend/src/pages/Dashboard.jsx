import React, { useEffect, useState } from "react";
import {
  Users,
  Building2,
  CalendarCheck,
  FileText,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import apiClient from "../lib/axios";
import { toast } from "react-hot-toast";
import { useCallback } from "react";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState();
  const [loading, setLoading] = useState(true); // Added loading state

  const fetchDashboard = useCallback(async () => {
    await apiClient
      .get("/api/dashbord")
      .then((res) => {
        setDashboardData(res.data);

        setLoading(false);
        console.log(dashboardData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch dashboard data");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  // 1. Prevent flashing the wrong UI while data is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center font-sans">
        <p className="text-gray-500 font-medium">Loading your dashboard...</p>
      </div>
    );
  }

  // 2. Map Dynamic Admin Metrics (Fallback to '0' or static defaults if keys missing)
  const adminMetrics = [
    {
      title: "Total Employees",
      value: dashboardData?.totalEmployee ?? 0,
      icon: Users,
    },
    {
      title: "Departments",
      value: dashboardData?.totalDepartments ?? 0,
      icon: Building2,
    },
    {
      title: "Today's Attendance",
      value: dashboardData?.todayAttendances ?? 0,
      icon: CalendarCheck,
    },
    {
      title: "Pending Leaves",
      value: dashboardData?.pendingleave ?? 0,
      icon: FileText,
    },
  ];

  // 3. Map Dynamic Employee Metrics
  const employeeMetrics = [
    {
      title: "Days Present",
      value: dashboardData?.CurrentMonthAttendance ?? 0,
      icon: CalendarCheck,
    },
    {
      title: "Pending Leaves",
      value: dashboardData?.PendingLeaves ?? 0,
      icon: FileText,
    },
    {
      title: "Latest Payslip",
      value: dashboardData?.LatestPayslip
        ? `$${dashboardData.LatestPayslip}`
        : "$0",
      icon: DollarSign,
    },
  ];

  if (dashboardData?.role === "admin") {
    return (
      <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-950">Dashboard</h1>
            <p className="text-sm text-gray-500">
              Welcome back,{" "}
              <span className="font-medium text-gray-700">Admin</span> — here's
              your overview
            </p>
          </header>
          <div className="flex flex-wrap gap-4">
            {adminMetrics.map((item, index) => (
              <DashboardCard
                key={index}
                title={item.title}
                value={item.value}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="space-y-1">
            {/* Dynamic User Profile info */}
            <h1 className="text-2xl font-semibold text-gray-950">
              Welcome, {dashboardData?.firstName || "User"}!
            </h1>
            <p className="text-sm text-gray-500">
              {dashboardData?.designation || "Employee"} -{" "}
              <span className="text-gray-400">
                {dashboardData?.department || "Staff"}
              </span>
            </p>
          </header>
          <div className="flex flex-wrap gap-4">
            {employeeMetrics.map((item, index) => (
              <DashboardCard
                key={index}
                title={item.title}
                value={item.value}
                icon={item.icon}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="flex items-center gap-2 bg-[#5d4eff] hover:bg-[#4c3dec] text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors">
              Mark Attendance <ArrowRight size={16} strokeWidth={2} />
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-200 shadow-sm transition-colors">
              Apply for Leave
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;

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
