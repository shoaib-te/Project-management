import React, { useCallback, useEffect, useState } from "react";
import { Plus, Search, ChevronDown } from "lucide-react";
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "./Employeeform";
import apiClient from "../lib/axios";
import toast from "react-hot-toast";

export default function Employee() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  
  // FIXED: Changed false to null to store the whole employee object when editing
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Filter employees based on search term and selected department
  const filteredEmployees = employees.filter((emp) => {
    // Fallback strings to protect against undefined database fields
    const name = emp.name || "";
    const dept = emp.department || "";
    
    const matchesSearch = name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      dept === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const departments = [
    "Engineering",
    "Human Resources",
    "Marketing",
    "Sales",
    "Finance",
    "Operations",
    "IT Support",
    "Customer Success",
    "Product Management",
    "Design",
  ];

  const fetchEmployees = useCallback(async () => {
    setLoading(true); 
    try {
      // Logic adjusted to match API parameter strings accurately
      const url = selectedDepartment !== "All Departments" 
        ? `/api/employees?department=${selectedDepartment}` 
        : "/api/employees";
      
      const res = await apiClient.get(url);
      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // NEW: Connected Delete API Logic
  const handleDeleteEmployee = async (id) => {
   
    
    try {
      await apiClient.delete(`/api/employees/${id}`);
      toast.success('employee is deleting ')
      } catch (error) {
      console.error("Failed to delete employee", error);
      toast.error("Error deleting employee. Please try again.");
    }
  };

  // NEW: Triggers the edit form modal with existing data
  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  // NEW: Handles closing the form modal cleanly and resetting states
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
    fetchEmployees(); // Refresh data grid dynamically after submit
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center font-sans">
        <p className="text-gray-500 font-medium">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-50/50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Block */}
        <div className="flex justify-between items-start gap-4">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-950">Employees</h1>
            <p className="text-sm text-gray-500">Manage your team members</p>
          </header>

          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1.5 bg-[#5d4eff] hover:bg-[#4c3dec] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Employee
          </button>
        </div>

        {/* Filter Controls Block */}
        <div className="flex gap-3">
          {/* Search Input */}
          <div className="relative flex-grow max-w-3xl">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5d4eff] transition-colors"
            />
          </div>

          {/* Department Select Dropdown */}
          <div className="relative min-w-[180px]">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:border-[#5d4eff] focus:ring-1 focus:ring-[#5d4eff]"
            >
              <option value="All Departments">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Dynamic Responsive Employee Grid */}
        <div className="flex flex-wrap gap-5 pt-2">
          {filteredEmployees.length === 0 ? (
            <p className="text-gray-500 font-medium">No employees found.</p>
          ) : (
            filteredEmployees.map((emp) => (
              
              <EmployeeCard
                // FIXED: Changed key from index to unique emp.id for secure rendering
                key={emp.id} 
                name={emp.firstName}
                role={emp.role}
                position={emp.position}
                isDeleted={emp.isDeleted}
                department={emp.department}
                initials={emp.firstName.charAt(0)}
                // FIXED: Hooked up actions
                onEdit={() => handleEditClick(emp)}
                onDelete={() => handleDeleteEmployee(emp.id)}
              />
            ))
          )}
        </div>

        {/* Conditional Modal Overlay for EmployeeForm */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full relative overflow-hidden">
              {/* FIXED: Passing down active editing data or null if creating fresh */}
              <EmployeeForm 
                employeeData={editingEmployee} 
                onClose={handleCloseForm} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
