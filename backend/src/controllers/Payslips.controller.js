const Payslip = require("../module/Payslips.module");
const mongoose = require("mongoose");
const Employee = require("../module/Employee.module");
const PayslipsModule = require("../module/Payslips.module");

// Create a new payslip
exports.createPayslip = async (req, res) => {
  try {
    const { employeeId, month, year, baseSalary, allowances, deductions } =
      req.body;

    if (
      !employeeId ||
      !month ||
      !year ||
      baseSalary < 0 ||
      allowances < 0 ||
      deductions < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input. Please provide all required fields and ensure financial amounts are positive numbers.",
      });
    }

    // Basic calculation logic
    const totalEarnings = Number(baseSalary || 0) + Number(allowances || 0);
    const netSalary = totalEarnings - Number(deductions || 0);

    const newPayslip = new Payslip({
      employeeId,
      month,
      year,
      baseSalary,
      allowances,
      deductions,
      netSalary,
    });

    const savedPayslip = await newPayslip.save();
    res.status(201).json({ success: true, data: savedPayslip });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all payslips with employee details populated
exports.getAllPayslips = async (req, res) => {
  try {
    const session = req.session;
    const isAdmin = session.role === "admin";
    if (isAdmin) {
      const payslips = await Payslip.find()
        .populate("employeeId")
        .sort({ createdAt: -1 });

      const data = payslips.map((p) => {
        const obj = p.toObject();
        return {
          ...obj,
          id: obj._id.toString(),
          employee: obj.employeeId,
          employeeId: obj.employeeId?._id.toString(),
        };
      });
      return res.json({ data });
    } else {
      const employee = await Employee.findOne({ userId: session.userId });
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      const payslips = PayslipsModule.find({ employeeId: employee._id }).sort({
        createdAt: -1,
      });

      return res
        .status(200)
        .json({ success: true,  data: payslips });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single payslip by ID
exports.getPayslipById = async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id).populate(
      "employeeId",
    ).lean()
    if (!payslip) {
      return res
        .status(404)
        .json({ success: false, message: "Payslip not found" });
    }
    const result={
        ...payslip,
        id:payslip._id.toString(),
        employee:payslip.employeeId
    }
    res.status(200).json({ success: true, data: payslip });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a payslip
exports.deletePayslip = async (req, res) => {
  try {
    const deletedPayslip = await Payslip.findByIdAndDelete(req.params.id);
    if (!deletedPayslip) {
      return res
        .status(404)
        .json({ success: false, message: "Payslip not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Payslip deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
