import express from 'express';
const router = express.Router();
import {
  createPayslip,
  getAllPayslips,
  getPayslipById,
  deletePayslip,
} from '../controllers/Payslips.controller.js';
import { authmiddleware, adminmiddleware } from '../middleware/User.moddleware.js';

/**
 * @route   POST /api/payslips
 * @desc    Create a new payslip for an employee
 * @access  Private (Requires Admin permissions)
 */
router.post('/', authmiddleware, adminmiddleware, createPayslip);

/**
 * @route   GET /api/payslips
 * @desc    Retrieve a list of all payslips
 * @access  Public / Private (Consider adding authmiddleware here to protect data)
 */
router.get('/', authmiddleware, getAllPayslips);

/**
 * @route   GET /api/payslips/:id
 * @desc    Get details of a specific payslip by its ID
 * @access  Public / Private (Consider adding authmiddleware here to protect data)
 */
router.get('/:id', authmiddleware, getPayslipById);

/**
 * @route   DELETE /api/payslips/:id
 * @desc    Delete a specific payslip by its ID
 * @access  Public / Private (Consider adding authmiddleware and adminmiddleware here)
 */
router.delete('/:id', deletePayslip);

export default router;
