import React from 'react';
import { ArrowRight } from 'lucide-react'; // Install lucide-react or use standard SVG arrows
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import { useAuth } from '../context/Authcontext';

export default function Landing() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  // const { user,loading } = useAuth();
  // if (loading) return <Loading />;
  // if (user) {
  //   navigate("/dashboard");
  // }


  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-white font-sans selection:bg-indigo-200">
      
      {/* Left Column: Visual & Introduction */}
      <div className="relative flex flex-col justify-center px-8 py-16 text-white md:w-1/2 md:px-16 lg:px-24 bg-gradient-to-br from-[#10103a] via-[#151554] to-[#12123c] overflow-hidden">
        {/* Decorative subtle ambient light blob top-left */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Employee <br className="hidden sm:inline" />
            Management System
          </h1>
          <p className="mt-6 text-base text-slate-300 leading-relaxed font-light">
            Streamline your workforce operations, track attendance, manage payroll, 
            and empower your team securely.
          </p>
        </div>
      </div>

      {/* Right Column: Portal Selection Form */}
      <div className="flex flex-col justify-center px-8 py-16 md:w-1/2 md:px-16 lg:px-24 bg-white relative">
        <div className="mx-auto w-full max-w-sm flex-1 flex flex-col justify-center">
          
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight sm:text-3xl">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Select your portal to securely access the system.
            </p>
          </div>

          {/* Portal Buttons */}
          <div className="space-y-4">
            <button 
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-5 text-left text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-indigo-100 hover:shadow-md active:scale-[0.99] group"
              onClick={() => navigate("/login/admin")}
            >
              <span>Admin Portal</span>
              <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-indigo-600" />
            </button>

            <button 
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-5 text-left text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:border-indigo-100 hover:shadow-md active:scale-[0.99] group"
              onClick={() => navigate("/login/employee")}
            >
              <span>Employee Portal</span>
              <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-indigo-600" />
            </button>
          </div>

        </div>

        {/* Footer Text */}
        <div className="absolute bottom-6 left-8 right-8 text-center md:text-left">
          <p className="text-xs text-slate-400/80 tracking-wide font-light">
            &copy; {currentYear} GreatStack. All rights reserved.
          </p>
        </div>
      </div>

    </div>
  );
}
