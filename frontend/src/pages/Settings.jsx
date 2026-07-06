import React, { useState } from 'react';
import { User, Lock, Save } from 'lucide-react';


function Settings() {
  const data={role:""}
  if(data.role==="admin"){
    const handleChangePassword = () => {
    // Action handler logic for showing password modal or view
    console.log('Initiating password update flow');
  };
    return(
       <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block Container */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-950">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account and preferences</p>
        </header>

        {/* Settings Options Container */}
        <div className="max-w-sm">
          {/* Password Action Card Block */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
            
            {/* Left side: Icon and Info Text */}
            <div className="flex items-center gap-4">
              {/* Icon Container box */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-gray-100 text-slate-500">
                <Lock size={16} strokeWidth={2.5} />
              </div>
              
              {/* Label Group */}
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-gray-900 leading-tight">Password</h3>
                <p className="text-[11px] text-gray-400 font-normal leading-normal">
                  Update your account password
                </p>
              </div>
            </div>

            {/* Right side: Action Button Trigger */}
            <button
              onClick={handleChangePassword}
              type="button"
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold border border-gray-200 shadow-sm transition-colors"
            >
              Change
            </button>

          </div>
        </div>

      </div>
    </div>
    )
  }else{
     const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    position: '',
    bio: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    console.log('Saving profile modifications:', formData);
  };

  const handleChangePassword = () => {
    console.log('Initiating password update flow');
  };
  return (
     <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block Container */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-950">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account and preferences</p>
        </header>

        {/* Public Profile Form Panel Block */}
        <form onSubmit={handleSaveChanges} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          
          {/* Subheading Identifier Tag Section */}
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
            <User size={16} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Public Profile</h2>
          </div>

          {/* Form Fields Grid */}
          <div className="space-y-4">
            {/* Row 1: Full Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5d4eff] transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="johndoe@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5d4eff] transition-colors"
                />
              </div>
            </div>

            {/* Row 2: Position */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#5d4eff] transition-colors"
              />
            </div>

            {/* Row 3: Bio Textarea field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Bio</label>
              <textarea
                name="bio"
                rows={4}
                placeholder="Write a brief bio..."
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-[#5d4eff] transition-colors"
              />
              <p className="text-[10px] text-gray-400 font-normal">
                This will be displayed on your profile.
              </p>
            </div>
          </div>

          {/* Action Footer Execution row */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#5d4eff] hover:bg-[#4c3dec] text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-sm transition-colors"
            >
              <Save size={14} />
              Save Changes
            </button>
          </div>

        </form>

        {/* Password Action Card Block */}
        <div className="max-w-sm">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-gray-100 text-slate-500">
                <Lock size={16} strokeWidth={2.5} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-gray-900 leading-tight">Password</h3>
                <p className="text-[11px] text-gray-400 font-normal leading-normal">
                  Update your account password
                </p>
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              type="button"
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold border border-gray-200 shadow-sm transition-colors"
            >
              Change
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
}

export default Settings

