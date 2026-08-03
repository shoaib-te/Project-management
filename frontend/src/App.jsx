import { useLocation, Navigate, Routes, Route, Outlet } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Leave from "./pages/Leave";
import Payslip from "./pages/Payslip";
import Settings from "./pages/Settings";
import Employee from "./pages/Employee";
import Attendance from "./pages/Attensdance";
import PlayslipPrint from "./pages/PlayslipPrint";
import { useAuth } from "./context/Authcontext";
import { Toaster } from 'react-hot-toast';
import Loading from "./pages/Loading";

function Layout() {
  const {user,loading}=useAuth()
  // Replace this hardcoded string with your actual auth state (e.g., Redux, Context, or localStorage)
   
  const location = useLocation();
  // const [isOpen, setIsOpen] = useState(false);

  // If not logged in, redirect to the main landing/login selection page
  if(loading)return <Loading/>
  return user ? (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
     
      <div className=" h-screen bg-white sticky top-0 hidden  md:block">
         <Sidebar />

      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function App() {
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6]">
      <Routes>
        {/* PROTECTED ROUTES (Require Layout & User Auth) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Leave" element={<Leave />} />
          <Route path="/payslips" element={<Payslip />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Employee" element={<Employee />} />
          <Route path="/Attendance" element={< Attendance />} />
          <Route path="/playslip/:id" element={< PlayslipPrint />} />
          
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