import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ role, title, subtitle }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Dynamically handle login behavior based on the passed role prop
    console.log(`Logging into ${role} panel with:`, { email, password });
    
    // Matches the layout route wrapper configuration
    if (role === 'admin') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-white font-sans selection:bg-indigo-200">
      
      {/* Left Column: Visual & Introduction */}
      <div className="relative flex flex-col justify-center px-8 py-16 text-white md:w-1/2 md:px-16 lg:px-24 bg-gradient-to-br from-[#10103a] via-[#151554] to-[#12123c] overflow-hidden">
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

      {/* Right Column: Dynamic Form Panel */}
      <div className="flex flex-col justify-center px-8 py-16 md:w-1/2 md:px-16 lg:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm">
          
          {/* Back Button pointing back to root portal selector */}
          <button 
            type="button"
            onClick={() => navigate('/login')}
            className="group flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors mb-8"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to portals</span>
          </button>

          {/* Header reading dynamic routing props */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight sm:text-3xl">
              {title} 
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {subtitle}
            </p>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder={role === 'admin' ? 'admin@organization.com' : 'john@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm placeholder-slate-300 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm placeholder-slate-300 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-medium text-white shadow-sm transition-all duration-150 hover:bg-indigo-500 active:scale-[0.98]"
            >
              Sign in
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
