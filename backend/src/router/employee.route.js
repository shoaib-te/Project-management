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
} = require("../middleware/User.moddleware");

// Employee Routes
// get /api/employees
router.get("/", authmiddleware, adminmiddleware, getAllEmployees);
// post /api/employees
router.post("/", authmiddleware, adminmiddleware, createEmployee);
// put /api/employees/:id
router.put("/:id", authmiddleware, adminmiddleware, updateEmployee);
// delete /api/employees/:id
router.delete("/:id", authmiddleware, adminmiddleware, deleteEmployee);

module.exports = router;
