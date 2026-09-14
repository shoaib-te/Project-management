import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import apiClient from '../lib/axios';
import toast from 'react-hot-toast';

export default function GeneratePayslipModal({ isOpen, onClose, onSuccess }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [month, setMonth] = useState('3');
  const [year, setYear] = useState('2026');
  const [basicSalary, setBasicSalary] = useState('');
  const [allowances, setAllowances] = useState('0');
  const [deductions, setDeductions] = useState('0');
  const [submitting, setSubmitting] = useState(false);

  // Fetch employees list when modal opens
  useEffect(() => {
    if (isOpen) {
      apiClient
        .get('/api/employees')
        .then((res) => setEmployees(Array.isArray(res.data) ? res.data : res.data.employees || []))
        .catch(() => toast.error('Failed to load employee list.'));
    }
  }, [isOpen]);

  // Update Basic Salary dynamically on selection
  const handleEmployeeChange = (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    const emp = employees.find((item) => item._id === empId || item.id === empId);
    if (emp?.salary || emp?.basicSalary) {
      setBasicSalary(emp.salary || emp.basicSalary);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !basicSalary) {
      return toast.error('Please fill in all required fields.');
    }

    try {
      setSubmitting(true);

      const basic = parseFloat(basicSalary) || 0;
      const allow = parseFloat(allowances) || 0;
      const deduct = parseFloat(deductions) || 0;
      const netSalary = basic + allow - deduct;

      const payload = {
        employeeId: selectedEmployee,
        month: parseInt(month),
        year: parseInt(year),
        baseSalary: basic,
        allowances: allow,
        deductions: deduct,
        netSalary: netSalary,
      };

      await apiClient.post('/api/payslips', payload);
      toast.success('Payslip generated successfully!');

      if (onSuccess) onSuccess(); // Safely execute callback to sync table data
      onClose(); // Hide modal
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to generate payslip.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="text-base font-bold text-slate-900">Generate Monthly Payslip</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium text-slate-700">
          {/* Employee Selection */}
          <div className="space-y-1.5">
            <label className="text-gray-500">Employee</label>
            <select
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select Employee...</option>
              {employees.map((emp) => (
                <option key={emp._id || emp.id} value={emp._id || emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.designation || 'Staff'})
                </option>
              ))}
            </select>
          </div>

          {/* Month & Year Select Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500">Month</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Basic Salary Input */}
          <div className="space-y-1.5">
            <label className="text-gray-500">Basic Salary</label>
            <input
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Allowances & Deductions Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500">Allowances</label>
              <input
                type="number"
                value={allowances}
                onChange={(e) => setAllowances(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500">Deductions</label>
              <input
                type="number"
                value={deductions}
                onChange={(e) => setDeductions(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 font-normal text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#4c3dec] hover:bg-[#3b2fc4] text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50"
            >
              {submitting ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
