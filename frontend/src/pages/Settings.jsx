import React, { useState, useEffect } from 'react';
import { User, Lock, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/Authcontext';
import apiClient from '../lib/axios';
import ChangePassword from './Changepassword';

function Settings() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    position: '',
    bio: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // Track modal visibility

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/api/profiles');
        const profile = response?.data?.data || response?.data;
        
        if (profile) {
          setFormData({
            fullName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
            email: profile.email || profile.userId?.email || '',
            position: profile.position || '',
            bio: profile.bio || '',
          });
        }
      } catch (error) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await apiClient.put('/api/profiles', { bio: formData.bio });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block Container */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-950">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account and preferences</p>
        </header>

        {/* ADMIN VIEW: Profile Details Card */}
        {isAdmin ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
              <ShieldCheck size={18} className="text-indigo-600" />
              <h2 className="text-sm font-semibold text-gray-900">Administrator Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block font-medium">Full Name</span>
                <span className="font-bold text-gray-800">{formData.fullName || 'Admin User'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Email</span>
                <span className="font-bold text-gray-800">{formData.email || 'admin@example.com'}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Role</span>
                <span className="inline-block px-2 py-0.5 mt-1 bg-indigo-50 text-indigo-700 font-bold rounded text-[10px]">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* EMPLOYEE VIEW: Editable Profile Form */
          <form
            onSubmit={handleSaveChanges}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6"
          >
            <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
              <User size={16} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Public Profile</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#5d4eff] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#5d4eff] transition-colors"
                  />
                </div>
              </div>

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

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 resize-none focus:outline-none focus:border-[#5d4eff] transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-[#5d4eff] hover:bg-[#4c3dec] disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-xs font-medium shadow-sm transition-colors"
              >
                <Save size={14} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Shared Password Action Block */}
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
              type="button"
              onClick={() => setIsPasswordModalOpen(true)} // Open modal on click
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold border border-gray-200 shadow-sm transition-colors"
            >
              Change
            </button>
          </div>
        </div>

      </div>

      {/* Render Modal Conditionally */}
      {isPasswordModalOpen && (
        <ChangePassword onClose={() => setIsPasswordModalOpen(false)} />
      )}
    </div>
  );
}

export default Settings;
