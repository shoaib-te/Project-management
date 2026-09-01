import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../lib/axios';
import toast from 'react-hot-toast';

function PlayslipPrint() {
  const { id } = useParams();
  
  // 1. Set the initial state to null to easily handle loading states
  const [payslipData, setPayslipData] = useState(null);

  useEffect(() => {
    apiClient.get(`/api/payslips/${id}`)
      .then((res) => {
        // Your response wraps the object inside a "data" property
        if (res.data && res.data.success) {
          setPayslipData(res.data.data);
        }
      })
      .catch((err) => {
        const errorMsg = err.response?.data?.message || err.message || "Failed to fetch payslip";
        toast.error(errorMsg);
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  // 2. Display a loading layout while fetching your network data
  if (!payslipData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">
        Loading payslip details...
      </div>
    );
  }

  // 3. Destructure your exact database response properties safely
  const { employeeId, month, year, baseSalary, allowances, deductions, netSalary } = payslipData;
  const fullName = `${employeeId?.firstName || ''} ${employeeId?.lastName || ''}`.trim() || 'N/A';

  // 4. Format month "5" into English text (e.g., "May 2026")
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const parsedMonthIndex = parseInt(month, 10) - 1;
  const displayPeriod = parsedMonthIndex >= 0 && parsedMonthIndex < 12 
    ? `${months[parsedMonthIndex]} ${year}` 
    : `Month (${month}) ${year}`;

  // 5. Connect your line items array dynamically to the backend numbers
  const lineItems = [
    { description: 'Basic Salary', amount: baseSalary || 0, prefix: '' },
    { description: 'Allowances', amount: allowances || 0, prefix: '+' },
    { description: 'Deductions', amount: deductions || 0, prefix: '-' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 antialiased font-sans">
      {/* Payslip Card Container */}
      <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100 print:shadow-none print:border-none">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-xl font-extrabold text-gray-900 tracking-wider uppercase">Payslip</h1>
          <p className="text-sm text-gray-500 mt-1">{displayPeriod}</p>
        </div>

        {/* Employee Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-10 text-sm">
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Employee Name</span>
            <span className="font-bold text-gray-800">{fullName}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Position</span>
            <span className="font-bold text-gray-800 capitalize">{employeeId?.position || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email</span>
            <span className="font-bold text-gray-800">{employeeId?.email || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Period</span>
            <span className="font-bold text-gray-800">{displayPeriod}</span>
          </div>
        </div>

        {/* Financial Table Container */}
        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-2 bg-gray-50/50 px-6 py-4 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div>Description</div>
            <div className="text-right">Amount</div>
          </div>

          {/* Line Items */}
          <div className="divide-y divide-gray-50 px-6">
            {lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-2 py-4 text-sm font-medium text-gray-600">
                <div>{item.description}</div>
                <div className="text-right text-gray-900">
                  {item.prefix}${item.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Net Salary Total Row */}
          <div className="grid grid-cols-2 bg-gray-50/50 px-6 py-5 border-t border-gray-100 items-center">
            <div className="text-sm font-bold text-gray-900">Net Salary</div>
            <div className="text-right text-xl font-extrabold text-gray-900">
              ${(netSalary || 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Action Button Container */}
      <div className="mt-8 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm transition-colors duration-200"
        >
          Print Payslip
        </button>
      </div>
    </div>
  );
}

export default PlayslipPrint;
