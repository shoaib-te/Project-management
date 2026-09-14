import React from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, FileText, Send, X } from 'lucide-react';
import apiClient from '../lib/axios';

export default function Leavefrom({ isOpen, onClose, onSubmitSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Replace this with your API client call (e.g., apiClient.post('/api/leaves', data))
      console.log('Submitted Leave Data:', data);
      await apiClient.post('/api/leave', {
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      });
      reset();
      if (onSubmitSuccess) onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to submit leave:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Apply for Leave</h2>
            <p className="text-xs text-slate-400 mt-0.5">Submit your leave request for approval</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Elements */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Leave Type Selector */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-2">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              Leave Type
            </label>
            <select
              {...register('type', { required: 'Please select a leave type' })}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 bg-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="CASUAL">CASUAL</option>
              <option value="SICK">SICK</option>
              <option value="ANNUAL">ANNUAL</option>
            </select>
            {errors.leaveType && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.leaveType.message}</p>
            )}
          </div>

          {/* Duration Fields */}
          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-2">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Duration
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] text-slate-400 mb-1">From</span>
                <input
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {errors.startDate && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.fromDate.message}</p>
                )}
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 mb-1">To</span>
                <input
                  type="date"
                  {...register('endDate', { required: 'End date is required' })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {errors.endDate && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.toDate.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Reason Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Reason</label>
            <textarea
              rows={3}
              {...register('reason', { required: 'Please enter a reason for your leave' })}
              placeholder="Provide context..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
            {errors.reason && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
