import React from 'react'
import { Plus, Download } from 'lucide-react';
function Payslip() {
   const payslips = [
    { id: 1, employee: 'David Michael', period: 'February 2026', basicSalary: '$2,000', netSalary: '$2,180' },
    { id: 2, employee: 'Alex Matthew', period: 'February 2026', basicSalary: '$2,000', netSalary: '$2,180' },
    { id: 3, employee: 'John Doe', period: 'February 2026', basicSalary: '$1,000', netSalary: '$1,090' },
    { id: 4, employee: 'David Michael', period: 'January 2026', basicSalary: '$1,000', netSalary: '$1,180' },
    { id: 5, employee: 'Alex Matthew', period: 'January 2026', basicSalary: '$2,000', netSalary: '$2,090' },
    { id: 6, employee: 'John Doe', period: 'January 2026', basicSalary: '$2,000', netSalary: '$2,090' },
  ];

  const payslipHistory = [
    { id: 1, period: 'February 2026', basicSalary: '$2,000', netSalary: '$2,180' },
    { id: 2, period: 'January 2026', basicSalary: '$1,000', netSalary: '$1,180' },
  ];


  const handleDownload = (id) => {
    // Action handler logic for exporting files
    console.log(`Downloading payslip ID: ${id}`);
  };
  


  const data={role:""}
  if(data.role=== 'admin'){
    return(
      <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Block Container */}
        <div className="flex justify-between items-start gap-4">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-950">Payslips</h1>
            <p className="text-sm text-gray-500">Generate and manage employee payslips</p>
          </header>
          
          <button className="flex items-center gap-1.5 bg-[#4c3dec] hover:bg-[#3b2fc4] text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors">
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
                {payslips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Employee Identity Name */}
                    <td className="py-5 px-8 text-gray-900 font-normal">{slip.employee}</td>
                    
                    {/* Distribution Accounting Period */}
                    <td className="py-5 px-8 text-gray-500 font-normal">{slip.period}</td>
                    
                    {/* Formatted Base Salary String */}
                    <td className="py-5 px-8 text-gray-500 font-normal">{slip.basicSalary}</td>
                    
                    {/* Bold Final Calculated Payout Value */}
                    <td className="py-5 px-8 text-gray-900 font-bold">{slip.netSalary}</td>
                    
                    {/* Download Button Column Cell */}
                    <td className="py-5 px-8 text-right pr-8">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDownload(slip.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eef0ff] hover:bg-[#e2e5ff] text-[#4c3dec] rounded-md text-[11px] font-semibold transition-colors"
                        >
                          <Download size={12} strokeWidth={2.5} />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
    )
  }else{
  return (
    <div className="min-h-screen bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Simplified Header Block */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-950">Payslips</h1>
          <p className="text-xs text-gray-400">Your payslip history</p>
        </header>

        {/* Data Table Card Section */}
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
                {payslipHistory.map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Distribution Accounting Period */}
                    <td className="py-5 px-8 text-gray-500 font-normal">{slip.period}</td>
                    
                    {/* Formatted Base Salary String */}
                    <td className="py-5 px-8 text-gray-500 font-normal">{slip.basicSalary}</td>
                    
                    {/* Bold Final Calculated Payout Value */}
                    <td className="py-5 px-8 text-gray-900 font-bold">{slip.netSalary}</td>
                    
                    {/* Download Button Column Cell */}
                    <td className="py-5 px-8 text-right pr-8">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDownload(slip.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eef0ff] hover:bg-[#e2e5ff] text-[#4c3dec] rounded-md text-[11px] font-semibold transition-colors"
                        >
                          <Download size={12} strokeWidth={2.5} />
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
}

export default Payslip

