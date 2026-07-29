const express = require("express");
const router = express.Router();
const {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");
const {
  authmiddleware,
  adminmiddleware,
} = require("../middleware/User.moddleware"); // Note: check 'moddleware' spelling

/**
 * @route   GET /api/employees
 * @desc    Retrieve a list of all employees
 * @access  Private (Requires Admin permissions)
 */
router.get("/", authmiddleware, adminmiddleware, getAllEmployees);

/**
 * @route   POST /api/employees
 * @desc    Create and onboard a new employee profile
 * @access  Private (Requires Admin permissions)
 */
router.post("/", authmiddleware, adminmiddleware, createEmployee);

/**
 * @route   PUT /api/employees/:id
 * @desc    Update an existing employee's details by ID
 * @access  Private (Requires Admin permissions)
 */
router.put("/:id", authmiddleware, adminmiddleware, updateEmployee);

/**
 * @route   DELETE /api/employees/:id
 * @desc    Remove an employee from the system by ID
 * @access  Private (Requires Admin permissions)
 */
router.delete("/:id", authmiddleware, adminmiddleware, deleteEmployee);

module.exports = router;
