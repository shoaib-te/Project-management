const express = require("express");
const router = express.Router();
const payslipController = require("../controllers/Payslips.controller");
const { authmiddleware, adminmiddleware } = require("../middleware/User.moddleware");

// POST /api/payslips - Create a payslip
router.post("/",authmiddleware,adminmiddleware, payslipController.createPayslip);

// GET /api/payslips - Get all payslips
router.get("/", payslipController.getAllPayslips);

// GET /api/payslips/:id - Get one specific payslip
router.get("/:id", payslipController.getPayslipById);

// DELETE /api/payslips/:id - Delete a payslip
router.delete("/:id", payslipController.deletePayslip);

module.exports = router;
