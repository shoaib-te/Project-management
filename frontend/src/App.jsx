import { useLocation, Navigate, Routes, Route, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Leave from './pages/Leave';
import Payslip from './pages/Payslip';
import Settings from './pages/Settings';
import Employee from './pages/Employee';
import Attendance from './pages/Attensdance';
import PlayslipPrint from './pages/PlayslipPrint';
import { useAuth } from './context/Authcontext';
import { Toaster } from 'react-hot-toast';
import Loading from './pages/Loading';

function Layout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading />;

  return user ? (
    <div className="flex min-h-screen w-full flex-col bg-[#f3f4f6] md:flex-row">
      {/* 1. Sidebar Component */}
      <Sidebar />

      {/* 2. Main Content Window Area */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <main className="min-h-screen flex-1 p-4 md:p-6 2xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function App() {
  return (
    <main className="min-h-screen w-full bg-[#f3f4f6]">
      <Routes>
        {/* PROTECTED ROUTES (Require Layout & User Auth) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Leave" element={<Leave />} />
          <Route path="/payslips" element={<Payslip />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Employee" element={<Employee />} />
          <Route path="/Attendance" element={<Attendance />} />
          <Route path="/playslip/:id" element={<PlayslipPrint />} />
        </Route>

        {/* PUBLIC ROUTES (Accessible without logging in) */}
        <Route path="/login" element={<Landing />} />
        <Route
          path="/login/admin"
          element={
            <Login
              role="admin"
              title="Admin Portal"
              subtitle="Sign in to manage the organization"
            />
          }
        />
        <Route
          path="/login/employee"
          element={
            <Login
              role="employee"
              title="Employee Portal"
              subtitle="Sign in to access your account"
            />
          }
        />

        {/* Fallback Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />
    </main>
  );
}

export default App;
