const express = require("express");
const router = express.Router();
const payslipController = require("../controllers/Payslips.controller");
const { authmiddleware, adminmiddleware } = require("../middleware/User.moddleware"); // Note: check 'moddleware' spelling

/**
 * @route   POST /api/payslips
 * @desc    Create a new payslip for an employee
 * @access  Private (Requires Admin permissions)
 */
router.post("/", authmiddleware, adminmiddleware, payslipController.createPayslip);

/**
 * @route   GET /api/payslips
 * @desc    Retrieve a list of all payslips
 * @access  Public / Private (Consider adding authmiddleware here to protect data)
 */
router.get("/",authmiddleware, payslipController.getAllPayslips);

/**
 * @route   GET /api/payslips/:id
 * @desc    Get details of a specific payslip by its ID
 * @access  Public / Private (Consider adding authmiddleware here to protect data)
 */
router.get("/:id", authmiddleware, payslipController.getPayslipById);

/**
 * @route   DELETE /api/payslips/:id
 * @desc    Delete a specific payslip by its ID
 * @access  Public / Private (Consider adding authmiddleware and adminmiddleware here)
 */
router.delete("/:id", payslipController.deletePayslip);

module.exports = router;
