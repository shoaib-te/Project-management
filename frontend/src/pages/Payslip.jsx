import React, { useEffect, useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import apiClient from '../lib/axios';
import toast from 'react-hot-toast';
import GeneratePayslipModal from '../components/GeneratePayslipModal';

function Payslip() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State managers
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch real records from backend database
  const fetchPayslipData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/api/payslips');

      // Safely parse nested data formats (e.g., res.data.data, res.data.payslips, or direct array)
      const list = Array.isArray(res.data) ? res.data : res.data?.data || res.data?.payslips || [];

      setPayslips(Array.isArray(list) ? list : []);
      console.log(payslips);
    } catch (error) {
      console.error('Error fetching payslip metrics:', error);
      toast.error('Failed to sync payslip records from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslipData();
  }, []);

  const handleDownload = (id) => {
    navigate(`/playslip/${id}`);
  };

  const date = new Date();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#4c3dec]" />
        <p className="text-xs text-slate-400 font-medium">Fetching payroll ledgers...</p>
      </div>
    );
  }

  // --- VIEW BRANCH 1: ADMINISTRATIVE CONSOLE ---
  if (user?.role === 'admin') {
    return (
      <div className="w-full space-y-6">
        {/* Header Block Container */}
        <div className="flex justify-between items-start gap-4">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-950">Payslips</h1>
            <p className="text-sm text-gray-500">Generate and manage employee payslips</p>
          </header>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#4c3dec] hover:bg-[#3b2fc4] text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
            Generate Payslip
          </button>
        </div>

        {/* Data Table Card Section */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/40 border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider">
                  <th className="py-4 px-8 font-semibold">EMPLOYEE</th>
                  <th className="py-4 px-8 font-semibold">PERIOD</th>
                  <th className="py-4 px-8 font-semibold">BASIC SALARY</th>
                  <th className="py-4 px-8 font-semibold">NET SALARY</th>
                  <th className="py-4 px-8 font-semibold text-right pr-14">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {payslips.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-400 font-normal">
                      No matching employee payslip entries found.
                    </td>
                  </tr>
                ) : (
                  payslips.map((slip) => (
                    <tr
                      key={slip._id || slip.id}
                      className="hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="py-5 px-8 text-gray-900 font-normal">
                        {typeof slip.employee === 'object'
                          ? `${slip.employee?.firstName || ''} ${slip.employee?.lastName || ''}`.trim()
                          : slip.employeeName || slip.employee}
                      </td>
                      <td className="py-5 px-8 text-gray-500 font-normal">
                        {new Date(slip.month).toLocaleString('en-US', { month: 'short' }) +
                          ',' +
                          slip.year}
                      </td>
                      <td className="py-5 px-8 text-gray-500 font-normal">
                        {typeof slip.baseSalary === 'number'
                          ? `$${slip.baseSalary.toLocaleString()}`
                          : slip.baseSalary}
                      </td>
                      <td className="py-5 px-8 text-gray-900 font-bold">
                        {typeof slip.netSalary === 'number'
                          ? `$${slip.netSalary.toLocaleString()}`
                          : slip.netSalary}
                      </td>
                      <td className="py-5 px-8 text-right pr-8">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDownload(slip._id || slip.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eef0ff] hover:bg-[#e2e5ff] text-[#4c3dec] rounded-md text-[11px] font-semibold transition-colors"
                          >
                            <Download size={12} strokeWidth={2.5} />
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal rendered in Admin View */}
        <GeneratePayslipModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchPayslipData}
        />
      </div>
    );
  }

  // --- VIEW BRANCH 2: REGULAR EMPLOYEE HISTORIC HISTORY ---
  return (
    <div className="w-full space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-950">Payslips</h1>
        <p className="text-xs text-gray-400">Your payslip history</p>
      </header>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/40 border-b border-gray-100 text-[11px] font-bold text-gray-400 tracking-wider">
                <th className="py-4 px-8 font-semibold">PERIOD</th>
                <th className="py-4 px-8 font-semibold">BASIC SALARY</th>
                <th className="py-4 px-8 font-semibold">NET SALARY</th>
                <th className="py-4 px-8 font-semibold text-right pr-14">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {payslips.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-gray-400 font-normal">
                    You have no structural payslip records logged yet.
                  </td>
                </tr>
              ) : (
                payslips.map((slip) => (
                  <tr key={slip._id || slip.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-5 px-8 text-gray-500 font-normal">
                      {new Date(slip.month).toLocaleString('en-US', { month: 'short' }) +
                        ',' +
                        slip.year}
                    </td>
                    <td className="py-5 px-8 text-gray-500 font-normal">
                      {typeof slip.baseSalary === 'number'
                        ? `$${slip.baseSalary.toLocaleString()}`
                        : slip.baseSalary}
                    </td>
                    <td className="py-5 px-8 text-gray-900 font-bold">
                      {typeof slip.netSalary === 'number'
                        ? `$${slip.netSalary.toLocaleString()}`
                        : slip.netSalary}
                    </td>
                    <td className="py-5 px-8 text-right pr-8">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDownload(slip._id || slip.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eef0ff] hover:bg-[#e2e5ff] text-[#4c3dec] rounded-md text-[11px] font-semibold transition-colors"
                        >
                          <Download size={12} strokeWidth={2.5} />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Payslip;
