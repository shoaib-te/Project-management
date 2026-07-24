const mongoose = require("mongoose");

const payslipSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Must exactly match your Employee model name
    required: true,
  },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  baseSalary: { type: Number, required: true, default: 0 },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Payslip", payslipSchema);
