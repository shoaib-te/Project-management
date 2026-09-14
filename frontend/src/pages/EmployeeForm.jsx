import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import apiClient from '../lib/axios';

const INITIAL_FORM_STATE = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  joinDate: '',
  bio: '',
  jobTitle: '',
  department: '',
  basicSalary: '',
  allowances: '0',
  deductions: '0',
  status: 'Active',
  workEmail: '',
  password: '',
  systemRole: 'employee',
};

export default function EmployeeForm({ employeeData, onClose }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const DEPARTMENTS = [
    'Engineering',
    'Human Resources',
    'Marketing',
    'Sales',
    'Finance',
    'Operations',
    'IT Support',
    'Customer Success',
    'Product Management',
    'Design',
  ];

  // Pre-fill form when editing
  useEffect(() => {
    if (employeeData) {
      setFormData({
        firstName: employeeData.firstName || '',
        lastName: employeeData.lastName || '',
        phoneNumber: employeeData.phoneNumber || '',
        joinDate: employeeData.joinDate ? employeeData.joinDate.split('T')[0] : '',
        bio: employeeData.bio || '',
        jobTitle: employeeData.jobTitle || employeeData.position || '',
        department: employeeData.department || '',
        basicSalary: employeeData.basicSalary || '',
        allowances: employeeData.allowances || '0',
        deductions: employeeData.deductions || '0',
        status: employeeData.status || 'Active',
        workEmail: employeeData.workEmail || employeeData.email || '',
        password: '', // Kept empty for security during edits
        systemRole: employeeData.systemRole || employeeData.role || 'employee',
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
  }, [employeeData]);

  // Generic handler for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.workEmail,
      phone: formData.phoneNumber,
      department: formData.department,
      position: formData.jobTitle,
      basicSalary: formData.basicSalary,
      allowances: formData.allowances,
      deductions: formData.deductions,
      joiningDate: formData.joinDate,
      bio: formData.bio,
      role: formData.systemRole,
      employmentStatus: formData.status,
    };

    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      if (employeeData) {
        await apiClient.put(`/api/employees/${employeeData.id}`, payload);
      } else {
        await apiClient.post('/api/employees', payload);
      }
      if (onClose) onClose();
    } catch (err) {
      console.error('Submission Error:', err);
      setError(err.response?.data?.message || 'Failed to save employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Centralized Tailwind classes
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';
  const inputClass =
    'w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5d4eff] focus:ring-1 focus:ring-[#5d4eff] transition-colors';
  const selectWrapperClass = 'relative';
  const chevronClass =
    'pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-400';
  const sectionTitleClass =
    'text-sm font-semibold text-gray-950 uppercase tracking-wider border-b border-gray-100 pb-2';

  return (
    <div className="bg-white max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-950">
            {employeeData ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {employeeData
              ? 'Update user account and employee profile'
              : 'Create a user account and employee profile'}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-50 rounded-lg"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Form Body */}
      <form
        id="employee-form"
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto p-6 space-y-8"
      >
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Personal Info Section */}
        <div className="space-y-4">
          <h3 className={sectionTitleClass}>Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Join Date</label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Bio (Optional)</label>
            <textarea
              name="bio"
              placeholder="Brief description..."
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {/* Employment Details Section */}
        <div className="space-y-4">
          <h3 className={sectionTitleClass}>Employment Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Department</label>
              <div className={selectWrapperClass}>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-8`}
                  required
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className={chevronClass}>
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Position</label>
              <input
                type="text"
                name="jobTitle"
                placeholder="e.g. Sr Developer"
                value={formData.jobTitle}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Basic Salary</label>
              <input
                type="number"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Allowances</label>
              <input
                type="number"
                name="allowances"
                value={formData.allowances}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Deductions</label>
              <input
                type="number"
                name="deductions"
                value={formData.deductions}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Status</label>
            <div className={selectWrapperClass}>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputClass} appearance-none pr-8`}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
              <div className={chevronClass}>
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Account Setup */}
        <div className="space-y-4">
          <h3 className={sectionTitleClass}>Account Setup</h3>
          <div>
            <label className={labelClass}>Work Email</label>
            <input
              type="email"
              name="workEmail"
              placeholder="name@example.com"
              value={formData.workEmail}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Password {employeeData ? '(Optional)' : ''}</label>
              <input
                type="password"
                name="password"
                placeholder={employeeData ? 'Leave blank to keep current' : 'Enter password'}
                value={formData.password}
                onChange={handleChange}
                required={!employeeData}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>System Role</label>
              <div className={selectWrapperClass}>
                <select
                  name="systemRole"
                  value={formData.systemRole}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none pr-8`}
                >
                  <option value="employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className={chevronClass}>
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          form="employee-form"
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[#5d4eff] hover:bg-[#4c3dec] text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? 'Saving...' : employeeData ? 'Update Employee' : 'Save Employee'}
        </button>
      </div>
    </div>
  );
}
